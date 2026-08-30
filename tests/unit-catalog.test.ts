import { describe, expect, it } from 'vitest'
import { searchUnits, suggestUnits } from '../shared/domain/unit-catalog'
import type { Unit } from '../shared/types/registration'

const units: Unit[] = [
  {
    id: '1',
    name: 'Creche Coração de Mãe',
    address: 'Rua da Conceição, 1',
    neighborhood: 'Rio Comprido',
    type: 'Creche Parceira',
    cre: 1,
    microArea: '1.7',
    location: { latitude: -22.925, longitude: -43.214 },
  },
  {
    id: '2',
    name: 'EDI Parque da Alegria',
    address: 'Rua Paraíso, s/nº',
    neighborhood: 'São Cristóvão',
    type: 'EDI',
    cre: 1,
    microArea: '1.1',
    location: { latitude: -22.884, longitude: -43.231 },
  },
]

describe('catálogo de unidades', () => {
  it('busca por nome, endereço ou bairro sem depender de acentos', () => {
    expect(searchUnits(units, 'coracao')).toEqual([units[0]])
    expect(searchUnits(units, 'sao cristovao')).toEqual([units[1]])
  })

  it('sugere unidades sem transformar a sugestão em escolha', () => {
    const selected = ['2']
    const suggestions = suggestUnits(units, selected)

    expect(suggestions).toEqual([units[0]])
    expect(selected).toEqual(['2'])
  })
})
