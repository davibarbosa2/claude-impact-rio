import { meta } from './data'

const DESLOCAMENTO = meta.anoProcesso - meta.anoReferencia

export const faixas = meta.grupamentos.map((faixa) => {
  const deslocar = (anoMes: string) => {
    const [ano, mes] = anoMes.split('-')
    return `${Number(ano) + DESLOCAMENTO}-${mes}`
  }

  return {
    nome: faixa.nome,
    de: deslocar(faixa.nascidoDe),
    ate: deslocar(faixa.nascidoAte),
    inscricoesAnoRef: faixa.inscricoesAnoRef,
  }
})

export type ResultadoGrupamento =
  | { situacao: 'ok', grupamento: string }
  | { situacao: 'muito-nova', primeiraInscricao: string }
  | { situacao: 'muito-velha' }
  | { situacao: 'indefinido' }

export function dataIsoValida(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function grupamentoDe(nascimento: string): ResultadoGrupamento {
  if (!dataIsoValida(nascimento)) return { situacao: 'indefinido' }
  const anoMes = nascimento.slice(0, 7)

  for (const faixa of faixas) {
    if (anoMes >= faixa.de && anoMes <= faixa.ate) {
      return { situacao: 'ok', grupamento: faixa.nome }
    }
  }

  const maisNova = faixas[0]
  const maisVelha = faixas.at(-1)
  if (maisNova && anoMes > maisNova.ate) {
    return { situacao: 'muito-nova', primeiraInscricao: String(meta.anoProcesso + 1) }
  }
  if (maisVelha && anoMes < maisVelha.de) return { situacao: 'muito-velha' }
  return { situacao: 'indefinido' }
}

export function idadeNoCorte(nascimento: string): { anos: number, meses: number } | null {
  if (!dataIsoValida(nascimento)) return null
  const corte = new Date(`${meta.anoProcesso}-03-31T00:00:00`)
  const dataNascimento = new Date(`${nascimento}T00:00:00`)
  if (dataNascimento > corte) return null

  let meses = (corte.getFullYear() - dataNascimento.getFullYear()) * 12
    + corte.getMonth() - dataNascimento.getMonth()
  if (corte.getDate() < dataNascimento.getDate()) meses -= 1

  return { anos: Math.floor(meses / 12), meses: meses % 12 }
}

export function idadeEmTexto(nascimento: string): string {
  const idade = idadeNoCorte(nascimento)
  if (!idade) return ''
  const partes: string[] = []
  if (idade.anos) partes.push(`${idade.anos} ano${idade.anos > 1 ? 's' : ''}`)
  if (idade.meses) partes.push(`${idade.meses} ${idade.meses > 1 ? 'meses' : 'mês'}`)
  return partes.join(' e ') || 'menos de 1 mês'
}
