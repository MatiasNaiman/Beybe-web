"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ExperimentalButterfly } from "./experimental-butterfly";
import {
  collectExperimentalButterflyParts,
  createExperimentalButterflyMotion,
  prepareExperimentalButterfly,
} from "./experimental-butterfly-motion";
import styles from "./category-story-motion.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function CategoryStoryMotion() {
  const layer = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = layer.current;
      const section = root?.closest<HTMLElement>(".categories-section");
      if (!root || !section) return;

      const media = gsap.matchMedia();
      media.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 768px)",
        },
        (context) => {
          if (!context.conditions?.motion) return;
          const cards = gsap.utils.toArray<HTMLElement>(
            ".category-card",
            section,
          );
          const photos = cards
            .map((card) =>
              card.querySelector<HTMLImageElement>(".category-image img"),
            )
            .filter((photo): photo is HTMLImageElement => photo !== null);
          const underline = root.querySelector<SVGPathElement>(
            "[data-category-underline]",
          );
          const trail = root.querySelector<SVGPathElement>(
            "[data-category-trail]",
          );
          const flight = root.querySelector<SVGPathElement>(
            "[data-butterfly-flight]",
          );
          const svg = underline?.ownerSVGElement;
          const butterfly = root.querySelector<HTMLElement>(
            "[data-category-butterfly]",
          );
          const title = section.querySelector<HTMLElement>("#categories-title");
          const heading = title?.closest<HTMLElement>(".section-heading");
          const grid = section.querySelector<HTMLElement>(".category-grid");
          if (
            cards.length !== 6 ||
            photos.length !== 6 ||
            !underline ||
            !trail ||
            !flight ||
            !svg ||
            !butterfly ||
            !title ||
            !heading ||
            !grid
          )
            return;

          const rows = cards.reduce<HTMLElement[][]>((groups, card) => {
            const row = groups.find(
              (items) => Math.abs(items[0].offsetTop - card.offsetTop) < 2,
            );
            if (row) row.push(card);
            else groups.push([card]);
            return groups;
          }, []);

          const desktop = Boolean(context.conditions.desktop);
          const markerWidth = desktop ? 28 : 21;
          const markerHeight = markerWidth * (230 / 280);
          const underlineScroll = desktop ? 145 : 125;
          const flightScroll = desktop ? 300 : 180;
          const exitScroll = 70;

          let geometry = {
            underlineLength: 0,
            trailLength: 0,
            flightLength: 0,
            startX: 0,
            underlineEndX: 0,
            markerCenterY: 0,
            railEndY: 0,
            descentScroll: 1,
          };

          const positionThread = () => {
            const sectionRect = section.getBoundingClientRect();
            const titleRect = title.getBoundingClientRect();
            const headingRect = heading.getBoundingClientRect();
            const firstRowRect = rows[0][0].getBoundingClientRect();
            const gridRect = grid.getBoundingClientRect();
            const viewportWidth = document.documentElement.clientWidth;
            const rightGutter = Math.max(0, viewportWidth - sectionRect.right);
            const sectionWidth = section.clientWidth;
            const amplitude = Math.min(7, Math.max(3, rightGutter * 0.32));
            const railOffset = desktop
              ? Math.min(
                  28,
                  rightGutter * 0.52,
                  Math.max(0, rightGutter - markerWidth / 2 - 2),
                  Math.max(0, rightGutter - amplitude * 1.5 - 2),
                )
              : Math.min(
                  8,
                  rightGutter * 0.4,
                  Math.max(0, rightGutter - markerWidth / 2 - 2),
                  Math.max(0, rightGutter - amplitude * 1.5 - 2),
                );
            const railX = sectionWidth + railOffset;
            const width = Math.max(sectionWidth, railX + amplitude * 1.5 + 2);
            const height = section.scrollHeight;
            const textRange = document.createRange();
            textRange.selectNodeContents(title);
            const textRects = Array.from(textRange.getClientRects());
            const titleLeft =
              (textRects.length
                ? Math.min(...textRects.map((rect) => rect.left))
                : titleRect.left) - sectionRect.left;
            const titleRight =
              (textRects.length
                ? Math.max(...textRects.map((rect) => rect.right))
                : titleRect.right) - sectionRect.left;
            const underlineY = titleRect.bottom - sectionRect.top + 7;
            const markerCenterY = underlineY + 2 + markerHeight / 2;
            const headerEndY = headingRect.bottom - sectionRect.top + 16;
            const firstRowY = firstRowRect.top - sectionRect.top - 16;
            const railStartY = Math.max(headerEndY + 8, firstRowY);
            const railEndY = gridRect.bottom - sectionRect.top;
            const fmt = (value: number) => Number(value.toFixed(1));
            const entryX = Math.max(1, titleLeft - 18);

            // The title keeps its own stitched underline when the butterfly lifts off.
            let underlineD = `M ${fmt(entryX)} ${fmt(underlineY + 12)}`;
            underlineD += ` C ${fmt(entryX + 10)} ${fmt(underlineY - 7)}, ${fmt(titleLeft + 16)} ${fmt(underlineY - 5)}, ${fmt(titleLeft + 8)} ${fmt(underlineY + 2)}`;
            underlineD += ` C ${fmt(titleLeft + 2)} ${fmt(underlineY + 8)}, ${fmt(titleLeft + 1)} ${fmt(underlineY - 1)}, ${fmt(titleLeft + 9)} ${fmt(underlineY)}`;
            underlineD += ` C ${fmt(titleLeft + (titleRight - titleLeft) * 0.32)} ${fmt(underlineY - 2)}, ${fmt(titleLeft + (titleRight - titleLeft) * 0.72)} ${fmt(underlineY + 2)}, ${fmt(titleRight + 8)} ${fmt(underlineY)}`;
            const underlineEndX = titleRight + 8;
            const flightGap = railX - underlineEndX;
            let flightD: string;
            if (desktop) {
              // A compact, continuous loop in the open space above the cards.
              const loopScale = Math.min(1, Math.max(0.55, flightGap / 700));
              const loopX = (offset: number) => underlineEndX + offset * loopScale;
              const loopY = (offset: number) => markerCenterY + offset * loopScale;
              flightD = `M ${fmt(underlineEndX)} ${fmt(markerCenterY)}`;
              flightD += ` C ${fmt(loopX(45))} ${fmt(loopY(-14))}, ${fmt(loopX(110))} ${fmt(loopY(-62))}, ${fmt(loopX(145))} ${fmt(loopY(-47))}`;
              flightD += ` C ${fmt(loopX(185))} ${fmt(loopY(-31))}, ${fmt(loopX(184))} ${fmt(loopY(3))}, ${fmt(loopX(142))} ${fmt(loopY(-4))}`;
              flightD += ` C ${fmt(loopX(100))} ${fmt(loopY(-11))}, ${fmt(loopX(106))} ${fmt(loopY(-57))}, ${fmt(loopX(153))} ${fmt(loopY(-48))}`;
              flightD += ` C ${fmt(loopX(200))} ${fmt(loopY(-39))}, ${fmt(loopX(230))} ${fmt(loopY(-7))}, ${fmt(loopX(280))} ${fmt(loopY(-6))}`;
              const remainingGap = railX - loopX(280);
              flightD += ` C ${fmt(loopX(280) + remainingGap * 0.32)} ${fmt(loopY(-5))}, ${fmt(railX - remainingGap * 0.2)} ${fmt(railStartY - 21)}, ${fmt(railX)} ${fmt(railStartY)}`;
            } else if (flightGap > 60) {
              // When the title wraps, lift clear of the catalogue link before looping.
              const catalogueRight =
                (heading.querySelector("a")?.getBoundingClientRect().right ??
                  sectionRect.left) - sectionRect.left;
              const clearX = Math.max(
                underlineEndX + 12,
                catalogueRight + markerWidth / 2 + 7,
              );
              const liftY = markerCenterY - 16;
              flightD = `M ${fmt(underlineEndX)} ${fmt(markerCenterY)}`;
              flightD += ` C ${fmt(underlineEndX + 8)} ${fmt(markerCenterY - 18)}, ${fmt(clearX - 12)} ${fmt(liftY - 4)}, ${fmt(clearX)} ${fmt(liftY)}`;
              flightD += ` C ${fmt(clearX + 20)} ${fmt(liftY + 4)}, ${fmt(clearX + 46)} ${fmt(liftY + 12)}, ${fmt(clearX + 36)} ${fmt(liftY + 30)}`;
              flightD += ` C ${fmt(clearX + 26)} ${fmt(liftY + 45)}, ${fmt(clearX + 3)} ${fmt(liftY + 26)}, ${fmt(clearX + 13)} ${fmt(liftY + 15)}`;
              flightD += ` C ${fmt(clearX + 23)} ${fmt(liftY + 4)}, ${fmt(clearX + 50)} ${fmt(liftY + 20)}, ${fmt(clearX + 52)} ${fmt(liftY + 36)}`;
              flightD += ` C ${fmt(clearX + 54)} ${fmt(liftY + 52)}, ${fmt(railX - 25)} ${fmt(railStartY - 20)}, ${fmt(railX)} ${fmt(railStartY)}`;
            } else {
              // The single-line heading leaves room for a tighter loop at the edge.
              const loopScale = Math.min(1, Math.max(0.7, flightGap / 18));
              const loopX = (offset: number) => underlineEndX + offset * loopScale;
              const loopY = (offset: number) => markerCenterY + offset * loopScale;
              flightD = `M ${fmt(underlineEndX)} ${fmt(markerCenterY)}`;
              flightD += ` C ${fmt(loopX(18))} ${fmt(loopY(1))}, ${fmt(loopX(24))} ${fmt(loopY(19))}, ${fmt(loopX(10))} ${fmt(loopY(28))}`;
              flightD += ` C ${fmt(loopX(-10))} ${fmt(loopY(41))}, ${fmt(loopX(-29))} ${fmt(loopY(18))}, ${fmt(loopX(-16))} ${fmt(loopY(10))}`;
              flightD += ` C ${fmt(loopX(-3))} ${fmt(loopY(2))}, ${fmt(loopX(16))} ${fmt(loopY(17))}, ${fmt(loopX(18))} ${fmt(loopY(32))}`;
              flightD += ` C ${fmt(loopX(20))} ${fmt(loopY(47))}, ${fmt(railX - 5)} ${fmt(railStartY - 13)}, ${fmt(railX)} ${fmt(railStartY)}`;
            }

            // A continuous thread that advances downward without hooks or self-crossings.
            let trailD = `M ${fmt(railX)} ${fmt(railStartY)}`;
            const trailHeight = Math.max(0, railEndY - railStartY);
            const halfWaves = Math.max(2, Math.round(trailHeight / 240) * 2);
            for (let index = 0; index < halfWaves; index += 1) {
              const direction = index % 2 === 0 ? 1 : -1;
              const y = railStartY + (trailHeight * index) / halfWaves;
              const nextY = railStartY + (trailHeight * (index + 1)) / halfWaves;
              const step = nextY - y;
              trailD += ` C ${fmt(railX + direction * amplitude)} ${fmt(y + step / 3)}, ${fmt(railX + direction * amplitude)} ${fmt(y + (step * 2) / 3)}, ${fmt(railX)} ${fmt(nextY)}`;
            }

            svg.setAttribute("viewBox", `0 0 ${fmt(width)} ${fmt(height)}`);
            gsap.set(svg, { left: 0, top: 0, width, height, autoAlpha: 1 });
            underline.setAttribute("d", underlineD);
            trail.setAttribute("d", trailD);
            flight.setAttribute("d", flightD);
            geometry = {
              underlineLength: underline.getTotalLength(),
              trailLength: trail.getTotalLength(),
              flightLength: flight.getTotalLength(),
              startX: titleLeft,
              underlineEndX,
              markerCenterY,
              railEndY,
              descentScroll: Math.max(360, railEndY - railStartY),
            };
            gsap.set(underline, { strokeDasharray: geometry.underlineLength });
            gsap.set(trail, { strokeDasharray: geometry.trailLength });
          };

          positionThread();
          ScrollTrigger.addEventListener("refresh", positionThread);

          const revealPhoto = (photo: HTMLImageElement) => {
            const rect = photo.getBoundingClientRect();
            // Never cover a photo already visible or already passed on direct load.
            if (rect.top < window.innerHeight) return;

            const curtain = photo
              .closest<HTMLElement>(".category-image")
              ?.querySelector<HTMLElement>("[data-category-curtain]");
            const panels = curtain?.querySelectorAll<HTMLElement>(
              "[data-curtain-panel]",
            );
            if (!curtain || !panels || panels.length !== 2) return;

            const row = rows.find((items) =>
              items.some((card) => card.contains(photo)),
            );
            const stagger = row
              ? Math.max(
                  0,
                  row.findIndex((card) => card.contains(photo)),
                ) * 0.16
              : 0;

            gsap.set(curtain, { visibility: "visible" });
            gsap.set(panels, { xPercent: 0 });
            const reveal = gsap.to(panels, {
              xPercent: (index) => (index === 0 ? -102 : 102),
              duration: 1.25,
              delay: stagger,
              ease: "power2.inOut",
              paused: true,
              onComplete: () => gsap.set(curtain, { visibility: "hidden" }),
            });
            ScrollTrigger.create({
              trigger: photo,
              start: "top 95%",
              once: true,
              onEnter: () => reveal.play(0),
            });
          };
          photos.forEach(revealPhoto);

          const butterflyParts = collectExperimentalButterflyParts(butterfly);
          prepareExperimentalButterfly(butterflyParts);
          const wingMotion = createExperimentalButterflyMotion(
            butterflyParts,
            "glide",
            { paused: true },
          );
          gsap.set(butterfly, {
            width: markerWidth,
            x: geometry.startX - markerWidth / 2,
            y: geometry.markerCenterY - markerHeight / 2,
            autoAlpha: 0,
            transformOrigin: "50% 50%",
          });
          gsap.set(underline, {
            strokeDashoffset: geometry.underlineLength,
            visibility: "visible",
          });
          gsap.set(trail, {
            strokeDashoffset: geometry.trailLength,
            visibility: "visible",
          });

          let wingsArePlaying = false;
          const setWingsPlaying = (playing: boolean) => {
            if (playing === wingsArePlaying) return;
            wingsArePlaying = playing;
            if (playing) wingMotion.play();
            else wingMotion.pause();
          };
          const flightEnd = underlineScroll + flightScroll;
          const descentEnd = flightEnd + geometry.descentScroll;
          const totalScroll = descentEnd + exitScroll;

          const positionButterfly = (time: number) => {
            const clamp = gsap.utils.clamp(0, 1);
            let x: number;
            let y: number;
            let rotation = 0;
            let opacity = 1;

            if (time <= underlineScroll) {
              const progress = clamp(time / underlineScroll);
              x = gsap.utils.interpolate(
                geometry.startX,
                geometry.underlineEndX,
                progress,
              );
              y = geometry.markerCenterY + Math.sin(progress * Math.PI) * 2;
              opacity = clamp(time / 18);
            } else if (time <= flightEnd) {
              const progress = clamp((time - underlineScroll) / flightScroll);
              const point = flight.getPointAtLength(
                geometry.flightLength * progress,
              );
              x = point.x;
              y = point.y;
              rotation = desktop
                ? Math.sin(progress * Math.PI * 2) * 16
                : Math.sin(progress * Math.PI) * 14;
            } else if (time <= descentEnd) {
              const progress = clamp(
                (time - flightEnd) / geometry.descentScroll,
              );
              const point = trail.getPointAtLength(
                geometry.trailLength * progress,
              );
              x = point.x;
              y = point.y;
              rotation = Math.sin(progress * Math.PI * 6) * 8;
            } else {
              const progress = clamp((time - descentEnd) / exitScroll);
              x = trail.getPointAtLength(geometry.trailLength).x - progress * 8;
              y = geometry.railEndY - progress * 22;
              rotation = progress * 16;
              opacity = 1 - progress;
            }

            gsap.set(butterfly, {
              x: x - markerWidth / 2,
              y: y - markerHeight / 2,
              rotation,
              autoAlpha: opacity,
            });
          };

          let story: gsap.core.Timeline;
          story = gsap.timeline({
            onUpdate: () => positionButterfly(story.time()),
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              end: () => `+=${totalScroll}`,
              scrub: 0.45,
              once: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                setWingsPlaying(self.progress > 0.01 && self.progress < 0.99);
              },
              onLeave: () => setWingsPlaying(false),
              onLeaveBack: () => setWingsPlaying(false),
            },
          });
          story.to(
            underline,
            {
              strokeDashoffset: 0,
              duration: underlineScroll,
              ease: "none",
            },
            0,
          );
          const clock = { value: 0 };
          story.to(clock, { value: 1, duration: flightScroll, ease: "none" });
          story.to(trail, {
            strokeDashoffset: 0,
            duration: geometry.descentScroll,
            ease: "none",
          });
          story.to(clock, { value: 2, duration: exitScroll, ease: "none" });

          return () =>
            ScrollTrigger.removeEventListener("refresh", positionThread);
        },
      );
      return () => media.revert();
    },
    { scope: layer },
  );

  return (
    <div ref={layer} className={styles.threadLayer} aria-hidden="true">
      <svg className={styles.thread} aria-hidden="true">
        <path data-category-underline />
        <path data-category-trail />
        <path className={styles.threadMeasure} data-butterfly-flight />
      </svg>
      <div className={styles.butterflyMarker} data-category-butterfly>
        <ExperimentalButterfly />
      </div>
    </div>
  );
}
