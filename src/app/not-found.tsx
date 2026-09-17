import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container page-section empty-bag">
      <p className="eyebrow">404</p>
      <h1>Por acá todavía no hay pequeños detalles.</h1>
      <p>La página o el artículo que buscás no está disponible.</p>
      <Link className="button" href="/catalogo">
        Volver al catálogo
      </Link>
    </div>
  );
}
