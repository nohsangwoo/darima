import { Redis } from "@upstash/redis";
import { createHash } from "node:crypto";

type RateLimitBackend = "redis" | "memory";
type RateLimitBlockReason = "in-flight" | "cooldown" | "storage-error";

type MemoryRateRecord = {
  inFlightUntil: number;
  lastAcceptedAt: number;
};

type ReservationOptions = {
  namespace: string;
  identity: string;
  cooldownSeconds: number;
  inFlightSeconds?: number;
  failClosed?: boolean;
};

export type RequestReservation =
  | {
      ok: true;
      backend: RateLimitBackend;
    }
  | {
      ok: false;
      backend: RateLimitBackend;
      reason: RateLimitBlockReason;
      retryAfter: number;
    };

const globalForGuard = globalThis as typeof globalThis & {
  __darimaRedisGuard?: Redis | null;
  __darimaMemoryRateLimit?: Map<string, MemoryRateRecord>;
};

const memoryRateLimit = globalForGuard.__darimaMemoryRateLimit ?? new Map<string, MemoryRateRecord>();
globalForGuard.__darimaMemoryRateLimit = memoryRateLimit;

function env(name: string) {
  return process.env[name]?.trim();
}

function secondsToMs(seconds: number) {
  return Math.max(1, Math.ceil(seconds)) * 1000;
}

function safeKeyPart(value: string) {
  return value.replace(/[^a-zA-Z0-9:_-]/g, "_").slice(0, 120);
}

function getRedisConfig() {
  const url = env("UPSTASH_REDIS_REST_URL") || env("KV_REST_API_URL");
  const token = env("UPSTASH_REDIS_REST_TOKEN") || env("KV_REST_API_TOKEN");

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

function getRedisClient() {
  if (globalForGuard.__darimaRedisGuard !== undefined) {
    return globalForGuard.__darimaRedisGuard;
  }

  const config = getRedisConfig();
  globalForGuard.__darimaRedisGuard = config ? new Redis(config) : null;
  return globalForGuard.__darimaRedisGuard;
}

function keyFor(namespace: string, phase: "cooldown" | "inflight", identity: string) {
  return `darima:${safeKeyPart(namespace)}:${phase}:${identity}`;
}

async function redisTtl(redis: Redis, key: string, fallbackSeconds: number) {
  const ttl = await redis.ttl(key);
  return typeof ttl === "number" && ttl > 0 ? ttl : fallbackSeconds;
}

async function reserveWithRedis(redis: Redis, options: ReservationOptions): Promise<RequestReservation> {
  const cooldownSeconds = Math.max(1, Math.ceil(options.cooldownSeconds));
  const inFlightSeconds = options.inFlightSeconds ? Math.max(1, Math.ceil(options.inFlightSeconds)) : 0;
  const now = String(Date.now());
  const cooldownKey = keyFor(options.namespace, "cooldown", options.identity);
  const inFlightKey = keyFor(options.namespace, "inflight", options.identity);

  if (inFlightSeconds > 0) {
    const inFlightReserved = await redis.set(inFlightKey, now, { ex: inFlightSeconds, nx: true });

    if (inFlightReserved !== "OK") {
      return {
        ok: false,
        backend: "redis",
        reason: "in-flight",
        retryAfter: await redisTtl(redis, inFlightKey, inFlightSeconds),
      };
    }
  }

  const cooldownReserved = await redis.set(cooldownKey, now, { ex: cooldownSeconds, nx: true });

  if (cooldownReserved !== "OK") {
    if (inFlightSeconds > 0) {
      await redis.del(inFlightKey);
    }

    return {
      ok: false,
      backend: "redis",
      reason: "cooldown",
      retryAfter: await redisTtl(redis, cooldownKey, cooldownSeconds),
    };
  }

  return { ok: true, backend: "redis" };
}

function pruneMemory(now: number, cooldownMs: number) {
  if (memoryRateLimit.size < 1000) return;

  for (const [key, record] of memoryRateLimit) {
    if (now - record.lastAcceptedAt > cooldownMs * 4 && record.inFlightUntil < now) {
      memoryRateLimit.delete(key);
    }
  }
}

function reserveWithMemory(options: ReservationOptions): RequestReservation {
  const now = Date.now();
  const cooldownMs = secondsToMs(options.cooldownSeconds);
  const inFlightMs = options.inFlightSeconds ? secondsToMs(options.inFlightSeconds) : 0;
  const key = `${safeKeyPart(options.namespace)}:${options.identity}`;

  pruneMemory(now, cooldownMs);

  const record = memoryRateLimit.get(key);

  if (record?.inFlightUntil && record.inFlightUntil > now) {
    return {
      ok: false,
      backend: "memory",
      reason: "in-flight",
      retryAfter: Math.max(1, Math.ceil((record.inFlightUntil - now) / 1000)),
    };
  }

  if (record?.lastAcceptedAt && now - record.lastAcceptedAt < cooldownMs) {
    return {
      ok: false,
      backend: "memory",
      reason: "cooldown",
      retryAfter: Math.max(1, Math.ceil((cooldownMs - (now - record.lastAcceptedAt)) / 1000)),
    };
  }

  memoryRateLimit.set(key, {
    inFlightUntil: inFlightMs > 0 ? now + inFlightMs : 0,
    lastAcceptedAt: now,
  });

  return { ok: true, backend: "memory" };
}

export function hasRedisRequestGuard() {
  return Boolean(getRedisConfig());
}

export function getClientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1"
  );
}

export function buildRequestIdentity(request: Request, parts: string[] = []) {
  const raw = [
    getClientIp(request),
    request.headers.get("user-agent") || "unknown-agent",
    request.headers.get("accept-language") || "unknown-language",
    ...parts,
  ].join("|");

  return createHash("sha256").update(raw).digest("hex");
}

export async function reserveRequestSlot(options: ReservationOptions): Promise<RequestReservation> {
  const redis = getRedisClient();

  if (redis) {
    try {
      return await reserveWithRedis(redis, options);
    } catch (error) {
      console.error("Redis request guard failed", error);

      if (options.failClosed ?? true) {
        return {
          ok: false,
          backend: "redis",
          reason: "storage-error",
          retryAfter: 10,
        };
      }
    }
  }

  return reserveWithMemory(options);
}

export async function releaseRequestSlot(namespace: string, identity: string) {
  const redis = getRedisClient();

  if (redis) {
    try {
      await redis.del(keyFor(namespace, "inflight", identity));
    } catch (error) {
      console.error("Redis request guard release failed", error);
    }

    return;
  }

  const key = `${safeKeyPart(namespace)}:${identity}`;
  const record = memoryRateLimit.get(key);

  if (record) {
    record.inFlightUntil = 0;
  }
}
