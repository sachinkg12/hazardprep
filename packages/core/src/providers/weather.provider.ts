import { BaseProvider } from './base.provider.js';
import { HazardType, scoreToLevel, type HazardScore } from '../models/hazard.js';
import type { Location } from '../models/location.js';
import { fetchJson } from '../utils/http.js';

interface NoaaPointResponse {
  properties: {
    gridId: string;
    gridX: number;
    gridY: number;
    county: string;
    forecastZone: string;
    relativeLocation: {
      properties: {
        city: string;
        state: string;
      };
    };
  };
}

interface NoaaAlertsResponse {
  features: Array<{
    properties: {
      event: string;
      severity: string;
      certainty: string;
      urgency: string;
      headline: string;
      description: string;
      effective: string;
      expires: string;
    };
  }>;
}

const SEVERITY_SCORES: Record<string, number> = {
  Extreme: 100,
  Severe: 80,
  Moderate: 50,
  Minor: 25,
  Unknown: 10,
};

/**
 * NOAA Weather provider.
 * Uses the National Weather Service API for active alerts and weather risk.
 * Free, no API key required.
 */
export class WeatherProvider extends BaseProvider {
  readonly id = 'noaa-weather';
  readonly name = 'NOAA National Weather Service';
  readonly hazardTypes = [HazardType.Hurricane, HazardType.Tornado, HazardType.SevereStorm, HazardType.Winter];

  protected async assess(location: Location): Promise<HazardScore[]> {
    const { latitude, longitude } = location.coordinates;
    const lat = latitude.toFixed(4);
    const lng = longitude.toFixed(4);

    // Fetch active alerts for this location
    const alertsUrl = `https://api.weather.gov/alerts/active?point=${lat},${lng}&status=actual`;
    const alertsData = await fetchJson<NoaaAlertsResponse>(alertsUrl);
    const alerts = alertsData.features || [];

    const scores: HazardScore[] = [];

    if (alerts.length === 0) {
      scores.push({
        type: HazardType.SevereStorm,
        score: 10,
        level: scoreToLevel(10),
        description: 'No active weather alerts for this location.',
        source: {
          name: 'NOAA National Weather Service',
          url: 'https://www.weather.gov/',
        },
      });
      return scores;
    }

    // Categorize alerts by hazard type
    const alertsByType = new Map<HazardType, typeof alerts>();

    for (const alert of alerts) {
      const event = alert.properties.event.toLowerCase();
      let type: HazardType;

      if (event.includes('hurricane') || event.includes('tropical')) {
        type = HazardType.Hurricane;
      } else if (event.includes('tornado')) {
        type = HazardType.Tornado;
      } else if (event.includes('winter') || event.includes('blizzard') || event.includes('ice') || event.includes('freeze')) {
        type = HazardType.Winter;
      } else {
        type = HazardType.SevereStorm;
      }

      if (!alertsByType.has(type)) alertsByType.set(type, []);
      alertsByType.get(type)!.push(alert);
    }

    for (const [type, typeAlerts] of alertsByType) {
      const maxSeverity = Math.max(
        ...typeAlerts.map((a) => SEVERITY_SCORES[a.properties.severity] || 10),
      );
      const alertNames = [...new Set(typeAlerts.map((a) => a.properties.event))];

      scores.push({
        type,
        score: maxSeverity,
        level: scoreToLevel(maxSeverity),
        description: `Active alerts: ${alertNames.join(', ')}`,
        source: {
          name: 'NOAA National Weather Service',
          url: 'https://www.weather.gov/',
        },
        rawData: {
          alertCount: typeAlerts.length,
          alerts: typeAlerts.map((a) => ({
            event: a.properties.event,
            severity: a.properties.severity,
            headline: a.properties.headline,
          })),
        },
      });
    }

    return scores;
  }
}
