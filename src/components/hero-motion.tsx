"use client";
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

export function HeroMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
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
          const photo = root.querySelector<HTMLElement>(".campaign-image")!;
          const flight = root.querySelector<HTMLElement>(".campaign-flight")!;
          const actions = gsap.utils.toArray<HTMLElement>(
            ".campaign-actions > div",
            root,
          );
          const header = () =>
            document.querySelector<HTMLElement>(".site-header")?.offsetHeight ??
            0;
          // Short screens retain normal scrolling so buying controls cannot be pinned offscreen.
          const canPin =
            Boolean(context.conditions?.tall) &&
            hero.offsetHeight <= window.innerHeight - header();
          const points = desktop
            ? canPin
              ? [
                  [0.88, -0.08],
                  [0.91, 0.08],
                  [0.86, 0.18],
                  [0.93, 0.3],
                  [0.88, 0.44],
                  [0.92, 0.58],
                  [0.9, 1.12],
                ]
              : [
                  [0.88, 0.22],
                  [0.91, 0.36],
                  [0.86, 0.5],
                  [0.93, 0.65],
                  [0.9, 1.14],
                ]
            : canPin
              ? [
                  [0.88, 0.18],
                  [0.92, 0.32],
                  [0.87, 0.48],
                  [0.94, 0.68],
                  [0.91, 0.76],
                  [0.89, 0.94],
                  [0.92, 1.08],
                ]
              : [
                  [0.88, 0.1],
                  [0.92, 0.22],
                  [0.87, 0.5],
                  [0.94, 0.89],
                  [0.91, 0.76],
                  [0.89, 0.94],
                  [0.92, 1.08],
                ];
          const route = () =>
            points.map(([x, y]) => ({
              x: x * photo.offsetWidth,
              y: y * (desktop ? photo.offsetHeight : hero.offsetHeight),
            }));
          gsap.set(flight, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
          const flap = gsap.timeline({ repeat: -1, paused: true });
          flap
            .to(
              ".campaign-wing-left",
              {
                scaleX: 0.92,
                rotation: -2,
                svgOrigin: "480 106",
                duration: 0.34,
                ease: "sine.inOut",
              },
              0,
            )
            .to(
              ".campaign-wing-right",
              {
                scaleX: 0.93,
                rotation: 2,
                svgOrigin: "500 106",
                duration: 0.34,
                ease: "sine.inOut",
              },
              0.025,
            )
            .to(
              ".campaign-wing-left",
              { scaleX: 1, rotation: 0, duration: 0.34, ease: "sine.inOut" },
              0.34,
            )
            .to(
              ".campaign-wing-right",
              { scaleX: 1, rotation: 0, duration: 0.34, ease: "sine.inOut" },
              0.365,
            );
          const fadeStart = desktop ? 0.9 : 0.88;
          const fadeEnd = 0.99;
          const entry = desktop ? 0.08 : 0.1;
          const updateFlap = (progress: number) => {
            if (!document.hidden && progress > entry && progress < fadeEnd)
              flap.play();
            else flap.pause();
          };
          let flightTween: gsap.core.Tween | undefined;
          const story = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: () => `top top+=${header() + (canPin ? 0 : 60)}`,
              end: () =>
                `+=${canPin ? window.innerHeight * (desktop ? 1.3 : 0.82) : Math.min(desktop ? 520 : 440, window.innerHeight * (desktop ? 0.82 : 0.7))}`,
              pin: canPin,
              scrub: 0.25,
              invalidateOnRefresh: true,
              onUpdate: (self) => updateFlap(self.progress),
              onRefreshInit: () => {
                if (flightTween)
                  flightTween.vars.motionPath = {
                    path: route(),
                    curviness: 1.4,
                    fromCurrent: false,
                    autoRotate: false,
                  };
              },
            },
          });
          story
            .to(
              flight,
              {
                motionPath: {
                  path: route(),
                  curviness: 1.4,
                  fromCurrent: false,
                  autoRotate: false,
                },
                duration: fadeEnd,
                ease: "none",
              },
              0,
            )
            .fromTo(
              flight,
              { autoAlpha: 0, scale: 0.84, rotation: -7 },
              { autoAlpha: 1, scale: 1, duration: 0.16, ease: "sine.inOut" },
              entry,
            )
            .to(
              flight,
              { rotation: 8, scale: 1.06, duration: 0.22, ease: "sine.inOut" },
              0.26,
            )
            .to(
              flight,
              { rotation: -5, scale: 1, duration: 0.22, ease: "sine.inOut" },
              0.48,
            )
            .to(
              flight,
              {
                autoAlpha: 0,
                scale: 0.9,
                duration: fadeEnd - fadeStart,
                ease: "sine.inOut",
              },
              fadeStart,
            )
            .to({}, { duration: 1 - fadeEnd }, fadeEnd);
          flightTween = story.getChildren(
            false,
            true,
            false,
          )[0] as gsap.core.Tween;
          if (canPin) {
            story
              .fromTo(
                actions[0],
                { autoAlpha: 0, y: 12 },
                { autoAlpha: 1, y: 0, duration: 0.22, ease: "power1.out" },
                0.18,
              )
              .fromTo(
                actions[1],
                { autoAlpha: 0, y: 12 },
                { autoAlpha: 1, y: 0, duration: 0.22, ease: "power1.out" },
                desktop ? 0.34 : 0.32,
              );
          }
          // Keyboard users get the actions without a required scroll gesture.
          const keyboard = (event: KeyboardEvent) => {
            if (event.key === "Tab") root.classList.add("campaign-keyboard");
            if (event.key === "Tab")
              gsap.set(actions, { autoAlpha: 1, y: 0, overwrite: true });
          };
          const visibility = () =>
            updateFlap(story.scrollTrigger?.progress ?? 0);
          document.addEventListener("keydown", keyboard);
          document.addEventListener("visibilitychange", visibility);
          return () => {
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
