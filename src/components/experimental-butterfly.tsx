import { useId } from "react";

export const EXPERIMENTAL_BUTTERFLY_PARTS = {
  leftWing: ".experimental-butterfly-wing-left",
  rightWing: ".experimental-butterfly-wing-right",
  body: ".experimental-butterfly-body",
  leftAntenna: ".experimental-butterfly-antenna-left",
  rightAntenna: ".experimental-butterfly-antenna-right",
} as const;

const wingPath = `
  M135 104
  C122 88 106 75 86 67
  C63 58 35 58 20 69
  C5 80 5 99 18 111
  C26 119 37 123 50 125
  C34 128 21 137 18 150
  C14 168 33 184 58 196
  C78 205 102 212 126 215
  C126 188 124 161 120 141
  C117 125 111 115 102 109
  C114 113 125 122 135 136
  Z
  M43 89
  C52 84 68 84 80 87
  L75 112
  C63 111 52 107 47 101
  C44 97 42 93 43 89
  Z
  M50 143
  C59 135 72 132 83 134
  L90 169
  C77 167 64 162 56 156
  C52 152 50 147 50 143
  Z
`;

const antennaPath = `
  M140 76
  C136 61 131 45 123 31
  C120 26 119 23 119 19
  V13
  C119 9 117 6 113 6
  H106
  C102 6 100 9 100 13
  V19
  C100 24 102 27 106 27
  H112
  C121 44 127 59 132 74
  L140 76
  Z
`;

export function ExperimentalButterfly() {
  const instanceId = useId().replace(/:/g, "");
  const wingGradient = `${instanceId}-wing-gradient`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 230" className="experimental-butterfly" aria-hidden="true">
      <defs>
        <linearGradient id={wingGradient} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#80b99f" />
          <stop offset="0.78" stopColor="#89c1a8" />
          <stop offset="1" stopColor="#93c9b0" />
        </linearGradient>
      </defs>
      <g className="experimental-butterfly-wing experimental-butterfly-wing-left" style={{ transformBox: "view-box", transformOrigin: "135px 116px" }}>
        <path d={wingPath} fill={`url(#${wingGradient})`} fillRule="evenodd" clipRule="evenodd" />
      </g>
      <g className="experimental-butterfly-wing experimental-butterfly-wing-right" style={{ transformBox: "view-box", transformOrigin: "145px 116px" }}>
        <g transform="translate(280 0) scale(-1 1)">
          <path d={wingPath} fill={`url(#${wingGradient})`} fillRule="evenodd" clipRule="evenodd" />
        </g>
      </g>
      <g className="experimental-butterfly-antenna experimental-butterfly-antenna-left" style={{ transformBox: "view-box", transformOrigin: "140px 76px" }}>
        <path fill="#89c1a8" d={antennaPath} />
      </g>
      <g className="experimental-butterfly-antenna experimental-butterfly-antenna-right" style={{ transformBox: "view-box", transformOrigin: "140px 76px" }}>
        <g transform="translate(280 0) scale(-1 1)">
          <path fill="#89c1a8" d={antennaPath} />
        </g>
      </g>
      <path
        className="experimental-butterfly-body"
        fill="#89c1a8"
        d="M132 64C136 60 144 60 148 64L152 73C148 84 146 95 146 108V207C146 216 143 222 140 226C137 222 134 216 134 207V108C134 95 132 84 128 73L132 64Z"
      />
    </svg>
  );
}
