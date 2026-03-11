import type { HazardScore } from './hazard.js';
import type { Location } from './location.js';

/**
 * Interface for hazard data providers.
 *
 * Implement this to add a new data source to the scoring engine.
 * Each provider fetches risk data from a single federal API and
 * returns normalized HazardScore(s).
 */
export interface DataProvider {
  /** Unique identifier, e.g. 'fema', 'usgs-earthquake' */
  readonly id: string;
  /** Human-readable name */
  readonly name: string;
  /** Which hazard types this provider covers */
  readonly hazardTypes: string[];

  /**
   * Fetch hazard risk data for a location.
   * Should return one or more HazardScores.
   * Must not throw — return empty array on failure.
   */
  fetchRisk(location: Location): Promise<HazardScore[]>;
}
