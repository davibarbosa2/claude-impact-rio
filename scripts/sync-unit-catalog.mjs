import { createGunzip } from 'node:zlib'
import { mkdir, writeFile } from 'node:fs/promises'
import { Readable } from 'node:stream'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import ExcelJS from 'exceljs'
import { parse } from 'csv-parse'

const COMMIT = '057b975e379ba021375c9024339a8cac4af65d28'
const RAW_ROOT = `https://raw.githubusercontent.com/CIT-SME-RJ/dadoscreche/${COMMIT}`
const QUERY_A_URL = `${RAW_ROOT}/Bases%20IC_%20ClassificadoseFila/01_QueryA_InscricoesPorAno.csv.gz`
const ADDRESS_URL = `${RAW_ROOT}/Bases%20IC_%20ClassificadoseFila/04_UnidadesEscolaresComEndereco.csv`
const LOCATION_URL = `${RAW_ROOT}/OferecimentosEvagas/Unidades_Unificadas_com_Localizacao.xlsx`

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const outputPath = resolve(scriptDirectory, '../shared/data/unit-catalog.generated.json')

function normalizeCode(value) {
  const code = String(value ?? '').trim().replace(/^0+/, '')
  return code || '0'
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/\s+/g, ' ')
    .trim()
}

function nullable(value) {
  const normalized = String(value ?? '').trim()
  return !normalized || normalized === 'NULL' ? null : normalized
}

async function fetchOrFail(url) {
  const response = await fetch(url)

  if (!response.ok || !response.body) {
    throw new Error(`Falha ao baixar ${url}: HTTP ${response.status}`)
  }

  return response
}

async function readHistoricalUnits() {
  const response = await fetchOrFail(QUERY_A_URL)
  const rows = Readable.fromWeb(response.body)
    .pipe(createGunzip())
    .pipe(parse({
      bom: true,
      columns: true,
      delimiter: ';',
      relax_quotes: true,
    }))

  const unitsByCode = new Map()

  for await (const row of rows) {
    const normalizedCode = normalizeCode(row.unidade)
    if (!unitsByCode.has(normalizedCode)) {
      unitsByCode.set(normalizedCode, {
        id: String(row.unidade).trim(),
        name: String(row.nome_unidade).trim(),
      })
    }
  }

  return unitsByCode
}

async function readAddresses() {
  const response = await fetchOrFail(ADDRESS_URL)
  const rows = Readable.fromWeb(response.body).pipe(parse({
    bom: true,
    columns: [
      'sequence',
      'code',
      'name',
      'typeCode',
      'street',
      'number',
      'complement',
      'neighborhood',
      'postalCode',
    ],
    delimiter: ';',
    relax_quotes: true,
  }))

  const addressesByCode = new Map()

  for await (const row of rows) {
    const normalizedCode = normalizeCode(row.code)
    const candidates = addressesByCode.get(normalizedCode) ?? []
    candidates.push(row)
    addressesByCode.set(normalizedCode, candidates)
  }

  return addressesByCode
}

async function readLocations() {
  const response = await fetchOrFail(LOCATION_URL)
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(await response.arrayBuffer())

  const worksheet = workbook.worksheets[0]
  if (!worksheet) {
    throw new Error('A planilha de localização não possui uma aba legível.')
  }

  const headers = new Map()
  worksheet.getRow(1).eachCell((cell, columnNumber) => {
    headers.set(normalizeText(cell.value), columnNumber)
  })

  const locationsByCode = new Map()
  const readCell = (row, header) => row.getCell(headers.get(normalizeText(header))).value

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return

    const code = readCell(row, 'DESIGNACAO')
    const latitude = Number(readCell(row, 'LATITUDE'))
    const longitude = Number(readCell(row, 'LONGITUDE'))

    locationsByCode.set(normalizeCode(code), {
      cre: Number(readCell(row, 'CRE')) || null,
      microArea: nullable(readCell(row, 'microárea')),
      type: nullable(readCell(row, 'Tipo')),
      latitude: Number.isFinite(latitude) ? latitude : null,
      longitude: Number.isFinite(longitude) ? longitude : null,
    })
  })

  return locationsByCode
}

function pickAddress(candidates, unitName) {
  if (!candidates?.length) return null

  return candidates.find(candidate => normalizeText(candidate.name) === normalizeText(unitName))
    ?? candidates.find(candidate => nullable(candidate.street))
    ?? candidates[0]
}

function formatAddress(address) {
  if (!address) return 'Endereço não disponível na base histórica'

  const street = nullable(address.street)
  const number = nullable(address.number)
  const complement = nullable(address.complement)

  return [street, number, complement].filter(Boolean).join(', ')
    || 'Endereço não disponível na base histórica'
}

const [historicalUnits, addresses, locations] = await Promise.all([
  readHistoricalUnits(),
  readAddresses(),
  readLocations(),
])

const units = [...historicalUnits.entries()].map(([normalizedCode, historicalUnit]) => {
  const address = pickAddress(addresses.get(normalizedCode), historicalUnit.name)
  const location = locations.get(normalizedCode)
  const hasCoordinates = Boolean(
    location
      && location.latitude !== null
      && location.longitude !== null,
  )

  return {
    id: historicalUnit.id,
    name: nullable(address?.name) ?? historicalUnit.name,
    address: formatAddress(address),
    neighborhood: nullable(address?.neighborhood) ?? 'Bairro não disponível',
    type: location?.type ?? null,
    cre: location?.cre ?? null,
    microArea: location?.microArea ?? null,
    location: hasCoordinates
      ? { latitude: location.latitude, longitude: location.longitude }
      : null,
  }
}).sort((first, second) => first.name.localeCompare(second.name, 'pt-BR'))

const payload = {
  source: {
    repository: 'https://github.com/CIT-SME-RJ/dadoscreche',
    commit: COMMIT,
    files: [
      'Bases IC_ ClassificadoseFila/01_QueryA_InscricoesPorAno.csv.gz',
      'Bases IC_ ClassificadoseFila/04_UnidadesEscolaresComEndereco.csv',
      'OferecimentosEvagas/Unidades_Unificadas_com_Localizacao.xlsx',
    ],
    historicalPeriod: '2021–2025',
    generatedAt: new Date().toISOString(),
  },
  units,
}

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

const withCoordinates = units.filter(unit => unit.location).length
console.log(`Catálogo gerado: ${units.length} unidades; ${withCoordinates} com coordenadas.`)
console.log(`Saída: ${outputPath}`)
