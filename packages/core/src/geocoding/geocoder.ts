import type { Location } from '../models/location.js';
import { fetchJson } from '../utils/http.js';

interface CensusGeocodingResult {
  result: {
    addressMatches: Array<{
      matchedAddress: string;
      coordinates: { x: number; y: number };
      addressComponents: {
        state: string;
        county: string;
      };
      geographies?: {
        Counties?: Array<{ GEOID: string }>;
      };
    }>;
  };
}

/**
 * Geocode an address using the US Census Bureau Geocoding API.
 * Free, no API key required, and specifically designed for US addresses.
 */
export async function geocodeAddress(address: string): Promise<Location> {
  const encoded = encodeURIComponent(address);
  const url = `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=${encoded}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`;

  const data = await fetchJson<CensusGeocodingResult>(url, { timeout: 15_000 });

  const matches = data.result.addressMatches;
  if (matches.length === 0) {
    throw new Error(`Could not geocode address: "${address}". Please check the address and try again.`);
  }

  const match = matches[0];
  const fips = match.geographies?.Counties?.[0]?.GEOID;

  return {
    address: match.matchedAddress,
    coordinates: {
      latitude: match.coordinates.y,
      longitude: match.coordinates.x,
    },
    state: match.addressComponents.state,
    county: match.addressComponents.county,
    fips,
  };
}
