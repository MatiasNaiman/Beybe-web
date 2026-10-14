import { useId } from "react";

export const BUTTERFLY_MOTION_STATES = {
  burst: {
    beats: 3,
    sides: {
      left: { delay: 0, amplitude: 1 },
      right: { delay: 0.022, amplitude: 0.96 },
    },
    wing: { scaleX: 0.81, rotation: 2.8, close: 0.14, open: 0.18 },
    upper: { scaleX: 0.94, rotation: 0.55, close: 0.14, open: 0.18 },
    lower: {
      scaleX: 1.04,
      rotation: 0.2,
      delay: 0.035,
      close: 0.15,
      open: 0.2,
    },
    body: { rotation: 1.4, y: -1.5 },
  },
  glide: {
    sides: {
      left: { delay: 0, amplitude: 1 },
      right: { delay: 0.026, amplitude: 0.97 },
    },
    wing: { scaleX: 0.96, rotation: 0.45, duration: 0.52 },
    upper: { scaleX: 1.01, rotation: 0.15, duration: 0.52 },
    lower: { scaleX: 0.99, rotation: -0.05, duration: 0.58 },
    body: { rotation: 0.5, y: -0.5 },
  },
  turn: {
    duration: 0.24,
    interior: {
      wing: { scaleX: 0.86, rotation: 3.2 },
      upper: { scaleX: 0.93, rotation: 0.6 },
      lower: { scaleX: 1.01, rotation: 0.15 },
    },
    exterior: {
      wing: { scaleX: 0.97, rotation: 1 },
      upper: { scaleX: 0.99, rotation: 0.2 },
      lower: { scaleX: 1.01, rotation: -0.1 },
    },
    body: { rotation: 1.8, y: -1 },
  },
} as const;

export const BUTTERFLY_MOTION_PARTS = {
  body: ".campaign-butterfly-body",
  leftWing: ".campaign-wing-left",
  leftBase: ".campaign-wing-left-base",
  leftUpper: ".campaign-wing-left-upper",
  leftLower: ".campaign-wing-left-lower",
  rightWing: ".campaign-wing-right",
  rightBase: ".campaign-wing-right-base",
  rightUpper: ".campaign-wing-right-upper",
  rightLower: ".campaign-wing-right-lower",
} as const;

