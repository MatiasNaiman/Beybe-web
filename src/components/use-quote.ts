"use client";
import { useEffect, useState } from "react";
import type { CartLine, Channel, Quote } from "@/lib/commerce";
export type ServerQuote = Quote & { contactUrl: string | null };
export function useQuote(lines: CartLine[], channel: Channel, ready: boolean) {
  const [result, setResult] = useState<{
      key: string;
      channel: Channel;
      quote: ServerQuote;
    } | null>(null),
    [error, setError] = useState(""),
    [retry, setRetry] = useState(0);
  const key = JSON.stringify({ channel, lines });
  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();
    setError("");
    fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: key,
      signal: controller.signal,
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("quote");
        return r.json();
      })
      .then((quote: ServerQuote) => {
        if (!controller.signal.aborted) setResult({ key, channel, quote });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError(
            "No pudimos actualizar tu bolsa. Revisá tu conexión y volvé a intentar.",
          );
      });
    return () => controller.abort();
  }, [key, channel, ready, retry]);
  const quote = result?.channel === channel ? result.quote : null;
  const loading = !ready || (result?.key !== key && !error);
  return {
    quote,
    error,
    retry: () => setRetry((n) => n + 1),
    loading,
  };
}
