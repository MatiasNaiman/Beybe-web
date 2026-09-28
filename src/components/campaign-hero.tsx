import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { HeroMotion } from "./hero-motion";
import { CampaignButterfly } from "./campaign-butterfly";

export function CampaignHero() {
  return (
    <HeroMotion>
      <section
        className="campaign-hero"
        aria-labelledby="hero-title"
        data-story-section="welcome"
      >
        <div className="campaign-image">
          <picture>
            <source
              media="(min-width: 768px)"
              width={1672}
              height={941}
              sizes="100vw"
              srcSet="/hero/bebes-editorial-960.webp 960w, /hero/bebes-editorial-1440.webp 1440w, /hero/bebes-editorial-1672.webp 1672w"
            />
            {/* Art direction uses one responsive source, so mobile never downloads the desktop photograph. */}
            <img
              className="campaign-photo"
              src="/hero/bebe-mobile-768.webp"
              srcSet="/hero/bebe-mobile-480.webp 480w, /hero/bebe-mobile-768.webp 768w, /hero/bebe-mobile-941.webp 941w"
              sizes="100vw"
              width={941}
              height={1672}
              alt="Indumentaria BEYBE en una escena de bebés generada con inteligencia artificial."
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
          </picture>
        </div>
        <div className="campaign-copy">
          <h1 id="hero-title">
            Vistiendo
            <br />
            <em>al futuro.</em>
          </h1>
          <p className="campaign-description">
            <span>Ropa y textiles para bebés</span>
            <small>Fabricación propia · desde 1998</small>
          </p>
          <div className="campaign-actions">
            <div>
              <Link className="campaign-button" href="/catalogo">
                Comprar para mi bebé
              </Link>
              <small>Compra mínima $50.000</small>
            </div>
            <div>
              <Link
                className="campaign-button campaign-button-secondary"
                href="/mayoristas"
              >
                Comprar mayorista
              </Link>
              <small>Pedido mínimo $150.000</small>
            </div>
          </div>
        </div>
        <div className="campaign-flight" aria-hidden="true">
          <CampaignButterfly />
        </div>
      </section>
      <div className="campaign-bridge container" data-story-section="discovery">
        <p>Para cada pequeño comienzo.</p>
        <Link className="text-link" href="#categories-title">
          Descubrí las colecciones <ArrowDown size={16} aria-hidden="true" />
        </Link>
      </div>
    </HeroMotion>
  );
}
