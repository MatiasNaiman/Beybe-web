import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { CategoryGrid } from "@/components/category-grid";
import { WholesaleBanner } from "@/components/wholesale-banner";
import { HeroMotion } from "@/components/hero-motion";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { catalog } from "@/lib/catalog";
export default async function Home() {
  const featured = (
    await catalog.list({ channel: "minorista", available: true })
  ).slice(0, 3);
  return (
    <>
      <HeroMotion>
        <section
          className="hero container"
          aria-labelledby="hero-title"
          data-story-section="welcome"
        >
          <div className="hero-copy">
            <h1 id="hero-title">
              Vistiendo
              <br />
              al futuro.
            </h1>
            <p className="hero-description">
              Ropa y textiles para bebés, de fabricación propia desde 1998.
            </p>
            <div className="hero-actions">
              <div>
                <Link href="/catalogo" className="button">
                  Comprar para mi bebé
                </Link>
                <small className="mobile-minimum">Compra mínima $50.000</small>
              </div>
              <div>
                <Link href="/mayoristas" className="button secondary">
                  Comprar mayorista
                </Link>
                <small className="mobile-minimum">Pedido mínimo $150.000</small>
              </div>
            </div>
          </div>
          <div className="hero-visual" data-story-layer="textile">
            <Image
              className="textile"
              src="/brand/textil.webp"
              alt=""
              fill
              sizes="(max-width: 767px) 112px, 480px"
              priority
            />
            <div className="hero-brand">
              <Brand hero />
              <p>Vistiendo al futuro. Desde 1998.</p>
            </div>
          </div>
        </section>
      </HeroMotion>
      <div className="benefits">
        <div className="container">
          <span>Diseñamos y fabricamos</span>
          <span>Para cada pequeño momento</span>
          <span>Venta minorista y mayorista</span>
        </div>
      </div>
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
