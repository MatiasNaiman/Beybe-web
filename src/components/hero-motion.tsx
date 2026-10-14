"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import {
  collectExperimentalButterflyParts,
  createExperimentalButterflyMotion,
  prepareExperimentalButterfly,
  setExperimentalButterflyPose,
  type ButterflyTurnDirection,
} from "./experimental-butterfly-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

export function HeroMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const turnDirection = useRef<ButterflyTurnDirection>("left");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          all: "all",
          tall: "(min-height: 800px)",
          desktop: "(min-width:768px)",
          reduced: "(prefers-reduced-motion:reduce)",
        },
        (context) => {
          if (!scope.current || context.conditions?.reduced) return;

          const root = scope.current;
          const desktop = Boolean(context.conditions?.desktop);
          const hero = root.querySelector<HTMLElement>(".campaign-hero")!;
          const flight = root.querySelector<HTMLElement>(".campaign-flight")!;
          const actions = gsap.utils.toArray<HTMLElement>(
            ".campaign-actions > div",
            root,
          );
          const header = () =>
            document.querySelector<HTMLElement>(".site-header")?.offsetHeight ??
            0;
          const canPin =
            Boolean(context.conditions?.tall) &&
            hero.offsetHeight <= window.innerHeight - header();

          const butterflyParts = collectExperimentalButterflyParts(root);
          prepareExperimentalButterfly(butterflyParts);
          setExperimentalButterflyPose(butterflyParts, "open");

          const butterflyMotion = createExperimentalButterflyMotion(
            butterflyParts,
            "sequence",
            {
              paused: true,
              getTurnDirection: () => turnDirection.current,
            },
          );

          const route = () => {
            const width = hero.offsetWidth;
            const height = hero.offsetHeight;
            const halfButterfly = Math.max(flight.offsetWidth / 2, 48);
            const edgeGap = desktop ? 20 : 12;
            const minX = halfButterfly + edgeGap;
            const maxX = width - halfButterfly - edgeGap;

            const desktopShape: Array<[number, number]> = [
              [0.9, -0.04],
              [0.855, 0.11],
              [0.905, 0.27],
              [0.86, 0.44],
              [0.9, 0.62],
              [0.885, 0.79],
              [0.9, 0.97],
            ];
            const mobileShape: Array<[number, number]> = canPin
              ? [
                  [0.88, 0.08],
                  [0.92, 0.2],
                  [0.86, 0.34],
                  [0.93, 0.48],
                  [0.88, 0.61],
                  [0.94, 0.72],
                  [0.96, 0.78],
                  [0.94, 0.88],
                  [0.92, 1.23],
                  [0.86, 1.23],
                ]
              : [
                  [0.88, 0.06],
                  [0.92, 0.18],
                  [0.86, 0.32],
                  [0.93, 0.46],
                  [0.88, 0.59],
                  [0.94, 0.7],
                  [0.96, 0.76],
                  [0.94, 0.86],
                  [0.92, 1.23],
                  [0.86, 1.23],
                ];
            const shape = desktop ? desktopShape : mobileShape;
            const points = shape.map(([x, y]) => {
              const pointY = y * height;
              const desiredX = x * width;
              return {
                x: gsap.utils.clamp(minX, maxX, desiredX),
                y: pointY,
              };
            });
            const rotationLimit = desktop ? 10 : 9;
            const desktopRotationWeights = [1, 1, 0.9, 0.72, 0.5, 0.28, 0.12];
            const rotations = points.map((point, index) => {
              const previous = points[Math.max(0, index - 1)];
              const next = points[Math.min(points.length - 1, index + 1)];
              const dx = next.x - previous.x;
              const dy = Math.max(Math.abs(next.y - previous.y), height * 0.06);
              const tangent = (Math.atan2(dx, dy) * 180) / Math.PI;
              return gsap.utils.clamp(
                -rotationLimit,
                rotationLimit,
                tangent *
                  (desktop
                    ? 0.65 * (desktopRotationWeights[index] ?? 0.12)
                    : 0.34),
              );
            });

            return { points, rotations };
          };

          gsap.set(flight, {
            xPercent: -50,
            yPercent: -50,
            autoAlpha: 0,
          });

          const fadeStart = desktop ? 0.9 : 0.97;
          const fadeEnd = desktop ? 0.99 : 1;
          const motionEnd = desktop ? 0.97 : 1;
          const entry = desktop ? 0.035 : 0.08;
          let flightTween: gsap.core.Tween | undefined;
          let butterflyIsActive = false;

          const syncButterflyPlayback = () => {
            if (butterflyIsActive && !document.hidden) {
              butterflyMotion.resume();
            } else {
              butterflyMotion.pause();
            }
          };

          const story = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: () => `top top+=${header() + (canPin ? 0 : 60)}`,
              end: () =>
                `+=${
                  canPin
                    ? window.innerHeight * (desktop ? 0.98 : 1.05)
                    : Math.min(
                        desktop ? 430 : 560,
                        window.innerHeight * (desktop ? 0.68 : 0.95),
                      )
                }`,
              pin: canPin,
              scrub: 0.25,
              invalidateOnRefresh: true,
              onRefreshInit: () => {
                if (!flightTween) return;
                flightTween.vars.motionPath = {
                  path: route().points,
                  curviness: desktop ? 1.15 : 1.35,
                  fromCurrent: false,
                  autoRotate: false,
                };
                flightTween.invalidate();
              },
              onUpdate: (self) => {
                turnDirection.current = self.direction < 0 ? "right" : "left";
                butterflyIsActive =
                  self.isActive &&
                  self.progress >= entry * 0.65 &&
                  self.progress < fadeEnd;
                syncButterflyPlayback();
              },
              onToggle: (self) => {
                butterflyIsActive =
                  self.isActive &&
                  self.progress >= entry * 0.65 &&
                  self.progress < fadeEnd;
                syncButterflyPlayback();
              },
            },
          });

          const currentRoute = route();
          story.to(
            flight,
            {
              motionPath: {
                path: currentRoute.points,
                curviness: desktop ? 1.15 : 1.35,
                fromCurrent: false,
                autoRotate: false,
              },
              duration: motionEnd,
              ease: "none",
            },
            0,
          );
          const pathTweens = story.getChildren(false, true, false);
          flightTween = pathTweens[pathTweens.length - 1] as gsap.core.Tween;

          const segmentDuration = motionEnd / (currentRoute.points.length - 1);
          currentRoute.points.slice(1).forEach((_, index) => {
            story.to(
              flight,
              {
                rotation: () => route().rotations[index + 1],
                duration: segmentDuration,
                ease: "sine.inOut",
              },
              index * segmentDuration,
            );
          });

          story
            .fromTo(
              flight,
              { autoAlpha: 0, scale: 0.96 },
              { autoAlpha: 1, scale: 1, duration: 0.14, ease: "sine.inOut" },
              entry,
            )
            .to(
              flight,
              {
                scale: desktop ? 1.025 : 1.04,
                duration: 0.2,
                ease: "sine.inOut",
              },
              0.32,
            )
            .to(
              flight,
              {
                scale: desktop ? 0.99 : 0.98,
                duration: 0.19,
                ease: "sine.inOut",
              },
              0.52,
            )
            .to(
              flight,
              {
                scale: desktop ? 1.018 : 1.02,
                duration: 0.16,
                ease: "sine.inOut",
              },
              0.68,
            )
            .to(
              flight,
              {
                autoAlpha: 0,
                scale: 0.96,
                duration: fadeEnd - fadeStart,
                ease: "sine.inOut",
              },
              fadeStart,
            )
            .to({}, { duration: Math.max(0, 1 - fadeEnd) }, fadeEnd);

          story.fromTo(
            actions,
            { y: 4 },
            {
              y: 0,
              duration: 0.12,
              stagger: 0.03,
              ease: "power1.out",
            },
            0.04,
          );

          const bridge = root.querySelector<HTMLElement>(".campaign-bridge");
          if (bridge) {
            gsap.from(bridge.children, {
              y: 7,
              opacity: 0.88,
              duration: 0.36,
              stagger: 0.045,
              ease: "power2.out",
              scrollTrigger: {
                trigger: bridge,
                start: "top 94%",
                once: true,
              },
              clearProps: "transform,opacity",
            });
          }

          const keyboard = (event: KeyboardEvent) => {
            if (event.key !== "Tab") return;
            root.classList.add("campaign-keyboard");
            gsap.set(actions, { autoAlpha: 1, y: 0, overwrite: true });
          };
          const visibility = () => syncButterflyPlayback();
          document.addEventListener("keydown", keyboard);
          document.addEventListener("visibilitychange", visibility);

          return () => {
            butterflyMotion.kill();
            root.classList.remove("campaign-keyboard");
            document.removeEventListener("keydown", keyboard);
            document.removeEventListener("visibilitychange", visibility);
          };
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
