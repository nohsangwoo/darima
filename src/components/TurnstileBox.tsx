"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileRenderOptions = {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement | string, options: TurnstileRenderOptions) => string;
      reset: (widgetId?: string) => void;
      remove?: (widgetId: string) => void;
    };
  }
}

type TurnstileBoxProps = {
  className?: string;
  onEnabledChange?: (enabled: boolean) => void;
  onTokenChange: (token: string) => void;
  resetKey?: number;
};

export default function TurnstileBox({
  className,
  onEnabledChange,
  onTokenChange,
  resetKey = 0,
}: TurnstileBoxProps) {
  const [configLoaded, setConfigLoaded] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [siteKey, setSiteKey] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const onEnabledChangeRef = useRef(onEnabledChange);
  const onTokenChangeRef = useRef(onTokenChange);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    onEnabledChangeRef.current = onEnabledChange;
    onTokenChangeRef.current = onTokenChange;
  }, [onEnabledChange, onTokenChange]);

  useEffect(() => {
    if (window.turnstile) {
      window.setTimeout(() => setScriptReady(true), 0);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/turnstile/site-key", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((config: { enabled?: boolean; siteKey?: string } | null) => {
        if (cancelled) return;

        const nextSiteKey = config?.siteKey || "";
        setSiteKey(nextSiteKey);
        onEnabledChangeRef.current?.(Boolean(nextSiteKey));
      })
      .catch(() => {
        if (!cancelled) {
          setSiteKey("");
          onEnabledChangeRef.current?.(false);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setConfigLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    onTokenChangeRef.current("");

    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [resetKey]);

  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current || !window.turnstile || widgetIdRef.current) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "dark",
      size: "flexible",
      callback: (token) => onTokenChangeRef.current(token),
      "expired-callback": () => onTokenChangeRef.current(""),
      "error-callback": () => onTokenChangeRef.current(""),
    });

    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [scriptReady, siteKey]);

  if (!configLoaded) {
    return <p className={className}>보안 인증 설정을 확인하는 중입니다.</p>;
  }

  if (!siteKey) {
    return <p className={className}>Turnstile site key가 설정되지 않았습니다.</p>;
  }

  return (
    <div className={className}>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} />
    </div>
  );
}
