// tailwind.config.ts  —  add the `cardiff` palette under theme.extend.colors
// Official Cardiff University brand colours (from their UX style guide):
//   red #d3374a · grey #d3d3d2 · black #22211f · white #ffffff
// (#990033 is the OLD Cardiff red — now deprecated, don't use it)

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cardiff: {
          red: "#d3374a",        // primary brand red
          "red-deep": "#a82939", // darker red for hover/active states
          "red-soft": "#f4e0e3", // tinted red for soft backgrounds
          black: "#22211f",      // Cardiff black (text / dark UI)
          ink: "#3a3936",        // softer body text
          grey: "#d3d3d2",       // Cardiff grey
          line: "#e6e4df",       // hairline borders
          paper: "#faf9f6",      // warm off-white page background
        },
      },
    },
  },
  plugins: [],
};

export default config;