"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useShop } from "./shop-provider";
import { useQuote } from "./use-quote";
import { CartLine } from "./cart-line";
import { OrderSummary } from "./order-summary";
import { lineKey, formatMoney, minimums, type Channel } from "@/lib/commerce";
export function Cart({ channel }: { channel: Channel }) {
  const { carts, ready } = useShop(),
    lines = carts[channel],
    { quote, error, retry, loading } = useQuote(lines, channel, ready);
  return (
    <>
      <nav className="segmented" aria-label="Bolsa por modalidad">
        {(["minorista", "mayorista"] as const).map((c) => (
          <Link
            key={c}
            aria-current={c === channel ? "page" : undefined}
            href={"/bolsa?modalidad=" + c}
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
          <button className="text-button" onClick={retry}>
            Reintentar
          </button>
        </div>
      )}
      <p role="status" className="cart-status">
        {loading ? "Actualizando tu bolsa…" : ""}
      </p>
      {ready && lines.length === 0 ? (
        <div className="empty-bag">
          <ShoppingBag size={44} strokeWidth={1} />
          <h2>Acá empieza una linda selección.</h2>
          <p>Elegí tus favoritos y reuní cada pequeño detalle.</p>
          <Link href={"/catalogo?modalidad=" + channel} className="button">
            Explorar el catálogo
          </Link>
        </div>
      ) : (
        quote && (
          <div className="cart-layout">
            <div>
              {quote.errors.length > 0 && (
                <div className="notice" role="alert">
                  {quote.errors.map((e) => (
                    <p key={e}>{e}</p>
                  ))}
                  <p>
                    Corregí las cantidades o eliminá el artículo para continuar.
                  </p>
                </div>
              )}
              {lines.map((line) => (
                <CartLine
                  key={lineKey(line)}
                  line={line}
                  item={quote.items.find((i) => lineKey(i) === lineKey(line))}
                  channel={channel}
                />
              ))}
              <Link
                className="text-link"
                href={"/catalogo?modalidad=" + channel}
              >
                ← Seguir explorando
              </Link>
            </div>
            <OrderSummary
              quote={
                loading || error
                  ? { ...quote, canRequest: false, contactUrl: null }
                  : quote
              }
              channel={channel}
              pending={loading || !!error}
            />
          </div>
        )
      )}
    </>
  );
}
