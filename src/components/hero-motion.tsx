"use client";
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP, ScrollTrigger);
export function HeroMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-copy > *", {
          y: 18,
          opacity: 0.7,
          stagger: 0.065,
          duration: 0.75,
          ease: "power2.out",
          clearProps: "transform,opacity",
        });
        gsap.from(".hero-visual", {
          scale: 0.97,
          opacity: 0.7,
          duration: 1,
          ease: "power2.out",
          clearProps: "transform,opacity",
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
  return <div ref={scope}>{children}</div>;
}
