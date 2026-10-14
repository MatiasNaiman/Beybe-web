"use client";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP, ScrollTrigger);
export function WholesaleBanner({
  catalogLink = false,
}: {
  catalogLink?: boolean;
}) {
  const scope = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const banner = scope.current;
        if (!banner) return;
        const lines = banner.querySelectorAll<HTMLElement>(
          ".wholesale-stitch, .wholesale-provenance",
        );
        gsap.fromTo(
          lines,
          { "--stitch-progress": "0%" },
          {
            "--stitch-progress": "100%",
            duration: 0.48,
            ease: "power2.out",
            scrollTrigger: { trigger: banner, start: "top 88%", once: true },
          },
        );
        if (matchMedia("(min-width: 768px)").matches) {
          gsap.fromTo(
            banner,
            { "--texture-opacity": 0.055 },
            {
              "--texture-opacity": 0.11,
              duration: 0.42,
              ease: "power1.out",
              scrollTrigger: { trigger: banner, start: "top 88%", once: true },
            },
          );
        }
      });
      return () => media.revert();
    },
    { scope },
  );
  return (
    <section
      ref={scope}
      className="wholesale-banner"
      aria-labelledby="wholesale-title"
    >
      <span className="wholesale-stitch" aria-hidden="true" />
      <div className="wholesale-heading">
        <h2 id="wholesale-title">
          BEYBE también
          <br />
          en tu negocio.
        </h2>
        <div className="wholesale-provenance" aria-label="Origen de BEYBE">
          <span>Fabricación propia</span>
          <span>Desde 1998</span>
        </div>
      </div>
      <div className="wholesale-copy">
        <p className="wholesale-intro">
          Conocé nuestro catálogo mayorista y armá tu pedido.
        </p>
        <p className="wholesale-minimum">Compra mínima de $150.000.</p>
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
