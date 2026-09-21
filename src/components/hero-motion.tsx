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
      mm.add(
        {
          all: "all",
          desktop: "(min-width: 768px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (context.conditions?.reduced || !scope.current) return;
          const desktop = context.conditions?.desktop;
          const root = scope.current;
          const hero = root.querySelector<HTMLElement>(".campaign-hero")!;
          const flight = root.querySelector<HTMLElement>(".campaign-flight")!;
          // The mark stays rigid in a reserved lateral corridor. No wing deformation.
          gsap.from(".campaign-copy h1", {
            y: 8,
            opacity: 0.85,
            duration: 0.65,
            ease: "power2.out",
            clearProps: "transform,opacity",
          });
          gsap.from(".campaign-butterfly", {
            y: 4,
            rotation: -4,
            opacity: 0.4,
            duration: 0.8,
            ease: "sine.out",
            clearProps: "transform,opacity",
          });
          const distance = () => hero.offsetHeight + 46 - flight.offsetTop;
          const journey = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: "top top+=100",
              end: "bottom top+=180",
              scrub: 0.35,
              invalidateOnRefresh: true,
            },
          });
          journey
            .to(flight, {
              y: () => distance() * 0.32,
              x: desktop ? -6 : -2,
              rotation: -9,
              scale: 0.96,
              duration: 0.35,
              ease: "sine.inOut",
            })
            .to(flight, {
              y: () => distance() * 0.72,
              x: desktop ? 5 : 2,
              rotation: 7,
              scale: 1,
              duration: 0.4,
              ease: "sine.inOut",
            })
            .to(flight, {
              y: distance,
              x: 0,
              rotation: -3,
              opacity: 0,
              duration: 0.25,
              ease: "sine.in",
            });
          gsap.to(".campaign-photo", {
            scale: desktop ? 1.012 : 1.006,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top+=100",
              end: "bottom top",
              scrub: 0.35,
            },
          });
          // Native scrolling reveals the collections. No pin, scroll interception or
          // opacity gate on text/actions; matchMedia reverts all transforms on cleanup.
        },
      );
      return () => mm.revert();
    },
    { scope },
  );
  return (
    <div className="campaign-story" ref={scope}>
      {children}
    </div>
  );
}
