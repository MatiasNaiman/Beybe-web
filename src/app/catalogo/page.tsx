import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categories";
import { catalog } from "@/lib/catalog";
import { channelFrom, formatMoney, minimums } from "@/lib/commerce";
export const metadata: Metadata = { title: "Catálogo" };
type Params = Promise<Record<string, string | string[] | undefined>>;
export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const params = await searchParams;
  const channel = channelFrom(params.modalidad);
  const category = categories.find((c) => c.id === params.categoria);
  const query = typeof params.q === "string" ? params.q.slice(0, 100) : "";
  const products = await catalog.list({
    channel,
    category: category?.id,
    search: query,
  });
  const base = (id?: string) =>
    `/catalogo?modalidad=${channel}${id ? "&categoria=" + id : ""}`;
  return (
    <div className="container page-section">
      <div className="breadcrumb">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <span>Catálogo</span>
      </div>
      <p className="eyebrow">Para cada pequeño momento</p>
      <h1>{category?.name ?? "Nuestro catálogo"}</h1>
      <p className="lead">
        Prendas y detalles para acompañar sus primeros días.
      </p>
      <div className="catalog-toolbar">
        <nav className="segmented" aria-label="Modalidad de compra">
          {(["minorista", "mayorista"] as const).map((c) => (
            <Link
              aria-current={channel === c ? "page" : undefined}
              key={c}
              href={`/catalogo?modalidad=${c}${category ? "&categoria=" + category.id : ""}`}
            >
              {c === "minorista" ? "Para mi bebé" : "Para mi negocio"}
            </Link>
          ))}
        </nav>
        <p className="muted">Compra mínima {formatMoney(minimums[channel])}</p>
      </div>
      <form
        key={query + category?.id + channel}
        className="search-form"
        action="/catalogo"
        role="search"
      >
        <input type="hidden" name="modalidad" value={channel} />
        {category && (
          <input type="hidden" name="categoria" value={category.id} />
        )}
        <label className="sr-only" htmlFor="catalog-search">
          Buscar artículos
        </label>
        <input
          id="catalog-search"
          name="q"
          type="search"
          placeholder="Buscá por nombre o detalle…"
          defaultValue={query}
          maxLength={100}
        />
        <button className="button" type="submit">
          Buscar
        </button>
      </form>
      <nav className="category-filters" aria-label="Categorías">
        <Link href={base()} aria-current={!category ? "page" : undefined}>
          Todo
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={base(c.id)}
            aria-current={category?.id === c.id ? "page" : undefined}
          >
            {c.name}
          </Link>
        ))}
      </nav>
      {products.length ? (
        <div className="product-grid">
          {products.map((p) => {
            const prices = p.variants.flatMap((v) =>
              v.sales[channel] ? [v.sales[channel]!.price] : [],
            );
            return (
              <Link
                className="product-card"
                key={p.id}
                href={`/producto/${p.slug}?modalidad=${channel}`}
              >
                <div className="product-image">
                  <Image
                    src={p.images[0].src}
                    alt={p.images[0].alt}
                    fill
                    sizes="(max-width:600px) 90vw, 30vw"
                  />
                </div>
                <h2>{p.name}</h2>
                <p>Desde {formatMoney(Math.min(...prices))}</p>
                <span className="text-link">Ver detalles →</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="catalog-empty">
          <div className="empty-photo">
            <Image
              src={category?.image ?? categories[0].image}
              alt=""
              fill
              sizes="(max-width:600px) 90vw, 300px"
            />
            <span className="reference-label">Imagen de referencia</span>
          </div>
          <div>
            <p className="eyebrow">Estamos preparando cada detalle</p>
            <h2>
              {query
                ? "Todavía no encontramos ese artículo."
                : "Muy pronto, más BEYBE."}
            </h2>
            <p>
              {query
                ? "Podés probar otra búsqueda o recorrer nuestras categorías."
                : "Estamos preparando el catálogo de más de 120 artículos con sus fotografías, precios y disponibilidad."}
            </p>
            <p className="muted">
              La compra online todavía no está habilitada.
            </p>
            <Link href={query ? base() : "/ayuda"} className="button secondary">
              {query ? "Limpiar búsqueda" : "Conocé cómo comprar"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
