import metaJson from '#shared/data/meta.generated.json'
import unidadesJson from '#shared/data/unidades.generated.json'
import { buscarUnidades } from '#shared/domain/unit-catalog'
import type { FonteCatalogo, MetaCatalogo, RespostaCatalogo, Unidade } from '#shared/types/registration'

const units = unidadesJson as Unidade[]
const meta = metaJson as MetaCatalogo
const source: FonteCatalogo = {
  repositorio: 'https://github.com/CIT-SME-RJ/dadoscreche',
  derivadoDe: [
    '01_QueryA_InscricoesPorAno.csv.gz',
    '02_QueryB_RespostasSocioEconomicas.csv.gz',
    '03_QueryC_PerguntasComDescricao.csv',
    'OferecimentosEvagas',
  ],
  anoReferencia: meta.anoReferencia,
  aviso: 'Indicadores históricos; não representam vagas abertas no processo atual.',
}

export default defineEventHandler((event): RespostaCatalogo => {
  const query = getQuery(event)
  const searchQuery = typeof query.q === 'string' ? query.q : ''
  const filteredUnits = buscarUnidades(units, searchQuery)

  setHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')

  return {
    data: filteredUnits,
    meta: {
      ...meta,
      retornadas: filteredUnits.length,
      fonte: source,
      disponibilidadeAtual: false,
    },
  }
})
