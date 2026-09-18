import Link from "next/link";
import { categories } from "@/data/categories";
import { catalog } from "@/lib/catalog";
import { channelFrom, formatMoney, minimums } from "@/lib/commerce";
import { ProductCard } from "@/components/product-card";
import { CatalogControls } from "@/components/catalog-controls";
import { Reveal } from "@/components/reveal";
export const metadata = { title: "Catálogo" };
type Params = Promise<Record<string, string | string[] | undefined>>;
export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const params = await searchParams,
    channel = channelFrom(params.modalidad),
    category = categories.find((c) => c.id === params.categoria);
  const query = typeof params.q === "string" ? params.q.slice(0, 100) : "",
    sort = typeof params.orden === "string" ? params.orden : "featured",
    available = params.disponible === "si";
  const products = await catalog.list({
    channel,
    category: category?.id,
    search: query,
    sort,
    available,
  });
  const link = (c = channel, id: string | undefined = category?.id) => {
    const qs = new URLSearchParams({ modalidad: c });
    if (id) qs.set("categoria", id);
    if (query) qs.set("q", query);
    if (sort !== "featured") qs.set("orden", sort);
    if (available) qs.set("disponible", "si");
    return "/catalogo?" + qs;
  };
  return (
    <div className="container page-section catalog-page">
      <div className="breadcrumb">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <span>Catálogo</span>
      </div>
      <div className="catalog-heading">
        <div>
          <h1>{category?.name ?? "Pequeños favoritos."}</h1>
          <p className="lead">Elegí cada detalle, a tu manera.</p>
        </div>
        <p className="catalog-minimum">
          Modalidad {channel}
          <strong>Desde {formatMoney(minimums[channel])}</strong>
          <span>Mínimo por pedido</span>
        </p>
      </div>
      <div className="catalog-toolbar">
        <nav className="segmented" aria-label="Modalidad de compra">
          {(["minorista", "mayorista"] as const).map((c) => (
            <Link
              key={c}
              href={link(c)}
              aria-current={c === channel ? "page" : undefined}
            >
              {c === "minorista" ? "Para mi bebé" : "Para mi negocio"}
            </Link>
          ))}
        </nav>
        <Link className="text-link" href={"/bolsa?modalidad=" + channel}>
          Ver mi bolsa →
        </Link>
      </div>
      <CatalogControls
        key={JSON.stringify(params)}
        channel={channel}
        categoryId={category?.id}
        query={query}
        sort={sort}
        available={available}
      />
      <div className="results-caption">
        <span>
          {products.length} {products.length === 1 ? "artículo" : "artículos"}
          {query ? " para “" + query + "”" : ""}
        </span>
        <span>Precios por presentación · ARS</span>
      </div>
      {products.length ? (
        <Reveal key={"results-" + JSON.stringify(params)}>
          <div className="product-grid">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} channel={channel} index={i} />
            ))}
          </div>
        </Reveal>
      ) : (
        <div className="empty-bag">
          <h2>No encontramos esa combinación.</h2>
          <p>Probá otro nombre o quitá los filtros para seguir explorando.</p>
          <Link
            className="button secondary"
            href={"/catalogo?modalidad=" + channel}
          >
            Ver todos los artículos
          </Link>
        </div>
      )}
    </div>
  );
}
