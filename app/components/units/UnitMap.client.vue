<script setup lang="ts">
import {
  GeoJSONSource,
  LngLatBounds,
  Map,
  NavigationControl,
  Popup,
} from 'maplibre-gl'
import type { StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { percentual } from '#shared/domain/format'
import type { Unidade } from '#shared/types/registration'

const props = defineProps<{
  units: Unidade[]
  selectedUnitIds: string[]
  origin: { lat: number, lon: number } | null
  neighborhood: string
  radiusKm: number | null
  full: boolean
}>()

const emit = defineEmits<{
  add: [unitId: string]
}>()

const mapContainer = useTemplateRef<HTMLDivElement>('mapContainer')

const mapStyle: StyleSpecification = {
  version: 8,
  sources: {
    openstreetmap: {
      type: 'raster',
      tiles: ['https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors · HOT style hosted by OpenStreetMap France',
      maxzoom: 20,
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#eef2f6' },
    },
    {
      id: 'basemap',
      type: 'raster',
      source: 'openstreetmap',
    },
  ],
}

let map: Map | undefined
let popup: Popup | undefined

function unitsGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: props.units
      .filter((unit): unit is Unidade & { lat: number, lon: number } => unit.lat !== null && unit.lon !== null)
      .map((unit) => {
        const order = props.selectedUnitIds.indexOf(unit.codigo) + 1

        return {
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [unit.lon, unit.lat] as [number, number],
          },
          properties: {
            id: unit.codigo,
            name: unit.nome,
            address: `${unit.endereco} · ${unit.bairro}`,
            attendance: percentual(unit.taxaAtendimento),
            selected: order > 0,
            order,
          },
        }
      }),
  }
}

function circlePolygon(km: number) {
  if (!props.origin) return []
  const points: [number, number][] = []
  const latitudeRadians = props.origin.lat * Math.PI / 180

  for (let index = 0; index <= 72; index += 1) {
    const angle = index / 72 * Math.PI * 2
    const latitude = props.origin.lat + (km / 111.32) * Math.sin(angle)
    const longitude = props.origin.lon + (km / (111.32 * Math.cos(latitudeRadians))) * Math.cos(angle)
    points.push([longitude, latitude])
  }
  return points
}

function ringsGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: props.origin
      ? [10, 5, 2].map(km => ({
          type: 'Feature' as const,
          geometry: { type: 'Polygon' as const, coordinates: [circlePolygon(km)] },
          properties: { km },
        }))
      : [],
  }
}

function originGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: props.origin
      ? [{
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [props.origin.lon, props.origin.lat] as [number, number],
          },
          properties: { label: props.neighborhood },
        }]
      : [],
  }
}

function updateMapData() {
  const unitsSource = map?.getSource('units')
  if (unitsSource instanceof GeoJSONSource) unitsSource.setData(unitsGeoJson())
  const ringsSource = map?.getSource('rings')
  if (ringsSource instanceof GeoJSONSource) ringsSource.setData(ringsGeoJson())
  const originSource = map?.getSource('origin')
  if (originSource instanceof GeoJSONSource) originSource.setData(originGeoJson())
}

function fitMap() {
  if (!map) return

  if (props.origin && props.radiusKm) {
    const latitudeDelta = props.radiusKm / 111.32
    const longitudeDelta = props.radiusKm / (111.32 * Math.cos(props.origin.lat * Math.PI / 180))
    map.fitBounds([
      [props.origin.lon - longitudeDelta, props.origin.lat - latitudeDelta],
      [props.origin.lon + longitudeDelta, props.origin.lat + latitudeDelta],
    ], { padding: 24, duration: 0 })
    return
  }

  const locatedUnits = props.units.filter(
    (unit): unit is Unidade & { lat: number, lon: number } => unit.lat !== null && unit.lon !== null,
  )

  if (!locatedUnits.length) return

  const bounds = new LngLatBounds()
  locatedUnits.forEach(unit => bounds.extend([unit.lon, unit.lat]))

  map.fitBounds(bounds, {
    padding: 44,
    maxZoom: 13,
    duration: 0,
  })
}