export function CampaignButterfly() {
  const instanceId = useId().replace(/:/g, "");
  const ids = {
    leftWing: `${instanceId}-left-wing`,
    leftUpper: `${instanceId}-left-upper`,
    leftLower: `${instanceId}-left-lower`,
    rightWing: `${instanceId}-right-wing`,
    rightUpper: `${instanceId}-right-upper`,
    rightLower: `${instanceId}-right-lower`,
    body: `${instanceId}-body`,
    shape: `${instanceId}-shape`,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="353 3 276 226"
      className="campaign-butterfly"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={ids.leftWing} clipPathUnits="userSpaceOnUse">
          <path d="M353 58H480V229H353Z" />
        </clipPath>
        <clipPath id={ids.rightWing} clipPathUnits="userSpaceOnUse">
          <path d="M500 58H629V229H500Z" />
        </clipPath>
        <mask
          id={ids.leftUpper}
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"
          x="353"
          y="58"
          width="127"
          height="82"
        >
          <path fill="white" d="M353 58H480V140H353Z" />
        </mask>
        <mask
          id={ids.leftLower}
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"
          x="353"
          y="108"
          width="127"
          height="121"
        >
          <path fill="white" d="M353 108H480V229H353Z" />
        </mask>
        <mask
          id={ids.rightUpper}
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"
          x="500"
          y="58"
          width="129"
          height="82"
        >
          <path fill="white" d="M500 58H629V140H500Z" />
        </mask>
        <mask
          id={ids.rightLower}
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"
          x="500"
          y="108"
          width="129"
          height="121"
        >
          <path fill="white" d="M500 108H629V229H500Z" />
        </mask>
        <clipPath id={ids.body} clipPathUnits="userSpaceOnUse">
          <path d="M440 3H542V60H510V108H500V229H480V108H470V60H440Z" />
        </clipPath>
        <path
          id={ids.shape}
          fillRule="evenodd"
          d="M450.6 8.05 Q452 7 454.8 7.35 L457.2 7.65 Q460 8 461.05 9.75 L461.95 11.25 Q463 13 463 15.8 L463 18.2 Q463 21 465.45 24.5 L467.55 27.5 Q470 31 473.85 39.4 L477.15 46.6 Q481 55 482.75 60.25 L484.25 64.75 Q486 70 487.4 77.35 L490 91 L492 91 L494.6 78.65 Q496 72 498.8 64.3 L501.2 57.7 Q504 50 507.15 43.7 L509.85 38.3 Q513 32 515.8 28.15 L518.2 24.85 Q521 21 521 18.2 L521 15.8 Q521 13 521.7 11.6 L522.3 10.4 Q523 9 524.05 8.3 L524.95 7.7 Q526 7 528.45 7 L530.55 7 Q533 7 534.05 8.05 L534.95 8.95 Q536 10 536.35 13.15 L536.65 15.85 Q537 19 536.3 20.4 L535.7 21.6 Q535 23 533.95 23.7 L533.05 24.3 Q532 25 529.2 25 L524 25 L515.55 39.95 Q511 48 507.15 58.5 L503.85 67.5 Q500 78 498.25 87.45 L495 105 L504.1 94.6 Q509 89 514.25 85.5 L518.75 82.5 Q524 79 530.3 76.55 L535.7 74.45 Q542 72 548.3 70.6 L553.7 69.4 Q560 68 574.35 68 L586.65 68 Q601 68 605.9 69.75 L610.1 71.25 Q615 73 618.15 76.5 L620.85 79.5 Q624 83 624.35 88.25 L624.65 92.75 Q625 98 622.55 102.9 L620.45 107.1 Q618 112 615.2 114.45 L612.8 116.55 Q610 119 605.1 120.75 L596 124 L596.65 125.3 Q597 126 599.45 127.05 L601.55 127.95 Q604 129 606.1 131.1 L607.9 132.9 Q610 135 611.05 137.1 L611.95 138.9 Q613 141 613.35 144.85 L613.65 148.15 Q614 152 612.95 154.45 L612.05 156.55 Q611 159 605.75 163.55 L601.25 167.45 Q596 172 586.55 176.9 L578.45 181.1 Q569 186 556.05 190.55 L544.95 194.45 Q532 199 521.85 201.1 L503 205 L533 109 C512 121 508 143 505 170 L500 207 C494 211 489 218 487 225 C484 217 480 211 475 207 C475 180 474 145 470 131 C467 122 458 113 449 109 L449.65 114.2 Q450 117 457.7 147.45 L472 204 L456.4 200.75 Q448 199 434 193.75 L422 189.25 Q408 184 398.9 178.75 L391.1 174.25 Q382 169 377.45 164.45 L373.55 160.55 Q369 156 368.3 154.25 L367.7 152.75 Q367 151 367.35 146.8 L367.65 143.2 Q368 139 370.8 135.15 L373.2 131.85 Q376 128 379.15 126.6 L385 124 L385 122 L383.05 122 Q382 122 377.45 119.55 L373.55 117.45 Q369 115 365.85 111.15 L363.15 107.85 Q360 104 358.95 101.2 L358.05 98.8 Q357 96 357 92.5 L357 89.5 Q357 86 358.05 83.2 L358.95 80.8 Q360 78 362.1 75.9 L363.9 74.1 Q366 72 368.1 70.95 L369.9 70.05 Q372 69 375.85 67.95 L379.15 67.05 Q383 66 393.85 66 L403.15 66 Q414 66 422.75 67.75 L430.25 69.25 Q439 71 448.1 74.85 L455.9 78.15 Q465 82 465.7 83.05 L466.3 83.95 Q467 85 468.75 85.7 L470.25 86.3 Q472 87 477.25 92.95 L487 104 L483.75 86.45 Q482 77 478.5 66.85 L475.5 58.15 Q472 48 468.15 40.65 L464.85 34.35 Q461 27 460.3 26.3 L459.7 25.7 Q459 25 456.55 25 L454.45 25 Q452 25 450.6 23.6 L449.4 22.4 Q448 21 448 17.15 L448 10 Z M404.3 91 Q398 91 395.2 92.4 L390 95 L390 98.9 Q390 101 393.5 104.85 L396.5 108.15 Q400 112 404.9 113.75 L409.1 115.25 Q414 117 416.45 117.35 L421 118 L416 91 Z M567 92 L561 119 L568.8 117.7 Q573 117 575.45 115.6 L577.55 114.4 Q580 113 583.15 110.9 L585.85 109.1 Q589 107 590.05 105.25 L590.95 103.75 Q592 102 592 99.9 L592 96 L586.8 93.4 Q584 92 578.05 92 Z M423.4 134.35 Q422 134 417.1 135.4 L412.9 136.6 Q408 138 405.2 140.45 L400 145 L401.3 150.85 Q402 154 404.8 156.45 L407.2 158.55 Q410 161 412.8 162.05 L415.2 162.95 Q418 164 421.15 165.4 L423.85 166.6 Q427 168 429.8 168.35 L435 169 L426 135 Z M561.55 136.05 Q557 135 556.3 135.35 L555.7 135.65 Q555 136 551.5 147.9 L545 170 L557.35 166.75 Q564 165 569.25 161.5 L573.75 158.5 Q579 155 579.7 152.2 L581 147 L577.75 143.1 Q576 141 573.9 139.95 L572.1 139.05 Q570 138 565.45 136.95 Z"
        />
      </defs>
      <g className="motion-butterfly" fill="#89c1a8" data-motion-state="rest">
        <g
          className="campaign-wing-left"
          data-motion-part="left-wing"
          style={{ transformBox: "view-box", transformOrigin: "480px 116px" }}
        >
          <g
            className="campaign-wing-left-base"
            clipPath={`url(#${ids.leftWing})`}
            data-motion-part="left-wing-base"
          >
            <use href={`#${ids.shape}`} />
          </g>
          <g
            className="campaign-wing-left-upper"
            mask={`url(#${ids.leftUpper})`}
            data-motion-part="left-upper-wing"
            style={{
              transformBox: "view-box",
              transformOrigin: "480px 116px",
            }}
          >
            <use href={`#${ids.shape}`} />
          </g>
          <g
            className="campaign-wing-left-lower"
            mask={`url(#${ids.leftLower})`}
            data-motion-part="left-lower-wing"
            style={{
              transformBox: "view-box",
              transformOrigin: "480px 116px",
            }}
          >
            <use href={`#${ids.shape}`} />
          </g>
        </g>
        <g
          className="campaign-wing-right"
          data-motion-part="right-wing"
          style={{ transformBox: "view-box", transformOrigin: "500px 116px" }}
        >
          <g
            className="campaign-wing-right-base"
            clipPath={`url(#${ids.rightWing})`}
            data-motion-part="right-wing-base"
          >
            <use href={`#${ids.shape}`} />
          </g>
          <g
            className="campaign-wing-right-upper"
            mask={`url(#${ids.rightUpper})`}
            data-motion-part="right-upper-wing"
            style={{
              transformBox: "view-box",
              transformOrigin: "500px 116px",
            }}
          >
            <use href={`#${ids.shape}`} />
          </g>
          <g
            className="campaign-wing-right-lower"
            mask={`url(#${ids.rightLower})`}
            data-motion-part="right-lower-wing"
            style={{
              transformBox: "view-box",
              transformOrigin: "500px 116px",
            }}
          >
            <use href={`#${ids.shape}`} />
          </g>
        </g>
        <g
          className="campaign-butterfly-body"
          clipPath={`url(#${ids.body})`}
          data-motion-part="body"
          style={{ transformBox: "view-box", transformOrigin: "490px 108px" }}
        >
          <use href={`#${ids.shape}`} />
        </g>
      </g>
    </svg>
  );
}
