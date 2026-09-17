import Link from "next/link";
export function WholesaleBanner({
  catalogLink = false,
}: {
  catalogLink?: boolean;
}) {
  return (
    <section className="wholesale-banner" aria-labelledby="wholesale-title">
      <div>
        <p className="eyebrow">Crecer juntos</p>
        <h2 id="wholesale-title">
          BEYBE también
          <br />
          en tu negocio.
        </h2>
      </div>
      <div className="wholesale-copy">
        <p>
          Conocé nuestro catálogo mayorista y armá tu pedido.
          <br />
          Compra mínima de $150.000.
        </p>
        <p className="muted">
          Enviá tu selección por WhatsApp para confirmar disponibilidad y
          coordinar la compra.
        </p>
        <Link
          href={catalogLink ? "/catalogo?modalidad=mayorista" : "/mayoristas"}
          className="button"
        >
          Comprar mayorista
        </Link>
      </div>
    </section>
  );
}
