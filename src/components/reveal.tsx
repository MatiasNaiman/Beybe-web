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
        const targets = scope.current?.querySelectorAll(
          ".product-card, .category-card, [data-reveal]",
        );
        targets?.forEach((target, index) => {
          gsap.from(target, {
            y: 22,
            opacity: 0,
            duration: 0.7,
            delay: (index % 3) * 0.055,
            ease: "power2.out",
            scrollTrigger: { trigger: target, start: "top 94%", once: true },
            clearProps: "transform,opacity",
          });
        });
      });
      return () => media.revert();
    },
    { scope },
  );
  return <div ref={scope}>{children}</div>;
}
