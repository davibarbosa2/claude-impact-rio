import criteriosJson from '../data/criterios.generated.json'
import metaJson from '../data/meta.generated.json'
import unidadesJson from '../data/unidades.generated.json'
import type { Criterio, MetaCatalogo, Unidade } from '../types/registration'

export const meta = metaJson as MetaCatalogo
export const criterios = criteriosJson as Criterio[]
export const unidades = unidadesJson as Unidade[]

export const unidadesPorCodigo = new Map(unidades.map(unidade => [unidade.codigo, unidade]))

function segmentosDoBairro(bairro: string): string[] {
  const partes = bairro
    .split(/\s*[/-]\s*/)
    .map(parte => parte.trim())
    .filter(parte => parte.length > 2)
  return [...new Set([bairro, ...partes])]
}

export const centroidesDeBairro = (() => {
  const somas = new Map<string, { lat: number, lon: number, total: number }>()

  unidades.forEach((unidade) => {
    if (unidade.lat === null || unidade.lon === null || !unidade.bairro) return
    segmentosDoBairro(unidade.bairro).forEach((bairro) => {
      const atual = somas.get(bairro) ?? { lat: 0, lon: 0, total: 0 }
      somas.set(bairro, {
        lat: atual.lat + unidade.lat!,
        lon: atual.lon + unidade.lon!,
        total: atual.total + 1,
      })
    })
  })

  return new Map(
    [...somas].map(([bairro, soma]) => [
      bairro,
      { lat: soma.lat / soma.total, lon: soma.lon / soma.total },
    ]),
  )
})()
