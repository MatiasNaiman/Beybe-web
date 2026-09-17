"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useShop } from "./shop-provider";
import {
  formatMoney,
  minimums,
  type Channel,
  type Quote,
} from "@/lib/commerce";
type ServerQuote = Quote & { contactUrl: string | null };
export function Cart({ channel }: { channel: Channel }) {
  const { carts, ready, setQuantity, remove } = useShop();
  const lines = carts[channel];
  const [result, setResult] = useState<{
    key: string;
    quote: ServerQuote;
  } | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
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
      .then(async (response) => {
        if (!response.ok)
          throw new Error("No pudimos actualizar tu bolsa. Intentá de nuevo.");
        return response.json();
      })
      .then((quote: ServerQuote) => setResult({ key, quote }))
      .catch((e) => {
        if (e.name !== "AbortError")
          setError(
            "No pudimos actualizar tu bolsa. Revisá tu conexión y volvé a intentar.",
          );
      });
    return () => controller.abort();
  }, [key, ready, retry]);
  const quote = result?.key === key ? result.quote : null;
  const loading = !ready || (!quote && !error);
  return (
    <>
      <nav className="segmented" aria-label="Bolsa por modalidad">
        {(["minorista", "mayorista"] as const).map((c) => (
          <Link
            key={c}
            aria-current={channel === c ? "page" : undefined}
            href={`/bolsa?modalidad=${c}`}
          >
            {c === "minorista" ? "Minorista" : "Mayorista"} (
            {carts[c].reduce((n, i) => n + i.quantity, 0)})
          </Link>
        ))}
      </nav>
      <p className="muted">
        Compra mínima {formatMoney(minimums[channel])}. Cada modalidad conserva
        su propia bolsa.
      </p>
      {error && (
        <div role="alert" className="notice">
          {error}{" "}
          <button
            onClick={() => setRetry((n) => n + 1)}
            className="text-button"
          >
            Reintentar
          </button>
        </div>
      )}
      {loading && (
        <p role="status" className="notice">
          Actualizando tu bolsa…
        </p>
      )}
      {ready && lines.length === 0 ? (
        <div className="empty-bag">
          <ShoppingBag size={42} strokeWidth={1} />
          <h2>Tu bolsa espera pequeños detalles.</h2>
          <p>
            Cuando el catálogo esté disponible, vas a poder reunir acá tus
            favoritos.
          </p>
          <Link href={`/catalogo?modalidad=${channel}`} className="button">
            Explorar el catálogo
          </Link>
        </div>
      ) : (
        quote && (
          <div className="cart-layout">
            <div>
              {quote.errors.length > 0 && (
                <div className="notice" role="alert">
                  {quote.errors.map((e, i) => (
                    <p key={i}>{e}</p>
                  ))}
                  <p>
                    Eliminá los artículos que necesiten revisión y volvé a
                    elegirlos del catálogo.
                  </p>
                </div>
              )}
              {lines.map((line) => {
                const item = quote.items.find(
                  (i) =>
                    i.productId === line.productId &&
                    i.variantId === line.variantId,
                );
                return (
                  <article
                    className="cart-item"
                    key={line.productId + line.variantId}
                  >
                    {item && (
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={90}
                        height={110}
                      />
                    )}
                    <div className="cart-item-copy">
                      <h2>{item?.name ?? "Artículo a revisar"}</h2>
                      <p>
                        {item?.label ??
                          "Ya no está disponible con esta cantidad o modalidad."}
                      </p>
                      {item && (
                        <>
                          <p>{formatMoney(item.price)} por unidad</p>
                          <div className="quantity-control">
                            <button
                              aria-label={`Reducir cantidad de ${item.name}`}
                              disabled={line.quantity <= item.minQuantity}
                              onClick={() =>
                                setQuantity(channel, {
                                  ...line,
                                  quantity: line.quantity - item.step,
                                })
                              }
                            >
                              <Minus size={16} />
                            </button>
                            <output aria-label="Cantidad">
                              {line.quantity}
                            </output>
                            <button
                              aria-label={`Aumentar cantidad de ${item.name}`}
                              disabled={line.quantity + item.step > item.stock}
                              onClick={() =>
                                setQuantity(channel, {
                                  ...line,
                                  quantity: line.quantity + item.step,
                                })
                              }
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="cart-item-end">
                      {item && <strong>{formatMoney(item.total)}</strong>}
                      <button
                        className="icon-button"
                        aria-label={`Eliminar ${item?.name ?? "artículo"}`}
                        onClick={() =>
                          remove(channel, line.productId, line.variantId)
                        }
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            <aside className="order-summary">
              <h2>Tu pedido</h2>
              <div className="summary-total">
                <span>Subtotal</span>
                <strong>{formatMoney(quote.total)}</strong>
              </div>
              <p className="muted">Envío a coordinar. Precios en ARS.</p>
              <progress
                value={Math.min(quote.total, quote.minimum)}
                max={quote.minimum}
                aria-label="Progreso hacia el mínimo de compra"
              />
              <p role="status">
                {quote.remaining > 0
                  ? `Te faltan ${formatMoney(quote.remaining)} para el mínimo.`
                  : "Alcanzaste el mínimo de compra."}
              </p>
              {channel === "mayorista" && quote.contactUrl ? (
                <a
                  className="button"
                  href={quote.contactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consultar pedido por WhatsApp ↗
                </a>
              ) : (
                <>
                  <button className="button" disabled>
                    {channel === "mayorista"
                      ? "Solicitud todavía no disponible"
                      : "Checkout próximamente"}
                  </button>
                  <p className="fine-print">
                    {channel === "mayorista"
                      ? "El canal de WhatsApp comercial se habilitará antes de recibir pedidos."
                      : "Mercado Pago, transferencia y efectivo: formas de pago previstas, pendientes de validación."}
                  </p>
                </>
              )}
              <p className="fine-print">
                El pedido se confirma únicamente después de validar precios,
                disponibilidad y forma de pago.
              </p>
            </aside>
          </div>
        )
      )}
    </>
  );
}