onMounted(() => {
  if (!mapContainer.value) return

  const selectedColor = '#2563eb'
  const defaultColor = '#64748b'

  map = new Map({
    container: mapContainer.value,
    style: mapStyle,
    center: [-43.25, -22.91],
    zoom: 10,
    attributionControl: { compact: true },
  })

  map.addControl(new NavigationControl({ showCompass: false }), 'top-right')

  map.on('load', () => {
    if (!map) return

    map.addSource('units', {
      type: 'geojson',
      data: unitsGeoJson(),
    })
    map.addSource('rings', { type: 'geojson', data: ringsGeoJson() })
    map.addSource('origin', { type: 'geojson', data: originGeoJson() })

    map.addLayer({
      id: 'distance-rings-fill',
      type: 'fill',
      source: 'rings',
      paint: {
        'fill-color': selectedColor,
        'fill-opacity': ['match', ['get', 'km'], 2, 0.08, 5, 0.045, 0.025],
      },
    })
    map.addLayer({
      id: 'distance-rings-line',
      type: 'line',
      source: 'rings',
      paint: {
        'line-color': selectedColor,
        'line-opacity': 0.35,
        'line-width': 1,
        'line-dasharray': [4, 4],
      },
    })

    map.addLayer({
      id: 'unit-points',
      type: 'circle',
      source: 'units',
      paint: {
        'circle-color': [
          'case',
          ['boolean', ['get', 'selected'], false],
          selectedColor,
          defaultColor,
        ],
        'circle-radius': [
          'case',
          ['boolean', ['get', 'selected'], false],
          10,
          5,
        ],
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2,
        'circle-opacity': [
          'case',
          ['boolean', ['get', 'selected'], false],
          1,
          0.72,
        ],
      },
    })

    map.addLayer({
      id: 'unit-order',
      type: 'symbol',
      source: 'units',
      filter: ['>', ['get', 'order'], 0],
      layout: {
        'text-field': ['to-string', ['get', 'order']],
        'text-size': 11,
        'text-font': ['Noto Sans Bold'],
      },
      paint: {
        'text-color': '#ffffff',
      },
    })

    map.addLayer({
      id: 'family-origin',
      type: 'circle',
      source: 'origin',
      paint: {
        'circle-color': '#059669',
        'circle-radius': 8,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 3,
      },
    })

    map.on('click', 'unit-points', (event) => {
      const feature = event.features?.[0]
      if (!feature || !map) return

      const coordinates = (feature.geometry as { coordinates: [number, number] }).coordinates
      const content = document.createElement('div')
      const title = document.createElement('strong')
      const address = document.createElement('p')
      const metric = document.createElement('p')

      title.textContent = String(feature.properties?.name ?? '')
      address.textContent = String(feature.properties?.address ?? '')
      address.style.marginTop = '0.25rem'
      metric.textContent = `${String(feature.properties?.attendance ?? '—')} confirmadas em 2025`
      metric.style.marginTop = '0.35rem'
      metric.style.fontSize = '0.75rem'
      content.append(title, address, metric)

      if (!feature.properties?.selected) {
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'map-popup-action'
        button.textContent = props.full ? 'Lista com 5 opções' : 'Adicionar à minha lista'
        button.disabled = props.full
        button.addEventListener('click', () => {
          emit('add', String(feature.properties?.id ?? ''))
          popup?.remove()
        })
        content.append(button)
      }

      popup?.remove()
      popup = new Popup({ offset: 12, closeButton: true })
        .setLngLat(coordinates)
        .setDOMContent(content)
        .addTo(map)
    })

    map.on('mouseenter', 'unit-points', () => {
      if (map) map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'unit-points', () => {
      if (map) map.getCanvas().style.cursor = ''
    })

    fitMap()
  })
})

watch(
  () => props.selectedUnitIds,
  updateMapData,
  { deep: true },
)

watch(
  () => [props.units, props.origin, props.radiusKm, props.neighborhood],
  () => {
    updateMapData()
    fitMap()
  },
  { deep: true },
)

onBeforeUnmount(() => {
  popup?.remove()
  map?.remove()
})
</script>

<template>
  <div
    ref="mapContainer"
    class="unit-map"
    role="region"
    :aria-label="`Mapa interativo das unidades compatíveis perto de ${neighborhood || 'seu bairro'}`"
  />
</template>

<style>
.unit-map {
  width: 100%;
  min-height: 22rem;
  overflow: hidden;
  border: 1px solid var(--ui-border-muted);
  border-radius: 1rem;
  background: var(--ui-bg-muted);
}

.maplibregl-popup-content {
  max-width: 17rem;
  border-radius: 0.75rem;
  color: var(--ui-text);
  font-family: inherit;
  line-height: 1.35;
}

.map-popup-action {
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.55rem 0.75rem;
  border: 0;
  border-radius: 0.55rem;
  background: var(--ui-primary);
  color: white;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.map-popup-action:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
