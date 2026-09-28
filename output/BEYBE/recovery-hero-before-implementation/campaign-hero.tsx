import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HeroMotion } from "./hero-motion";

export function CampaignHero() {
  return (
    <HeroMotion>
      <section
        className="campaign-hero container"
        aria-labelledby="hero-title"
        data-story-section="welcome"
      >
        <div className="campaign-copy">
          <h1 id="hero-title">
            Vistiendo
            <br />
            <em>al futuro.</em>
          </h1>
          <p className="campaign-description">
            Ropa y textiles para bebés, de fabricación propia desde 1998.
          </p>
          <div className="campaign-actions">
            <div>
              <Link className="button" href="/catalogo">
                Comprar para mi bebé{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <small>Compra mínima $50.000</small>
            </div>
            <div>
              <Link className="button secondary" href="/mayoristas">
                Comprar mayorista <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <small>Pedido mínimo $150.000</small>
            </div>
          </div>
        </div>
        <div className="campaign-image" data-story-layer="photograph">
          <picture>
            <source
              media="(min-width: 768px)"
              width="1672"
              height="941"
              sizes="(min-width: 1440px) 850px, 62vw"
              srcSet="/hero/bebe-desktop-960.webp 960w, /hero/bebe-desktop-1440.webp 1440w, /hero/bebe-desktop-1672.webp 1672w"
            />
            {/* A single picture selects one art direction before requesting the image. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="campaign-photo"
              src="/hero/bebe-mobile-768.webp"
              srcSet="/hero/bebe-mobile-480.webp 480w, /hero/bebe-mobile-768.webp 768w, /hero/bebe-mobile-941.webp 941w"
              sizes="(min-width: 600px) 500px, calc(100vw - 56px)"
              width="941"
              height="1672"
              alt="Bebé con conjunto y gorrito BEYBE en tono crema. Imagen generada con IA a partir de productos reales de la marca."
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
          </picture>
        </div>
      </section>
      <div className="campaign-flight" aria-hidden="true">
        <Image
          className="campaign-butterfly"
          src="/brand/butterfly.svg"
          alt=""
          width={276}
          height={226}
        />
      </div>
      <div className="campaign-bridge container" data-story-section="discovery">
        <p>Para cada pequeño comienzo.</p>
        <Link className="text-link" href="#categories-title">
          Descubrí las colecciones <ArrowDown size={17} aria-hidden="true" />
        </Link>
      </div>
    </HeroMotion>
  );
}
