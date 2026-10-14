import gsap from "gsap";
import { EXPERIMENTAL_BUTTERFLY_PARTS } from "./experimental-butterfly";

export type ExperimentalButterflyMotionState =
  | "open"
  | "middle"
  | "closed"
  | "burst"
  | "glide"
  | "turn-left"
  | "turn-right"
  | "sequence";

export type ButterflyTurnDirection = "left" | "right";

export type ExperimentalButterflyParts = {
  leftWing: SVGGraphicsElement[];
  rightWing: SVGGraphicsElement[];
  body: SVGGraphicsElement[];
  leftAntenna: SVGGraphicsElement[];
  rightAntenna: SVGGraphicsElement[];
};

type ComparisonWings = {
  left: SVGGraphicsElement[];
  right: SVGGraphicsElement[];
};

type MotionOptions = {
  comparison?: ComparisonWings;
  getTurnDirection?: () => ButterflyTurnDirection;
  paused?: boolean;
};

const animatedStates = new Set<ExperimentalButterflyMotionState>([
  "burst",
  "glide",
  "turn-left",
  "turn-right",
  "sequence",
]);

export function isAnimatedButterflyState(
  state: ExperimentalButterflyMotionState,
) {
  return animatedStates.has(state);
}

export function collectExperimentalButterflyParts(
  root: ParentNode,
): ExperimentalButterflyParts {
  const all = (selector: string) =>
    Array.from(root.querySelectorAll<SVGGraphicsElement>(selector));

  return {
    leftWing: all(EXPERIMENTAL_BUTTERFLY_PARTS.leftWing),
    rightWing: all(EXPERIMENTAL_BUTTERFLY_PARTS.rightWing),
    body: all(EXPERIMENTAL_BUTTERFLY_PARTS.body),
    leftAntenna: all(EXPERIMENTAL_BUTTERFLY_PARTS.leftAntenna),
    rightAntenna: all(EXPERIMENTAL_BUTTERFLY_PARTS.rightAntenna),
  };
}

export function getExperimentalButterflyTargets(
  parts: ExperimentalButterflyParts,
) {
  return [
    ...parts.leftWing,
    ...parts.rightWing,
    ...parts.body,
    ...parts.leftAntenna,
    ...parts.rightAntenna,
  ];
}

export function prepareExperimentalButterfly(
  parts: ExperimentalButterflyParts,
) {
  gsap.set(parts.leftWing, { svgOrigin: "135 116" });
  gsap.set(parts.rightWing, { svgOrigin: "145 116" });
  gsap.set([...parts.leftAntenna, ...parts.rightAntenna], {
    svgOrigin: "140 76",
  });
}

export function setExperimentalButterflyPose(
  parts: ExperimentalButterflyParts,
  state: "open" | "middle" | "closed",
  comparison?: ComparisonWings,
) {
  const scale = state === "open" ? 1 : state === "middle" ? 0.58 : 0.24;
  const overlap = state === "open" ? 0 : state === "middle" ? 1 : 2;
  const antennaRotation = state === "open" ? 0 : state === "middle" ? 0.7 : 1.6;

  gsap.set(parts.leftWing, { scaleX: scale, x: overlap });
  gsap.set(parts.rightWing, { scaleX: scale, x: -overlap });
  gsap.set(parts.leftAntenna, { rotation: -antennaRotation });
  gsap.set(parts.rightAntenna, { rotation: antennaRotation });

  if (comparison) {
    gsap.set([...comparison.left, ...comparison.right], {
      scaleX: state === "open" ? 1 : state === "middle" ? 0.9 : 0.81,
    });
  }
}

function addOpenPose(
  motion: gsap.core.Timeline,
  parts: ExperimentalButterflyParts,
  position: gsap.Position,
  duration: number,
  comparison?: ComparisonWings,
) {
  motion.to(
    parts.leftWing,
    { scaleX: 1, x: 0, duration, ease: "power3.out" },
    position,
  );
  motion.to(
    parts.rightWing,
    { scaleX: 1, x: 0, duration, ease: "power3.out" },
    "<",
  );
  motion.to(
    parts.leftAntenna,
    { rotation: 0, duration: duration + 0.04, ease: "power3.out" },
    "<",
  );
  motion.to(
    parts.rightAntenna,
    { rotation: 0, duration: duration + 0.04, ease: "power3.out" },
    "<",
  );

  if (comparison) {
    motion.to(
      [...comparison.left, ...comparison.right],
      { scaleX: 1, rotation: 0, duration, ease: "power3.out" },
      "<",
    );
  }
}

