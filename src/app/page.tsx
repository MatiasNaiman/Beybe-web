import Link from "next/link";
import { CampaignHero } from "@/components/campaign-hero";
import { CategoryGrid } from "@/components/category-grid";
import { WholesaleBanner } from "@/components/wholesale-banner";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { catalog } from "@/lib/catalog";
export default async function Home() {
  const featured = (
    await catalog.list({ channel: "minorista", available: true })
  ).slice(0, 3);
  return (
    <>
      <CampaignHero />
      <section
        className="container categories-section"
        aria-labelledby="categories-title"
      >
        <div className="section-heading">
          <div>
            <h2 id="categories-title">Encontrá lo que necesitás.</h2>
          </div>
          <Link className="text-link" href="/catalogo">
            Explorar todo el catálogo <span aria-hidden="true">→</span>
          </Link>
        </div>
        <Reveal>
          <CategoryGrid />
        </Reveal>
        <p className="image-note">
          Imágenes ilustrativas provisionales. No representan los artículos
          BEYBE. <Link href="/creditos">Ver fuentes</Link>
        </p>
      </section>
      {featured.length > 0 && (
        <section className="container featured-section">
          <div className="section-heading">
            <div>
              <h2>Un pequeño vistazo.</h2>
            </div>
            <Link className="text-link" href="/catalogo">
              Ver todos los artículos →
            </Link>
          </div>
          <Reveal>
            <div className="product-grid">
              {featured.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  channel="minorista"
                  index={i}
                />
              ))}
            </div>
          </Reveal>
        </section>
      )}
      <div className="container">
        <WholesaleBanner />
      </div>
      <section className="story-teaser container" data-story-section="heritage">
        <div className="story-mark">
          1998<span>El comienzo de nuestra historia</span>
        </div>
        <div>
          <h2>Desde 1998, parte de sus primeros días.</h2>
          <p>
            Somos fabricantes. Elegimos acompañar a las familias con nuestra
            propia manera de hacer.
          </p>
          <Link className="text-link" href="/nosotros">
            Conocé nuestra historia <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
