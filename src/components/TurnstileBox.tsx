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
  deferUntilVisible?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  onTokenChange: (token: string) => void;
  resetKey?: number;
};

export default function TurnstileBox({
  className,
  deferUntilVisible = false,
  onEnabledChange,
  onTokenChange,
  resetKey = 0,
}: TurnstileBoxProps) {
  const [configLoaded, setConfigLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(!deferUntilVisible);
  const [scriptReady, setScriptReady] = useState(false);
  const [siteKey, setSiteKey] = useState("");
  const shellRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onEnabledChangeRef = useRef(onEnabledChange);
  const onTokenChangeRef = useRef(onTokenChange);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    onEnabledChangeRef.current = onEnabledChange;
    onTokenChangeRef.current = onTokenChange;
  }, [onEnabledChange, onTokenChange]);

  useEffect(() => {
    if (!deferUntilVisible || isVisible) {
      return;
    }

    const shell = shellRef.current;

    if (!shell || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "220px" },
    );

    observer.observe(shell);

    return () => observer.disconnect();
  }, [deferUntilVisible, isVisible]);

  useEffect(() => {
    if (window.turnstile) {
      window.setTimeout(() => setScriptReady(true), 0);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

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
  }, [isVisible]);

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
      size: "normal",
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
    return (
      <div ref={shellRef} className={className}>
        <p>보안 인증 설정을 확인하는 중입니다.</p>
      </div>
    );
  }

  if (!siteKey) {
    return (
      <div ref={shellRef} className={className}>
        <p>Turnstile site key가 설정되지 않았습니다.</p>
      </div>
    );
  }

  return (
    <div ref={shellRef} className={className}>
      <Script
        id="cloudflare-turnstile-api"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} />
    </div>
  );
}
