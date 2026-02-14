import { createIcon } from "./_base";

// ─────────────────────────────────────────────
// 00 – Sparkle  (premium / quality / shine)
// Classic 4-point star sparkle (from Lucide)
// ─────────────────────────────────────────────
export const IconSparkle = createIcon(
  "IconSparkle",
  <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
);

// ─────────────────────────────────────────────
// 01 – Knife  (scratch / cut resistance)
// Clean diagonal blade + short handle
// ─────────────────────────────────────────────
export const IconKnife = createIcon(
  "IconKnife",
  <>
    <path d="M19 5L7 17" />
    <path d="M15.5 3.5l2 2" />
    <path d="M7 17l-4 4" />
    <path d="M19 5c1-1-.5-2.5-1.5-1.5L5.5 15.5c-1 1 .5 2.5 1.5 1.5L19 5z" />
  </>
);

// ─────────────────────────────────────────────
// 02 – Photo / Pattern  (design / visual)
// Rounded rectangle with mountain + sun
// ─────────────────────────────────────────────
export const IconPhotoWave = createIcon(
  "IconPhotoWave",
  <>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 17l-5-5-3 3-2-2-8 8" />
  </>
);

// ─────────────────────────────────────────────
// 03 – Flask  (chemical resistance)
// Erlenmeyer flask with 2 bubbles
// ─────────────────────────────────────────────
export const IconFlask = createIcon(
  "IconFlask",
  <>
    <path d="M9 2h6" />
    <path d="M10 2v6l-5.5 9a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 8V2" />
    <circle cx="10.5" cy="15.5" r="1" />
    <circle cx="14" cy="14" r=".8" />
  </>
);

// ─────────────────────────────────────────────
// 04 – Cycle / Refresh  (easy maintenance)
// Two curved refresh arrows + base stand
// ─────────────────────────────────────────────
export const IconCycleStand = createIcon(
  "IconCycleStand",
  <>
    <path d="M4 21h16" />
    <path d="M17 7A7 7 0 0 0 6 8" />
    <path d="M17 4v3h-3" />
    <path d="M7 15a7 7 0 0 0 11-1" />
    <path d="M7 18v-3h3" />
  </>
);

// ─────────────────────────────────────────────
// 05 – Water Drop  (water absorption / resistance)
// Classic teardrop
// ─────────────────────────────────────────────
export const IconDrop = createIcon(
  "IconDrop",
  <>
    <path d="M12 2c-3 4.5-6 8-6 11.5a6 6 0 0 0 12 0c0-3.5-3-7-6-11.5z" />
    <path d="M10 13.5a2.5 2.5 0 0 0 0 3" />
  </>
);

// ─────────────────────────────────────────────
// 06 – Shield + Flame  (heat / fire resistance)
// Shield with simple teardrop flame
// ─────────────────────────────────────────────
export const IconShieldFlame = createIcon(
  "IconShieldFlame",
  <>
    <path d="M12 2l8 4v5c0 5.5-3.5 8.5-8 10-4.5-1.5-8-4.5-8-10V6z" />
    <path d="M12 8c-2 3-3 5-3 6.5a3 3 0 0 0 6 0c0-1.5-1-3.5-3-6.5z" />
  </>
);

// ─────────────────────────────────────────────
// 07 – Bubbles  (hygiene / microstructure)
// Scattered circles
// ─────────────────────────────────────────────
export const IconBubbles = createIcon(
  "IconBubbles",
  <>
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="6" cy="7.5" r="2" />
    <circle cx="18" cy="7" r="1.5" />
    <circle cx="18.5" cy="16" r="2" />
    <circle cx="6.5" cy="17.5" r="1.5" />
  </>
);

// ─────────────────────────────────────────────
// 08 – Load / Pressure  (strength / load-bearing)
// Beam + 2 triangle supports + 1 arrow down
// ─────────────────────────────────────────────
export const IconLoadBeam = createIcon(
  "IconLoadBeam",
  <>
    <path d="M2 13h20" />
    <path d="M6 13l-3 9h6z" />
    <path d="M18 13l-3 9h6z" />
    <path d="M12 3v7" />
    <path d="M9 7l3 3 3-3" />
  </>
);

// ─────────────────────────────────────────────
// matt-16 – Matte / Anti-glare  (surface finish)
// Dome surface with bouncing/scattering rays
// ─────────────────────────────────────────────
export const IconMatteBounce = createIcon(
  "IconMatteBounce",
  <>
    <path d="M3 19a9 9 0 0 1 18 0" />
    <path d="M2 19h20" />
    <path d="M7 4l5 6" />
    <path d="M12 10l3-6" />
    <path d="M12 10l5.5-3" />
    <path d="M12 10l6 0" />
  </>
);
