<script setup lang="ts">
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
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

let map: L.Map | null = null
let contextLayer: L.LayerGroup | null = null
let unitsLayer: L.LayerGroup | null = null

function locatedUnits() {
  return props.units.filter(
    (unit): unit is Unidade & { lat: number, lon: number } => unit.lat !== null && unit.lon !== null,
  )
}

function renderContext() {
  if (!contextLayer) return
  contextLayer.clearLayers()
  if (!props.origin) return

  L.marker([props.origin.lat, props.origin.lon], {
    icon: L.divIcon({
      className: 'unit-map-origin',
      html: '<span></span>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    }),
    keyboard: false,
    zIndexOffset: 1000,
  })
    .bindTooltip(`Centro aproximado de ${props.neighborhood}`, { direction: 'top' })
    .addTo(contextLayer)

  const rings = [
    { km: 10, opacity: 0.025, dashArray: '3 7' },
    { km: 5, opacity: 0.045, dashArray: '6 6' },
    { km: 2, opacity: 0.08, dashArray: undefined },
  ]

  rings.forEach((ring) => {
    L.circle([props.origin!.lat, props.origin!.lon], {
      radius: ring.km * 1000,
      color: '#2563eb',
      weight: 1,
      dashArray: ring.dashArray,
      fillColor: '#2563eb',
      fillOpacity: ring.opacity,
      interactive: false,
    }).addTo(contextLayer!)
  })
}

function popupFor(unit: Unidade, order: number) {
  const content = document.createElement('div')
  const title = document.createElement('strong')
  const address = document.createElement('p')
  const metric = document.createElement('p')

  title.textContent = unit.nome
  address.textContent = `${unit.endereco} · ${unit.bairro}`
  address.className = 'unit-map-popup-line'
  metric.textContent = `${percentual(unit.taxaAtendimento)} confirmadas em 2025`
  metric.className = 'unit-map-popup-metric'
  content.append(title, address, metric)

  if (order > 0) {
    const note = document.createElement('strong')
    note.className = 'unit-map-popup-note'
    note.textContent = `${order}ª opção`
    content.append(note)
    return content
  }

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'map-popup-action'
  button.textContent = props.full ? 'Lista com 5 opções' : 'Adicionar à minha lista'
  button.disabled = props.full
  button.addEventListener('click', () => {
    emit('add', unit.codigo)
    map?.closePopup()
  })
  content.append(button)
  return content
}

function renderUnits() {
  if (!unitsLayer) return
  unitsLayer.clearLayers()

  locatedUnits().forEach((unit) => {
    const order = props.selectedUnitIds.indexOf(unit.codigo) + 1
    const position: L.LatLngExpression = [unit.lat, unit.lon]
    const marker: L.Marker | L.CircleMarker = order > 0
      ? L.marker(position, {
          icon: L.divIcon({
            className: 'unit-map-selected',
            html: `<span>${order}</span>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          }),
          keyboard: false,
          zIndexOffset: 500,
        })
      : L.circleMarker(position, {
          radius: 5,
          color: '#ffffff',
          weight: 2,
          fillColor: '#64748b',
          fillOpacity: 0.9,
        })

    marker
      .bindPopup(popupFor(unit, order), { closeButton: true, minWidth: 220 })
      .addTo(unitsLayer!)
  })
}

function fitMap() {
  if (!map) return

  if (props.origin && props.radiusKm) {
    const bounds = L.latLng(props.origin.lat, props.origin.lon).toBounds(props.radiusKm * 2000)
    map.fitBounds(bounds, { padding: [16, 16], animate: false })
    return
  }

  const units = locatedUnits()
  if (!units.length) return
  map.fitBounds(
    L.latLngBounds(units.map(unit => [unit.lat, unit.lon] as L.LatLngTuple)),
    { padding: [36, 36], maxZoom: 13, animate: false },
  )
}

function renderMapData() {
  renderContext()
  renderUnits()
  fitMap()
}

onMounted(() => {
  if (!mapContainer.value) return

  const center: L.LatLngExpression = props.origin
    ? [props.origin.lat, props.origin.lon]
    : [-22.9, -43.3]

  map = L.map(mapContainer.value, {
    center,
    zoom: props.origin ? 13 : 11,
    scrollWheelZoom: false,
    attributionControl: true,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)

  contextLayer = L.layerGroup().addTo(map)
  unitsLayer = L.layerGroup().addTo(map)
  renderMapData()

  nextTick(() => map?.invalidateSize())
})

watch(
  () => [
    props.units,
    props.selectedUnitIds,
    props.origin,
    props.neighborhood,
    props.radiusKm,
    props.full,
  ],
  renderMapData,
  { deep: true },
)

onBeforeUnmount(() => {
  map?.remove()
  map = null
  contextLayer = null
  unitsLayer = null
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
  z-index: 0;
  width: 100%;
  height: 22rem;
  overflow: hidden;
  border: 1px solid var(--ui-border-muted);
  border-radius: 1rem;
  background: #eef2f6;
  font-family: inherit;
}

.unit-map-origin,
.unit-map-selected {
  display: grid;
  place-items: center;
}

.unit-map-origin span {
  width: 14px;
  height: 14px;
  border: 2.5px solid #ffffff;
  border-radius: 50%;
  background: #059669;
  box-shadow: 0 1px 4px rgb(15 23 42 / 40%);
}

.unit-map-selected span {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: #2563eb;
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 1px 4px rgb(15 23 42 / 35%);
}

.unit-map-popup-line {
  margin-top: 0.25rem;
}

.unit-map-popup-metric {
  margin-top: 0.35rem;
  font-size: 0.75rem;
}

.unit-map-popup-note {
  display: block;
  margin-top: 0.65rem;
  color: #2563eb;
  font-size: 0.8rem;
}

.map-popup-action {
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.55rem 0.75rem;
  border: 0;
  border-radius: 0.55rem;
  background: #2563eb;
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
