import { criterios, meta } from './data'
import type { Criterio, Crianca, Inscricao } from '../types/registration'

export const criteriosFamilia = criterios.filter(criterio => criterio.escopo === 'familia')
export const criteriosCrianca = criterios.filter(criterio => criterio.escopo === 'crianca')

export function criteriosDaCrianca(inscricao: Inscricao, crianca: Crianca): Criterio[] {
  return criterios.filter(criterio => criterio.escopo === 'familia'
    ? inscricao.criteriosFamilia[criterio.id] === true
    : (inscricao.criteriosCrianca[criterio.id] ?? []).includes(crianca.id))
}

export function pontuacaoDaCrianca(inscricao: Inscricao, crianca: Crianca) {
  const marcados = criteriosDaCrianca(inscricao, crianca)
  const pontuados = marcados.filter(criterio => !criterio.desempate)

  return {
    pontos: pontuados.reduce((total, criterio) => total + criterio.pontos, 0),
    maximo: meta.pontuacaoMaxima,
    desempates: marcados.filter(criterio => criterio.desempate),
    pontuados,
  }
}

export function temCriterioMarcado(inscricao: Inscricao): boolean {
  return Object.values(inscricao.criteriosFamilia).some(Boolean)
    || Object.values(inscricao.criteriosCrianca).some(ids => ids.length > 0)
}

export function documentosNecessarios(inscricao: Inscricao): Array<{ criterio: Criterio, documentos: string[] }> {
  return criterios
    .filter(criterio => criterio.escopo === 'familia'
      ? inscricao.criteriosFamilia[criterio.id] === true
      : (inscricao.criteriosCrianca[criterio.id] ?? []).length > 0)
    .filter(criterio => criterio.documentos.length > 0 && !criterio.documentos[0]?.startsWith('Nenhum'))
    .map(criterio => ({ criterio, documentos: criterio.documentos }))
}

export function prazoDocumentos(enviadoEm: string): Date {
  const prazo = new Date(enviadoEm)
  prazo.setDate(prazo.getDate() + meta.prazoDocumentosDias)
  return prazo
}