function addClosedPose(
  motion: gsap.core.Timeline,
  parts: ExperimentalButterflyParts,
  position: gsap.Position,
  duration: number,
  comparison?: ComparisonWings,
) {
  motion.to(
    parts.leftWing,
    { scaleX: 0.24, x: 2, duration, ease: "power2.in" },
    position,
  );
  motion.to(
    parts.rightWing,
    { scaleX: 0.24, x: -2, duration, ease: "power2.in" },
    "<",
  );
  motion.to(
    parts.leftAntenna,
    { rotation: -1.6, duration: duration + 0.04, ease: "sine.inOut" },
    "<",
  );
  motion.to(
    parts.rightAntenna,
    { rotation: 1.6, duration: duration + 0.04, ease: "sine.inOut" },
    "<",
  );

  if (comparison) {
    motion.to(
      [...comparison.left, ...comparison.right],
      { scaleX: 0.81, rotation: 2.8, duration, ease: "power2.in" },
      "<",
    );
  }
}

function addGlide(
  motion: gsap.core.Timeline,
  parts: ExperimentalButterflyParts,
  comparison?: ComparisonWings,
) {
  motion.to(
    parts.leftWing,
    { scaleX: 0.82, x: 0.7, duration: 0.78, ease: "sine.inOut" },
    ">",
  );
  motion.to(
    parts.rightWing,
    { scaleX: 0.82, x: -0.7, duration: 0.78, ease: "sine.inOut" },
    "<",
  );
  motion.to(
    parts.leftAntenna,
    { rotation: -0.7, duration: 0.86, ease: "sine.inOut" },
    "<",
  );
  motion.to(
    parts.rightAntenna,
    { rotation: 0.7, duration: 0.86, ease: "sine.inOut" },
    "<",
  );

  if (comparison) {
    motion.to(
      [...comparison.left, ...comparison.right],
      { scaleX: 0.96, duration: 0.78, ease: "sine.inOut" },
      "<",
    );
  }

  addOpenPose(motion, parts, ">", 0.78, comparison);
}

function addTurn(
  motion: gsap.core.Timeline,
  parts: ExperimentalButterflyParts,
  getDirection: () => ButterflyTurnDirection,
  comparison?: ComparisonWings,
) {
  const turnsLeft = () => getDirection() === "left";

  motion.to(
    parts.leftWing,
    {
      scaleX: () => (turnsLeft() ? 0.34 : 0.9),
      x: () => (turnsLeft() ? 1.7 : 0.4),
      duration: 0.42,
      ease: "sine.inOut",
    },
    ">",
  );
  motion.to(
    parts.rightWing,
    {
      scaleX: () => (turnsLeft() ? 0.9 : 0.34),
      x: () => (turnsLeft() ? -0.4 : -1.7),
      duration: 0.42,
      ease: "sine.inOut",
    },
    "<",
  );
  motion.to(
    parts.leftAntenna,
    {
      rotation: () => (turnsLeft() ? -2 : 0.4),
      duration: 0.48,
      ease: "sine.inOut",
    },
    "<",
  );
  motion.to(
    parts.rightAntenna,
    {
      rotation: () => (turnsLeft() ? -0.4 : 2),
      duration: 0.48,
      ease: "sine.inOut",
    },
    "<",
  );

  if (comparison) {
    motion.to(
      comparison.left,
      {
        scaleX: () => (turnsLeft() ? 0.86 : 0.97),
        rotation: () => (turnsLeft() ? 3.2 : 1),
        duration: 0.42,
        ease: "sine.inOut",
      },
      "<",
    );
    motion.to(
      comparison.right,
      {
        scaleX: () => (turnsLeft() ? 0.97 : 0.86),
        rotation: () => (turnsLeft() ? 1 : 3.2),
        duration: 0.42,
        ease: "sine.inOut",
      },
      "<",
    );
  }

  addOpenPose(motion, parts, ">", 0.48, comparison);
}

export function createExperimentalButterflyMotion(
  parts: ExperimentalButterflyParts,
  state: Exclude<
    ExperimentalButterflyMotionState,
    "open" | "middle" | "closed"
  >,
  options: MotionOptions = {},
) {
  const {
    comparison,
    getTurnDirection = () =>
      state === "turn-right" ? "right" : ("left" as ButterflyTurnDirection),
    paused = false,
  } = options;
  const motion = gsap.timeline({
    paused,
    repeat: -1,
    repeatDelay: state === "burst" ? 0.46 : 0.12,
    repeatRefresh: state === "sequence",
  });

  if (state === "burst" || state === "sequence") {
    for (let beat = 0; beat < 3; beat += 1) {
      addClosedPose(motion, parts, ">", 0.14, comparison);
      addOpenPose(motion, parts, ">", 0.2, comparison);
    }
  }

  if (state === "glide" || state === "sequence") {
    addGlide(motion, parts, comparison);
  }

  if (state.startsWith("turn") || state === "sequence") {
    addTurn(motion, parts, getTurnDirection, comparison);
  }

  return motion;
}
