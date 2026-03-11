export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  address: string;
  coordinates: Coordinates;
  county?: string;
  state?: string;
  fips?: string;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}
