import { describe, expect, it } from 'vitest'
import { criarCrianca } from '../shared/domain/registration'
import {
  buscarUnidades,
  comporUnidadesDoMapa,
  origemDoBairro,
  sugestoesDeUnidades,
  unidadesElegiveis,
  unidadesVisiveisNoMapa,
} from '../shared/domain/unit-catalog'
import type { Unidade } from '../shared/types/registration'

function unidade(codigo: string, overrides: Partial<Unidade> = {}): Unidade {
  return {
    codigo,
    nome: `Creche ${codigo}`,
    tipo: 'Creche',
    bairro: 'Centro',
    endereco: 'Rua da Conceição, 1',
    cep: '20000000',
    lat: -22.903,
    lon: -43.177,
    grupamentos: ['Berçário'],
    horarios: ['Integral'],
    inscricoes: 100,
    primeiraOpcao: 30,
    taxaAtendimento: 0.3,
    vagas: 40,
    candidatosPorVaga: 0.75,
    primeiroAno: 2021,
    turmas: null,
    ...overrides,
  }
}

describe('catálogo de unidades', () => {
  it('busca por nome, endereço, bairro ou código sem depender de acentos', () => {
    const units = [
      unidade('001', { nome: 'Creche Coração de Mãe', bairro: 'Rio Comprido' }),
      unidade('002', { nome: 'EDI Parque da Alegria', bairro: 'São Cristóvão' }),
    ]

    expect(buscarUnidades(units, 'coracao')).toEqual([units[0]])
    expect(buscarUnidades(units, 'conceicao')).toEqual(units)
    expect(buscarUnidades(units, 'sao cristovao')).toEqual([units[1]])
    expect(buscarUnidades(units, '002')).toEqual([units[1]])
  })

  it('exige grupamento e turno compatíveis para tornar uma unidade elegível', () => {
    const eligible = unidade('elegivel')
    const wrongGroup = unidade('outro-grupo', { grupamentos: ['Maternal II'] })
    const wrongSchedule = unidade('outro-turno', { horarios: ['Parcial'] })

    expect(unidadesElegiveis([eligible, wrongGroup, wrongSchedule], 'Berçário', 'Integral'))
      .toEqual([eligible])
  })

  it('mantém sugestões em grupos separados sem alterar escolhas', () => {
    const origin = origemDoBairro('Centro')!
    const units = [
      unidade('escolhida', { lat: origin.lat + 0.001, lon: origin.lon }),
      unidade('anterior', { lat: origin.lat + 0.002, lon: origin.lon, taxaAtendimento: 0.4 }),
      unidade('confirmacao', { lat: origin.lat + 0.003, lon: origin.lon, taxaAtendimento: 0.9 }),
      unidade('concorrencia', { lat: origin.lat + 0.004, lon: origin.lon, candidatosPorVaga: 0.1 }),
      unidade('amostra-pequena', { lat: origin.lat + 0.005, lon: origin.lon, inscricoes: 20 }),
      unidade('sem-denominador', { lat: origin.lat + 0.006, lon: origin.lon, candidatosPorVaga: null }),
      unidade('incompativel', { grupamentos: ['Maternal II'] }),
    ]
    const child = criarCrianca('crianca-1')
    child.opcoes = ['escolhida']
    child.historico = ['anterior']
    const before = [...child.opcoes]

    const groups = sugestoesDeUnidades(units, child, 'Berçário', 'Centro', 3)
    const byReason = new Map(groups.map(group => [group.motivo, group]))

    expect([...byReason.keys()]).toEqual(['anoAnterior', 'perto', 'chance', 'concorrencia'])
    expect(byReason.get('anoAnterior')?.sugestoes.map(item => item.unidade.codigo)).toEqual(['anterior'])
    expect(byReason.get('chance')?.sugestoes.map(item => item.unidade.codigo)).not.toContain('amostra-pequena')
    expect(byReason.get('concorrencia')?.sugestoes.map(item => item.unidade.codigo)).not.toContain('sem-denominador')
    expect(groups.flatMap(group => group.sugestoes).map(item => item.unidade.codigo)).not.toContain('escolhida')
    expect(child.opcoes).toEqual(before)
  })

  it('expande o recorte de mérito até 10 km quando o raio menor não basta', () => {
    const origin = origemDoBairro('Centro')!
    const child = criarCrianca()
    const units = [
      unidade('perto', { lat: origin.lat + 0.03, lon: origin.lon }),
      unidade('mais-longe', { lat: origin.lat + 0.07, lon: origin.lon }),
    ]

    const chance = sugestoesDeUnidades(units, child, 'Berçário', 'Centro', 2)
      .find(group => group.motivo === 'chance')

    expect(chance?.explicacao).toContain('até 10 km')
    expect(chance?.sugestoes).toHaveLength(2)
  })

  it('usa o menor raio útil e limita o mapa a 45 unidades', () => {
    const origin = { lat: -22.9, lon: -43.2 }
    const units = Array.from({ length: 50 }, (_, index) => unidade(String(index), {
      lat: origin.lat + index * 0.0001,
      lon: origin.lon,
    }))

    const result = unidadesVisiveisNoMapa(units, origin)

    expect(result.raioKm).toBe(2)
    expect(result.unidades).toHaveLength(45)
  })

  it('mantém escolhas visíveis no mapa sem ultrapassar o limite', () => {
    const visible = Array.from({ length: 45 }, (_, index) => unidade(`visivel-${index}`))
    const selected = [unidade('selecionada-fora-do-raio')]

    const result = comporUnidadesDoMapa(visible, selected)

    expect(result).toHaveLength(45)
    expect(result[0]?.codigo).toBe('selecionada-fora-do-raio')
    expect(result.map(item => item.codigo)).toContain('visivel-0')
  })
})
