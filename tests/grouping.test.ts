import { describe, expect, it } from 'vitest'
import { meta } from '../shared/domain/data'
import { faixas, grupamentoDe, idadeNoCorte } from '../shared/domain/grouping'

function deslocarMes(anoMes: string, meses: number): string {
  const date = new Date(`${anoMes}-01T00:00:00Z`)
  date.setUTCMonth(date.getUTCMonth() + meses)
  return date.toISOString().slice(0, 7)
}

describe('grupamento por nascimento', () => {
  it('inclui os dois limites de todas as janelas configuradas', () => {
    for (const faixa of faixas) {
      expect(grupamentoDe(`${faixa.de}-01`)).toEqual({ situacao: 'ok', grupamento: faixa.nome })
      expect(grupamentoDe(`${faixa.ate}-28`)).toEqual({ situacao: 'ok', grupamento: faixa.nome })
    }
  })

  it('distingue crianças novas demais e velhas demais', () => {
    const newest = faixas[0]!
    const oldest = faixas.at(-1)!

    expect(grupamentoDe(`${deslocarMes(newest.ate, 1)}-01`)).toEqual({
      situacao: 'muito-nova',
      primeiraInscricao: String(meta.anoProcesso + 1),
    })
    expect(grupamentoDe(`${deslocarMes(oldest.de, -1)}-01`)).toEqual({ situacao: 'muito-velha' })
  })

  it('rejeita formatos e datas de calendário inválidos', () => {
    for (const value of ['', '2026-2-01', '2026-13-01', '2026-02-30', 'texto']) {
      expect(grupamentoDe(value)).toEqual({ situacao: 'indefinido' })
      expect(idadeNoCorte(value)).toBeNull()
    }
  })

  it('calcula idade completa na data de corte de 31 de março', () => {
    expect(idadeNoCorte(`${meta.anoProcesso - 2}-03-31`)).toEqual({ anos: 2, meses: 0 })
    expect(idadeNoCorte(`${meta.anoProcesso - 2}-04-01`)).toEqual({ anos: 1, meses: 11 })
    expect(idadeNoCorte(`${meta.anoProcesso}-04-01`)).toBeNull()
  })
})
