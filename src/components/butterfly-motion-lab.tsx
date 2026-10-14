"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  CampaignButterfly,
  BUTTERFLY_MOTION_PARTS,
} from "./campaign-butterfly";
import { ExperimentalButterfly } from "./experimental-butterfly";
import {
  collectExperimentalButterflyParts,
  createExperimentalButterflyMotion,
  getExperimentalButterflyTargets,
  isAnimatedButterflyState,
  prepareExperimentalButterfly,
  setExperimentalButterflyPose,
  type ExperimentalButterflyMotionState,
} from "./experimental-butterfly-motion";
import styles from "./butterfly-motion-lab.module.css";

type MotionState = ExperimentalButterflyMotionState;

const states: Array<{ value: MotionState; label: string }> = [
  { value: "open", label: "Alas abiertas" },
  { value: "middle", label: "Apertura intermedia" },
  { value: "closed", label: "Alas cerradas" },
  { value: "burst", label: "Burst" },
  { value: "glide", label: "Glide" },
  { value: "turn-left", label: "Turn izquierda" },
  { value: "turn-right", label: "Turn derecha" },
  { value: "sequence", label: "Secuencia natural" },
];

export function ButterflyMotionLab() {
  const scope = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [activeState, setActiveState] = useState<MotionState>("open");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const collectParts = () => {
    const root = scope.current;
    if (!root) return null;
    const all = (selector: string) =>
      Array.from(root.querySelectorAll<SVGGraphicsElement>(selector));
    const experimental = collectExperimentalButterflyParts(root);
    return {
      legacyLeft: all(BUTTERFLY_MOTION_PARTS.leftWing),
      legacyRight: all(BUTTERFLY_MOTION_PARTS.rightWing),
      legacyLayers: Object.values(BUTTERFLY_MOTION_PARTS).flatMap(all),
      experimental,
    };
  };

  const stopCurrent = () => {
    timeline.current?.kill();
    timeline.current = null;
    const parts = collectParts();
    if (!parts) return null;
    const targets = [
      ...parts.legacyLayers,
      ...getExperimentalButterflyTargets(parts.experimental),
    ];
    gsap.killTweensOf(targets);
    gsap.set(targets, { clearProps: "transform,opacity" });
    prepareExperimentalButterfly(parts.experimental);
    return parts;
  };

  const attachProgress = (motion: gsap.core.Timeline, play: boolean) => {
    motion.eventCallback("onUpdate", () =>
      setProgress(Math.round(motion.progress() * 1000) / 10),
    );
    timeline.current = motion;
    if (!play) motion.pause(0);
    setIsPlaying(play);
  };

  const buildMotion = (state: MotionState, play = true) => {
    const parts = stopCurrent();
    if (!parts) return;
    setActiveState(state);
    setProgress(0);

    const comparison = {
      left: parts.legacyLeft,
      right: parts.legacyRight,
    };

    if (!isAnimatedButterflyState(state)) {
      setExperimentalButterflyPose(
        parts.experimental,
        state as "open" | "middle" | "closed",
        comparison,
      );
      setIsPlaying(false);
      return;
    }

    const motion = createExperimentalButterflyMotion(
      parts.experimental,
      state as "burst" | "glide" | "turn-left" | "turn-right" | "sequence",
      { comparison },
    );

    attachProgress(motion, play);
  };

  useEffect(() => {
    buildMotion("open", false);
    return () => {
      timeline.current?.kill();
    };
    // The SVG specimens mount once; subsequent changes are user-driven.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlayback = () => {
    const motion = timeline.current;
    if (!motion) return;
    if (isPlaying) motion.pause();
    else motion.resume();
    setIsPlaying(!isPlaying);
  };

  const reset = () => buildMotion(activeState, false);

  const scrub = (value: number) => {
    const motion = timeline.current;
    if (!motion) return;
    motion.pause().progress(value / 100);
    setProgress(value);
    setIsPlaying(false);
  };

  return (
    <section ref={scope} className={styles.lab} aria-labelledby="lab-title">
      <div className={styles.intro}>
        <h1 id="lab-title">Laboratorio de mariposa</h1>
        <p>
          Comparación directa entre la construcción segmentada actual y una
          alternativa de alas continuas con bisagra central estable.
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.stateButtons} aria-label="Estados de movimiento">
          {states.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={styles.control}
              aria-pressed={activeState === value}
              onClick={() => buildMotion(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={styles.transport}>
          <button
            type="button"
            className={`${styles.transportButton} ${styles.transportButtonPrimary}`}
            onClick={togglePlayback}
            disabled={!timeline.current}
          >
            {isPlaying ? "Pausar" : "Reproducir"}
          </button>
          <button
            type="button"
            className={styles.transportButton}
            onClick={reset}
          >
            Reiniciar
          </button>
          <div className={styles.scrubberWrap}>
            <label htmlFor="butterfly-progress">Fotograma</label>
            <input
              id="butterfly-progress"
              className={styles.scrubber}
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              disabled={!timeline.current}
              onPointerDown={() => {
                timeline.current?.pause();
                setIsPlaying(false);
              }}
              onInput={(event) => scrub(Number(event.currentTarget.value))}
            />
            <span className={styles.progress}>{progress.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className={styles.comparison}>
        <article className={styles.version}>
          <header className={styles.versionHeader}>
            <h2>Actual</h2>
            <span>Máscaras segmentadas</span>
          </header>
          <div className={styles.stage}>
            <div className={styles.specimen}>
              <CampaignButterfly />
            </div>
            <div className={styles.heroSpecimen}>
              <div className={styles.heroSize}>
                <CampaignButterfly />
              </div>
              <span>120 px</span>
            </div>
          </div>
          <p className={styles.note}>
            Referencia intacta para comparar solapes, cortes y continuidad.
          </p>
        </article>

        <article className={styles.version}>
          <header className={styles.versionHeader}>
            <h2>Alas continuas</h2>
            <span>Alternativa experimental</span>
          </header>
          <div className={styles.stage}>
            <div className={styles.specimen}>
              <ExperimentalButterfly />
            </div>
            <div className={styles.heroSpecimen}>
              <div className={styles.heroSize}>
                <ExperimentalButterfly />
              </div>
              <span>120 px</span>
            </div>
          </div>
          <p className={styles.note}>
            Una superficie por ala; la Y permanece independiente y estable.
          </p>
        </article>
      </div>
    </section>
  );
}
