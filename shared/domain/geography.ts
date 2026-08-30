import type { Unidade } from '../types/registration'

export interface Coordinates {
  latitude: number
  longitude: number
}

const EARTH_RADIUS_KM = 6371

function toRadians(value: number): number {
  return value * Math.PI / 180
}

export function distanceInKm(origin: Coordinates, destination: Coordinates): number {
  const latitudeDelta = toRadians(destination.latitude - origin.latitude)
  const longitudeDelta = toRadians(destination.longitude - origin.longitude)
  const originLatitude = toRadians(origin.latitude)
  const destinationLatitude = toRadians(destination.latitude)

  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(originLatitude)
    * Math.cos(destinationLatitude)
    * Math.sin(longitudeDelta / 2) ** 2

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(haversine))
}

export function rankUnitsByDistance(
  units: readonly Unidade[],
  origin: Coordinates,
  limit: number,
): Array<{ unit: Unidade, distanceKm: number }> {
  return units
    .filter((unit): unit is Unidade & { lat: number, lon: number } => unit.lat !== null && unit.lon !== null)
    .map(unit => ({
      unit,
      distanceKm: distanceInKm(origin, { latitude: unit.lat, longitude: unit.lon }),
    }))
    .sort((first, second) => first.distanceKm - second.distanceKm)
    .slice(0, limit)
}
