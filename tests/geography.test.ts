import { describe, expect, it } from 'vitest'
import { distanceInKm, rankUnitsByDistance } from '../shared/domain/geography'
import type { Unit } from '../shared/types/registration'

const origin = { latitude: -22.93, longitude: -43.2 }

const units: Unit[] = [
  {
    id: 'far',
    name: 'Unidade distante',
    address: 'Endereço B',
    neighborhood: 'Bairro B',
    type: null,
    cre: null,
    microArea: null,
    location: { latitude: -22.8, longitude: -43.4 },
  },
  {
    id: 'near',
    name: 'Unidade próxima',
    address: 'Endereço A',
    neighborhood: 'Bairro A',
    type: null,
    cre: null,
    microArea: null,
    location: { latitude: -22.931, longitude: -43.201 },
  },
  {
    id: 'unknown',
    name: 'Sem coordenadas',
    address: 'Endereço C',
    neighborhood: 'Bairro C',
    type: null,
    cre: null,
    microArea: null,
    location: null,
  },
]

describe('geografia', () => {
  it('calcula zero para pontos idênticos', () => {
    expect(distanceInKm(origin, origin)).toBe(0)
  })

  it('ordena sugestões por distância e ignora unidades sem coordenadas', () => {
    const result = rankUnitsByDistance(units, origin, 5)

    expect(result.map(item => item.unit.id)).toEqual(['near', 'far'])
    expect(result[0]?.distanceKm).toBeLessThan(result[1]?.distanceKm ?? 0)
  })
})
