export const SCORE_FLOOR = -15;
export const SCORE_CEILING = 40;

export const RELATIONSHIP_THRESHOLDS = [
  { tier: 'rival', min: SCORE_FLOOR, max: -10 },
  { tier: 'avoidant', min: -9, max: -1 },
  { tier: 'neutral', min: 0, max: 9 },
  { tier: 'friendly', min: 10, max: 24 },
  { tier: 'bonded', min: 25, max: SCORE_CEILING },
];

export function tierFromScore(score) {
  const clamped = Math.min(SCORE_CEILING, Math.max(SCORE_FLOOR, score));
  return RELATIONSHIP_THRESHOLDS.find((threshold) => clamped >= threshold.min && clamped <= threshold.max).tier;
}
