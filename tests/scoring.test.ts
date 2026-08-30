import { describe, expect, it } from 'vitest'
import { criteriosCrianca, criteriosFamilia, documentosNecessarios, pontuacaoDaCrianca, prazoDocumentos } from '../shared/domain/scoring'
import { criarCrianca, criarInscricao } from '../shared/domain/registration'

describe('pontuação e documentos', () => {
  it('compartilha critérios familiares e isola critérios por criança', () => {
    const registration = criarInscricao()
    const first = criarCrianca('primeira')
    const second = criarCrianca('segunda')
    registration.criancas = [first, second]
    const family = criteriosFamilia.find(criterion => !criterion.desempate)!
    const childOnly = criteriosCrianca.find(criterion => !criterion.desempate)!
    registration.criteriosFamilia[family.id] = true
    registration.criteriosCrianca[childOnly.id] = [first.id]

    expect(pontuacaoDaCrianca(registration, first).pontos).toBe(family.pontos + childOnly.pontos)
    expect(pontuacaoDaCrianca(registration, second).pontos).toBe(family.pontos)
  })

  it('mantém critérios de desempate fora da soma de pontos', () => {
    const registration = criarInscricao()
    const child = criarCrianca('primeira')
    registration.criancas = [child]
    const tieBreak = criteriosFamilia.find(criterion => criterion.desempate)!
    registration.criteriosFamilia[tieBreak.id] = true

    const score = pontuacaoDaCrianca(registration, child)

    expect(score.pontos).toBe(0)
    expect(score.desempates.map(criterion => criterion.id)).toEqual([tieBreak.id])
  })

  it('produz zero pontos quando nenhum critério foi marcado', () => {
    const registration = criarInscricao()

    expect(pontuacaoDaCrianca(registration, registration.criancas[0]!).pontos).toBe(0)
  })

  it('lista uma comprovação uma única vez mesmo quando vale para irmãos', () => {
    const registration = criarInscricao()
    const first = criarCrianca('primeira')
    const second = criarCrianca('segunda')
    registration.criancas = [first, second]
    const criterion = criteriosCrianca.find(item => !item.documentos[0]?.startsWith('Nenhum'))!
    registration.criteriosCrianca[criterion.id] = [first.id, second.id]

    const documents = documentosNecessarios(registration)

    expect(documents).toHaveLength(1)
    expect(documents[0]?.criterio.id).toBe(criterion.id)
  })

  it('calcula o prazo em três dias corridos', () => {
    expect(prazoDocumentos('2026-08-29T10:00:00.000Z').toISOString().slice(0, 10)).toBe('2026-09-01')
  })
})
