import type { DataProvider } from '../models/provider.js';
import type { HazardScore } from '../models/hazard.js';
import type { Location } from '../models/location.js';
import { MemoryCache } from '../cache/cache.js';

/**
 * Base class for data providers with built-in caching.
 * Extend this to create a new hazard data source.
 */
export abstract class BaseProvider implements DataProvider {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly hazardTypes: string[];

  protected cache = new MemoryCache(60);

  async fetchRisk(location: Location): Promise<HazardScore[]> {
    const cacheKey = `${this.id}:${location.coordinates.latitude},${location.coordinates.longitude}`;
    const cached = this.cache.get<HazardScore[]>(cacheKey);
    if (cached) return cached;

    try {
      const scores = await this.assess(location);
      this.cache.set(cacheKey, scores);
      return scores;
    } catch (error) {
      console.error(`[${this.id}] Provider error:`, error);
      return [];
    }
  }

  /** Implement this in each provider to fetch and normalize risk data */
  protected abstract assess(location: Location): Promise<HazardScore[]>;
}
