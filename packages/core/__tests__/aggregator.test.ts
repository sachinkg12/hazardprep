import { describe, it, expect } from 'vitest';
import { HazardAggregator } from '../src/engine/aggregator.js';
import { HazardType } from '../src/models/hazard.js';
import type { HazardScore } from '../src/models/hazard.js';

function makeScore(type: HazardType, score: number): HazardScore {
  return {
    type,
    score,
    level: score >= 80 ? 'very_high' : score >= 60 ? 'high' : score >= 40 ? 'moderate' : score >= 20 ? 'low' : 'very_low',
    description: `Test ${type} score`,
    source: { name: 'Test', url: 'https://test.com' },
  };
}

describe('HazardAggregator', () => {
  const aggregator = new HazardAggregator();

  it('returns zero for empty scores', () => {
    const result = aggregator.aggregate([]);
    expect(result.overallScore).toBe(0);
    expect(result.overallLevel).toBe('very_low');
    expect(result.topRisks).toHaveLength(0);
  });

  it('aggregates multiple hazard scores', () => {
    const scores = [
      makeScore(HazardType.Earthquake, 90),
      makeScore(HazardType.Flood, 40),
      makeScore(HazardType.Wildfire, 10),
    ];

    const result = aggregator.aggregate(scores);

    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.topRisks[0].type).toBe(HazardType.Earthquake);
    expect(result.topRisks).toHaveLength(3);
  });

  it('deduplicates hazard types by taking max score', () => {
    const scores = [
      makeScore(HazardType.Flood, 30),
      makeScore(HazardType.Flood, 70), // higher score should win
    ];

    const result = aggregator.aggregate(scores);
    expect(result.topRisks).toHaveLength(1);
    expect(result.topRisks[0].score).toBe(70);
  });

  it('generates recommendations for scores >= 20', () => {
    const scores = [
      makeScore(HazardType.Earthquake, 85),
      makeScore(HazardType.Wildfire, 5), // below threshold
    ];

    const result = aggregator.aggregate(scores);
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].hazardType).toBe(HazardType.Earthquake);
    expect(result.recommendations[0].priority).toBe('critical');
  });

  it('sorts top risks by score descending', () => {
    const scores = [
      makeScore(HazardType.Flood, 20),
      makeScore(HazardType.Tornado, 80),
      makeScore(HazardType.Earthquake, 50),
    ];

    const result = aggregator.aggregate(scores);
    expect(result.topRisks.map((r) => r.score)).toEqual([80, 50, 20]);
  });
});
