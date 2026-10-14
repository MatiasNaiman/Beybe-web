"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP, ScrollTrigger);
export function Reveal({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const root = scope.current;
        if (!root) return;
        const desktop = matchMedia("(min-width: 768px)").matches;
        const categoryRows = desktop
          ? Array.from(
              root.querySelectorAll<HTMLElement>(".category-card"),
            ).reduce<HTMLElement[][]>((rows, card, index) => {
              const row = Math.floor(index / 3);
              (rows[row] ??= []).push(card);
              return rows;
            }, [])
          : [];

        categoryRows.forEach((row) => {
          gsap.from(row, {
            y: 10,
            opacity: 0.82,
            duration: 0.42,
            stagger: 0.035,
            ease: "power2.out",
            scrollTrigger: { trigger: row[0], start: "top 92%", once: true },
            clearProps: "transform,opacity",
          });
        });

        const lead = root.querySelector<HTMLElement>(
          ".featured-product--featured-lead .product-card-media",
        );
        if (lead) {
          gsap.from(lead, {
            y: 12,
            opacity: 0.84,
            duration: 0.46,
            ease: "power2.out",
            scrollTrigger: { trigger: lead, start: "top 92%", once: true },
            clearProps: "transform,opacity",
          });
        }

        const secondary = gsap.utils.toArray<HTMLElement>(
          ".featured-product--featured-secondary",
          root,
        );
        if (secondary.length) {
          gsap.from(secondary, {
            x: desktop ? 10 : 7,
            opacity: 0.86,
            duration: desktop ? 0.42 : 0.34,
            stagger: 0.045,
            ease: "power2.out",
            scrollTrigger: {
              trigger: secondary[0],
              start: "top 94%",
              once: true,
            },
            clearProps: "transform,opacity",
          });
        }
      });
      return () => media.revert();
    },
    { scope },
  );
  return <div ref={scope}>{children}</div>;
}
