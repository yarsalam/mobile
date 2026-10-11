export const HintKeys = {
  PASS: "hint_pass",
  LIKE: "hint_like",
  SUPERLIKE: "hint_superlike",
  REWIND: "hint_rewind",
  PROFILE: "hint_profile",
  WAVE: "hint_wave",
  VISITOR: "hint_visitor",
  FILTER: "hint_filter"
} as const;

export type HintKey = typeof HintKeys[keyof typeof HintKeys];
