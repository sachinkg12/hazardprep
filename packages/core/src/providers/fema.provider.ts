import { BaseProvider } from './base.provider.js';
import { HazardType, scoreToLevel, type HazardScore } from '../models/hazard.js';
import type { Location } from '../models/location.js';
import { fetchJson } from '../utils/http.js';

interface FemaDisasterDeclaration {
  disasterNumber: number;
  declarationTitle: string;
  declarationType: string;
  declarationDate: string;
  incidentType: string;
  state: string;
  fipsStateCode: string;
  fipsCountyCode: string;
}

interface FemaApiResponse {
  DisasterDeclarationsSummaries: FemaDisasterDeclaration[];
  metadata: { count: number };
}

const INCIDENT_TYPE_MAP: Record<string, HazardType> = {
  Flood: HazardType.Flood,
  'Severe Storm(s)': HazardType.SevereStorm,
  Hurricane: HazardType.Hurricane,
  Tornado: HazardType.Tornado,
  Fire: HazardType.Wildfire,
  Earthquake: HazardType.Earthquake,
  'Snow/Ice Storm': HazardType.Winter,
  Drought: HazardType.Drought,
};

/**
 * FEMA Disaster Declarations provider.
 * Uses OpenFEMA API to fetch historical disaster declarations for a county.
 * Free, no API key required.
 */
export class FemaProvider extends BaseProvider {
  readonly id = 'fema';
  readonly name = 'FEMA Disaster Declarations';
  readonly hazardTypes = [
    HazardType.Flood,
    HazardType.Hurricane,
    HazardType.Tornado,
    HazardType.Wildfire,
    HazardType.SevereStorm,
    HazardType.Winter,
  ];

  protected async assess(location: Location): Promise<HazardScore[]> {
    if (!location.fips && !location.state) {
      return [];
    }

    const filter = location.fips
      ? `fipsStateCode eq '${location.fips.slice(0, 2)}' and fipsCountyCode eq '${location.fips.slice(2)}'`
      : `state eq '${location.state}'`;

    const url = `https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=${encodeURIComponent(filter)}&$select=incidentType,declarationDate&$orderby=declarationDate desc&$top=1000`;

    const data = await fetchJson<FemaApiResponse>(url);
    const declarations = data.DisasterDeclarationsSummaries || [];

    // Count declarations by hazard type
    const counts = new Map<HazardType, number>();
    for (const decl of declarations) {
      const hazardType = INCIDENT_TYPE_MAP[decl.incidentType];
      if (hazardType) {
        counts.set(hazardType, (counts.get(hazardType) || 0) + 1);
      }
    }

    // Normalize counts to 0-100 scores
    // Use log scale: 0 declarations = 0, 1 = 20, 5 = 50, 15+ = 80, 30+ = 100
    const normalize = (count: number): number => {
      if (count === 0) return 0;
      return Math.min(100, Math.round(20 * Math.log2(count + 1)));
    };

    const scores: HazardScore[] = [];

    for (const hazardType of Object.values(HazardType)) {
      const count = counts.get(hazardType) || 0;
      if (count === 0) continue;

      const score = normalize(count);
      scores.push({
        type: hazardType,
        score,
        level: scoreToLevel(score),
        description: `${count} FEMA disaster declaration${count !== 1 ? 's' : ''} for ${hazardType} in this county.`,
        source: {
          name: 'OpenFEMA',
          url: 'https://www.fema.gov/about/openfema/data-sets',
        },
        rawData: { declarationCount: count, totalDeclarations: declarations.length },
      });
    }

    return scores;
  }
}
