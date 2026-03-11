import { BaseProvider } from './base.provider.js';
import { HazardType, scoreToLevel, type HazardScore } from '../models/hazard.js';
import type { Location } from '../models/location.js';
import { fetchJson } from '../utils/http.js';
import { boundingBox } from '../utils/geo.js';

interface UsgsEarthquakeResponse {
  features: Array<{
    properties: {
      mag: number;
      place: string;
      time: number;
      type: string;
    };
    geometry: {
      coordinates: [number, number, number];
    };
  }>;
  metadata: { count: number };
}

/**
 * USGS Earthquake Hazards provider.
 * Fetches historical earthquakes within a radius of the location.
 * Free, no API key required.
 */
export class EarthquakeProvider extends BaseProvider {
  readonly id = 'usgs-earthquake';
  readonly name = 'USGS Earthquake Hazards';
  readonly hazardTypes = [HazardType.Earthquake];

  private readonly searchRadiusKm = 150;
  private readonly lookbackYears = 30;

  protected async assess(location: Location): Promise<HazardScore[]> {
    const { latitude, longitude } = location.coordinates;

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - this.lookbackYears * 365.25 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const url =
      `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson` +
      `&starttime=${startDate}&endtime=${endDate}` +
      `&latitude=${latitude}&longitude=${longitude}` +
      `&maxradiuskm=${this.searchRadiusKm}` +
      `&minmagnitude=2.5&orderby=magnitude&limit=500`;

    const data = await fetchJson<UsgsEarthquakeResponse>(url);
    const quakes = data.features || [];

    if (quakes.length === 0) {
      return [
        {
          type: HazardType.Earthquake,
          score: 5,
          level: scoreToLevel(5),
          description: `No significant earthquakes (M2.5+) within ${this.searchRadiusKm}km in the last ${this.lookbackYears} years.`,
          source: {
            name: 'USGS Earthquake Hazards Program',
            url: 'https://earthquake.usgs.gov/',
          },
        },
      ];
    }

    // Score based on frequency and max magnitude
    const maxMag = Math.max(...quakes.map((q) => q.properties.mag));
    const significantCount = quakes.filter((q) => q.properties.mag >= 4.0).length;

    // Scoring: max magnitude contributes 60%, frequency contributes 40%
    const magScore = Math.min(100, (maxMag / 8) * 100);
    const freqScore = Math.min(100, significantCount * 5);
    const score = Math.round(magScore * 0.6 + freqScore * 0.4);

    return [
      {
        type: HazardType.Earthquake,
        score,
        level: scoreToLevel(score),
        description: `${quakes.length} earthquakes (M2.5+) within ${this.searchRadiusKm}km in the last ${this.lookbackYears} years. Largest: M${maxMag.toFixed(1)}.`,
        source: {
          name: 'USGS Earthquake Hazards Program',
          url: 'https://earthquake.usgs.gov/',
        },
        rawData: {
          totalQuakes: quakes.length,
          maxMagnitude: maxMag,
          significantCount,
          searchRadiusKm: this.searchRadiusKm,
        },
      },
    ];
  }
}
