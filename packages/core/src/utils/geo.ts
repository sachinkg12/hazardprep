import type { Coordinates, BoundingBox } from '../models/location.js';

const EARTH_RADIUS_KM = 6371;

/** Calculate distance between two points in kilometers using the Haversine formula */
export function haversineDistance(a: Coordinates, b: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinDLng * sinDLng;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** Create a bounding box around a point with a given radius in km */
export function boundingBox(center: Coordinates, radiusKm: number): BoundingBox {
  const latDelta = (radiusKm / EARTH_RADIUS_KM) * (180 / Math.PI);
  const lngDelta = latDelta / Math.cos((center.latitude * Math.PI) / 180);

  return {
    north: center.latitude + latDelta,
    south: center.latitude - latDelta,
    east: center.longitude + lngDelta,
    west: center.longitude - lngDelta,
  };
}
