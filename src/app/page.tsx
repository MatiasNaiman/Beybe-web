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
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">BEYBE · Ropa y accesorios para bebés</p>
            <h1 id="hero-title">
              Vistiendo
              <br />
              al futuro.
            </h1>
            <p className="hero-description">
              Acompañamos cada nueva historia con prendas
              <br className="desktop-break" /> y detalles hechos por nosotros,
              desde 1998.
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
            <p className="minimum-note">
              Minorista desde $50.000 · Mayorista desde $150.000
            </p>
          </div>
          <div className="hero-visual">
            <Image
              className="textile"
              src="/brand/textil.webp"
              alt=""
              fill
              sizes="(max-width: 760px) 90vw, 480px"
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
            <p className="eyebrow">Un mundo de pequeños detalles</p>
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
              <p className="eyebrow">Cada detalle cuenta</p>
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
      <section className="story-teaser container">
        <h2>Desde 1998, parte de sus primeros días.</h2>
        <p>
          Somos fabricantes. Elegimos acompañar a las familias con nuestra
          propia manera de hacer.
        </p>
        <Link className="text-link" href="/nosotros">
          Conocé nuestra historia <span aria-hidden="true">→</span>
        </Link>
      </section>
    </>
  );
}
