"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useShop } from "./shop-provider";
import { formatMoney, type Quote } from "@/lib/commerce";
export function CheckoutPreview() {
  const { carts, ready } = useShop(),
    key = JSON.stringify({ channel: "minorista", lines: carts.minorista });
  const [result, setResult] = useState<{
      key: string;
      quote?: Quote;
      error?: string;
    } | null>(null),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();
    fetch("/api/checkout/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: key,
      signal: controller.signal,
    })
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok)
          throw new Error(body.error ?? "No pudimos revisar el pedido.");
        return body;
      })
      .then((body) => {
        if (!controller.signal.aborted) setResult({ key, quote: body.quote });
      })
      .catch((e) => {
        if (!controller.signal.aborted)
          setResult({ key, error: e.message ?? "Revisá tu conexión." });
      });
    return () => controller.abort();
  }, [key, ready, retry]);
  const current = result?.key === key ? result : null;
  return !current ? (
    <p role="status">Validando tu selección…</p>
  ) : current.error ? (
    <div className="notice" role="alert">
      <p>{current.error}</p>
      <Link className="button" href="/bolsa?modalidad=minorista">
        Volver a mi bolsa
      </Link>
      <button className="text-button" onClick={() => setRetry((n) => n + 1)}>
        Reintentar
      </button>
    </div>
  ) : (
    current.quote && (
      <div className="checkout-layout">
        <section>
          <p className="eyebrow">01 · Tu selección</p>
          <h2>Todo, a la vista.</h2>
          {current.quote.demo && (
            <p className="notice">
              Artículos y valores ficticios. Esta prueba no genera una compra.
            </p>
          )}
          <ul className="checkout-items">
            {current.quote.items.map((i) => (
              <li key={i.productId + i.variantId + i.presentationId}>
                <div>
                  <strong>{i.name}</strong>
                  <p>
                    {i.label} · {i.quantity} × {i.presentation}
                  </p>
                  <small>{i.sku}</small>
                </div>
                <strong>{formatMoney(i.total)}</strong>
              </li>
            ))}
          </ul>
          <div className="summary-total">
            <span>Subtotal de artículos</span>
            <strong>{formatMoney(current.quote.total)}</strong>
          </div>
          <p className="muted">Envío pendiente de calcular.</p>
          <Link className="text-link" href="/bolsa?modalidad=minorista">
            ← Modificar mi bolsa
          </Link>
        </section>
        <aside className="order-summary">
          <ShieldCheck size={28} strokeWidth={1.4} />
          <p className="eyebrow">02 · Próxima etapa</p>
          <h2>Compra con tranquilidad.</h2>
          <p>La integración de pagos todavía está pendiente.</p>
          <div className="payment-options">
            {["Mercado Pago", "Transferencia bancaria", "Efectivo"].map(
              (method) => (
                <div key={method}>
                  <strong>{method}</strong>
                  <span>Pendiente de validación</span>
                </div>
              ),
            )}
          </div>
          <button className="button" disabled>
            Pago no habilitado
          </button>
          <p className="fine-print">
            No se crea una orden ni se reserva stock. Envío, datos del comprador
            y pago se incorporarán antes de habilitar compras reales.
          </p>
        </aside>
      </div>
    )
  );
}
