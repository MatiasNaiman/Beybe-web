import Link from "next/link";
import { CampaignHero } from "@/components/campaign-hero";
import { CategoryGrid } from "@/components/category-grid";
import { CategoryStoryMotion } from "@/components/category-story-motion";
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
        <CategoryStoryMotion />
        <div className="section-heading">
          <div>
            <h2 id="categories-title">Encontrá lo que necesitás.</h2>
          </div>
          <Link className="text-link" href="/catalogo">
            Explorar todo el catálogo <span aria-hidden="true">→</span>
          </Link>
        </div>
        <CategoryGrid />
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
          <p className="featured-demo-note">
            Selección demostrativa. Imágenes y precios provisionales.
          </p>
          <Reveal>
            <div className="featured-editorial">
              <ProductCard
                product={featured[0]}
                channel="minorista"
                index={0}
                layout="featured-lead"
              />
              <div className="featured-secondary-list">
                {featured.slice(1).map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    channel="minorista"
                    index={i + 1}
                    layout="featured-secondary"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      )}
      <div className="container">
        <WholesaleBanner />
      </div>
    </>
  );
}
