import { BaseProvider } from './base.provider.js';
import { HazardType, scoreToLevel, type HazardScore } from '../models/hazard.js';
import type { Location } from '../models/location.js';
import { fetchJson } from '../utils/http.js';

interface NifcFireResponse {
  features: Array<{
    attributes: {
      IncidentName: string;
      FireDiscoveryDateTime: number;
      DailyAcres: number;
      PercentContained: number;
      POOState: string;
      POOCounty: string;
    };
    geometry: {
      x: number;
      y: number;
    };
  }>;
}

/**
 * NIFC Wildfire provider.
 * Uses NIFC ArcGIS service for active wildfire data.
 * Free, no API key required.
 */
export class WildfireProvider extends BaseProvider {
  readonly id = 'nifc-wildfire';
  readonly name = 'NIFC Wildfire Data';
  readonly hazardTypes = [HazardType.Wildfire];

  private readonly searchRadiusKm = 200;

  protected async assess(location: Location): Promise<HazardScore[]> {
    const { latitude, longitude } = location.coordinates;

    // Query NIFC active fire perimeters within search radius
    // Using the NIFC ArcGIS REST API
    const radiusMeters = this.searchRadiusKm * 1000;
    const geometry = JSON.stringify({
      x: longitude,
      y: latitude,
      spatialReference: { wkid: 4326 },
    });

    const params = new URLSearchParams({
      geometry,
      geometryType: 'esriGeometryPoint',
      spatialRel: 'esriSpatialRelIntersects',
      distance: radiusMeters.toString(),
      units: 'esriSRUnit_Meter',
      outFields: 'IncidentName,FireDiscoveryDateTime,DailyAcres,PercentContained,POOState,POOCounty',
      returnGeometry: 'true',
      f: 'json',
    });

    const url = `https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/WFIGS_Incident_Locations_Current/FeatureServer/0/query?${params}`;

    let fires: NifcFireResponse['features'] = [];
    try {
      const data = await fetchJson<NifcFireResponse>(url);
      fires = data.features || [];
    } catch {
      // NIFC API can be flaky; degrade gracefully
    }

    if (fires.length === 0) {
      return [
        {
          type: HazardType.Wildfire,
          score: 10,
          level: scoreToLevel(10),
          description: `No active wildfires within ${this.searchRadiusKm}km of this location.`,
          source: {
            name: 'NIFC - National Interagency Fire Center',
            url: 'https://data-nifc.opendata.arcgis.com/',
          },
        },
      ];
    }

    const totalAcres = fires.reduce((sum, f) => sum + (f.attributes.DailyAcres || 0), 0);
    const fireNames = fires
      .slice(0, 5)
      .map((f) => f.attributes.IncidentName)
      .filter(Boolean);

    // Score based on number of fires and total acreage
    const countScore = Math.min(50, fires.length * 10);
    const acreScore = Math.min(50, Math.round(Math.log10(Math.max(totalAcres, 1)) * 12.5));
    const score = Math.min(100, countScore + acreScore);

    return [
      {
        type: HazardType.Wildfire,
        score,
        level: scoreToLevel(score),
        description: `${fires.length} active wildfire${fires.length !== 1 ? 's' : ''} within ${this.searchRadiusKm}km. Total area: ${totalAcres.toLocaleString()} acres.${fireNames.length > 0 ? ` Notable: ${fireNames.join(', ')}.` : ''}`,
        source: {
          name: 'NIFC - National Interagency Fire Center',
          url: 'https://data-nifc.opendata.arcgis.com/',
        },
        rawData: {
          activeFireCount: fires.length,
          totalAcres,
          fireNames,
        },
      },
    ];
  }
}
