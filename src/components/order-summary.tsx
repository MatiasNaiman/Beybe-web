import Link from "next/link";
import { formatMoney, type Channel } from "@/lib/commerce";
import type { ServerQuote } from "./use-quote";
export function OrderSummary({
  quote,
  channel,
  pending = false,
}: {
  quote: ServerQuote;
  channel: Channel;
  pending?: boolean;
}) {
  return (
    <aside className="order-summary">
      <p className="eyebrow">
        {channel === "minorista" ? "Para tu bebé" : "Para tu negocio"}
      </p>
      <h2>Tu selección</h2>
      {pending && (
        <p role="status" className="fine-print">
          Esperando la validación actualizada del servidor.
        </p>
      )}
      {quote.demo && (
        <p className="demo-note">
          Prueba: artículos, precios y stock ficticios.
        </p>
      )}
      <div className="summary-total">
        <span>Subtotal</span>
        <strong>{formatMoney(quote.total)}</strong>
      </div>
      <p className="muted">Total estimado sin envío · ARS</p>
      <progress
        value={Math.min(quote.total, quote.minimum)}
        max={quote.minimum}
        aria-label="Progreso hacia el mínimo de compra"
      />
      <p role="status">
        {quote.remaining > 0
          ? "Te faltan " + formatMoney(quote.remaining) + " para el mínimo."
          : "Alcanzaste el mínimo de compra."}
      </p>
      {channel === "mayorista" ? (
        quote.canRequest && quote.contactUrl ? (
          <a
            className="button"
            href={quote.contactUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {quote.demo ? "Abrir consulta de prueba" : "Consultar pedido"} por
            WhatsApp ↗
          </a>
        ) : (
          <button className="button" disabled>
            Completá tu pedido mayorista
          </button>
        )
      ) : quote.canRequest ? (
        <Link className="button" href="/checkout">
          Revisar pedido {quote.demo ? "de prueba" : ""} →
        </Link>
      ) : (
        <button className="button" disabled>
          Revisar pedido
        </button>
      )}
      <p className="fine-print">
        {channel === "mayorista"
          ? "Se abre un borrador en WhatsApp. BEYBE confirma disponibilidad, envío y pago. No se reserva stock."
          : "Mercado Pago, transferencia y efectivo pendientes de integración y validación. No se reciben pagos."}
      </p>
      {quote.demo && channel === "mayorista" && (
        <details className="order-draft">
          <summary>Ver contenido del borrador</summary>
          <pre>
            {quote.contactUrl
              ? new URL(quote.contactUrl).searchParams.get("text")
              : "El borrador estará disponible al alcanzar el mínimo."}
          </pre>
        </details>
      )}
    </aside>
  );
}
