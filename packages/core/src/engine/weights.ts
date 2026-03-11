import { HazardType } from '../models/hazard.js';

/**
 * Default weights for composite risk score calculation.
 * These can be overridden when creating a HazardScorer instance.
 * Weights should sum to 1.0.
 */
export const DEFAULT_WEIGHTS: Record<HazardType, number> = {
  [HazardType.Flood]: 0.20,
  [HazardType.Earthquake]: 0.15,
  [HazardType.Wildfire]: 0.15,
  [HazardType.Hurricane]: 0.15,
  [HazardType.Tornado]: 0.10,
  [HazardType.SevereStorm]: 0.10,
  [HazardType.Winter]: 0.05,
  [HazardType.Drought]: 0.05,
  [HazardType.Heatwave]: 0.05,
};

/** Normalize weights so they sum to 1.0 for the given hazard types */
export function normalizeWeights(
  weights: Partial<Record<HazardType, number>>,
  activeTypes: HazardType[],
): Record<HazardType, number> {
  const filtered: Record<string, number> = {};
  let total = 0;

  for (const type of activeTypes) {
    const w = weights[type] ?? DEFAULT_WEIGHTS[type] ?? 0;
    filtered[type] = w;
    total += w;
  }

  // Normalize to sum to 1.0
  if (total > 0) {
    for (const type of activeTypes) {
      filtered[type] = filtered[type] / total;
    }
  }

  return filtered as Record<HazardType, number>;
}
