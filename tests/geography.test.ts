import { describe, expect, it } from 'vitest'
import { distanceInKm, rankUnitsByDistance } from '../shared/domain/geography'
import type { Unidade } from '../shared/types/registration'

const origin = { latitude: -22.93, longitude: -43.2 }

function unidade(codigo: string, lat: number | null, lon: number | null): Unidade {
  return {
    codigo,
    nome: `Unidade ${codigo}`,
    tipo: 'Creche',
    bairro: 'Centro',
    endereco: 'Rua de teste, 1',
    cep: '20000000',
    lat,
    lon,
    grupamentos: ['Berçário'],
    horarios: ['Integral'],
    inscricoes: 100,
    primeiraOpcao: 30,
    taxaAtendimento: 0.3,
    vagas: 40,
    candidatosPorVaga: 0.75,
    primeiroAno: 2021,
    turmas: null,
  }
}

describe('geografia', () => {
  it('calcula zero para pontos idênticos', () => {
    expect(distanceInKm(origin, origin)).toBe(0)
  })

  it('ordena por distância e ignora unidades sem coordenadas', () => {
    const units = [
      unidade('distante', -22.8, -43.4),
      unidade('proxima', -22.931, -43.201),
      unidade('sem-coordenadas', null, null),
    ]

    const result = rankUnitsByDistance(units, origin, 5)

    expect(result.map(item => item.unit.codigo)).toEqual(['proxima', 'distante'])
    expect(result[0]?.distanceKm).toBeLessThan(result[1]?.distanceKm ?? 0)
  })
})
