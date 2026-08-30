import { centroidesDeBairro, meta } from './data'
import { distanceInKm } from './geography'
import type { Crianca, Unidade } from '../types/registration'

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('pt-BR')
    .trim()
}

export function buscarUnidades(units: readonly Unidade[], query: string): Unidade[] {
  const normalizedQuery = normalize(query)

  if (!normalizedQuery) {
    return [...units]
  }

  return units.filter((unit) => {
    const searchableText = normalize(`${unit.nome} ${unit.endereco} ${unit.bairro} ${unit.codigo}`)
    return searchableText.includes(normalizedQuery)
  })
}

export function unidadesElegiveis(
  units: readonly Unidade[],
  grupamento: string,
  horario: string,
): Unidade[] {
  return units.filter(unidade => unidade.grupamentos.includes(grupamento)
    && unidade.horarios.includes(horario))
}

export function origemDoBairro(bairro: string): { lat: number, lon: number } | null {
  if (centroidesDeBairro.has(bairro)) return centroidesDeBairro.get(bairro) ?? null
  const normalizado = normalize(bairro)
  const encontrado = [...centroidesDeBairro].find(([nome]) => normalize(nome) === normalizado)
  return encontrado?.[1] ?? null
}

function distanciaDaUnidade(
  unidade: Unidade,
  origem: { lat: number, lon: number } | null,
): number | null {
  if (!origem || unidade.lat === null || unidade.lon === null) return null
  return distanceInKm(
    { latitude: origem.lat, longitude: origem.lon },
    { latitude: unidade.lat, longitude: unidade.lon },
  )
}

export type MotivoSugestao = 'perto' | 'chance' | 'concorrencia' | 'anoAnterior'

export interface SugestaoUnidade {
  unidade: Unidade
  motivo: MotivoSugestao
  distanciaKm: number | null
}

export interface GrupoSugestao {
  motivo: MotivoSugestao
  titulo: string
  explicacao: string
  sugestoes: SugestaoUnidade[]
}

export function sugestoesDeUnidades(
  units: readonly Unidade[],
  crianca: Crianca,
  grupamento: string,
  bairro: string,
  porGrupo = 6,
): GrupoSugestao[] {
  const origem = origemDoBairro(bairro)
  const escolhidas = new Set(crianca.opcoes)
  const elegiveis = unidadesElegiveis(units, grupamento, crianca.horario)
    .filter(unidade => !escolhidas.has(unidade.codigo))
  const porCodigo = new Map(units.map(unidade => [unidade.codigo, unidade]))
  const distancia = (unidade: Unidade) => distanciaDaUnidade(unidade, origem)
  const montar = (
    motivo: MotivoSugestao,
    titulo: string,
    explicacao: string,
    lista: Unidade[],
  ): GrupoSugestao => ({
    motivo,
    titulo,
    explicacao,
    sugestoes: lista.slice(0, porGrupo).map(unidade => ({
      unidade,
      motivo,
      distanciaKm: distancia(unidade),
    })),
  })

  const grupos: GrupoSugestao[] = []
  const codigosElegiveis = new Set(elegiveis.map(unidade => unidade.codigo))
  const historico = crianca.historico
    .map(codigo => porCodigo.get(codigo))
    .filter((unidade): unidade is Unidade => Boolean(unidade) && !escolhidas.has(unidade!.codigo))
  const tentativasElegiveis = historico.filter(unidade => codigosElegiveis.has(unidade.codigo))

  if (tentativasElegiveis.length) {
    grupos.push(montar(
      'anoAnterior',
      'Onde você já tentou',
      'Unidades do histórico que ainda atendem o grupamento e o turno desta criança.',
      tentativasElegiveis,
    ))
  }

  const dentroDoRaio = (raio: number) => elegiveis.filter((unidade) => {
    const valor = distancia(unidade)
    return valor !== null && valor <= raio
  })
  let vizinhas = elegiveis
  let raioUsado: number | null = null

  if (origem) {
    for (const raio of [5, 10, 20]) {
      const dentro = dentroDoRaio(raio)
      if (dentro.length >= porGrupo) {
        vizinhas = dentro
        raioUsado = raio
        break
      }
    }

    const proximas = elegiveis
      .filter(unidade => distancia(unidade) !== null)
      .sort((a, b) => distancia(a)! - distancia(b)!)
    grupos.push(montar(
      'perto',
      'Mais perto de você',
      `Distância aproximada a partir do centro de ${bairro}; o endereço só personaliza a sugestão.`,
      proximas,
    ))
  }

  const recorte = raioUsado ? ` entre unidades a até ${raioUsado} km` : ''
  const maiorChance = vizinhas
    .filter(unidade => unidade.inscricoes >= 30)
    .sort((a, b) => b.taxaAtendimento - a.taxaAtendimento)
  grupos.push(montar(
    'chance',
    'Maior confirmação histórica',
    `Taxa observada no processo de ${meta.anoReferencia}${recorte}; não é garantia de vaga.`,
    maiorChance,
  ))

  const menosDisputadas = vizinhas
    .filter(unidade => unidade.candidatosPorVaga !== null && unidade.vagas >= 20)
    .sort((a, b) => a.candidatosPorVaga! - b.candidatosPorVaga!)
  if (menosDisputadas.length) {
    grupos.push(montar(
      'concorrencia',
      'Menos disputadas',
      `Menos candidatos de primeira opção por vaga ocupada em ${meta.anoReferencia}${recorte}.`,
      menosDisputadas,
    ))
  }

  return grupos.filter(grupo => grupo.sugestoes.length > 0)
}

export function unidadesVisiveisNoMapa(
  units: readonly Unidade[],
  origem: { lat: number, lon: number } | null,
  limite = 45,
): { unidades: Unidade[], raioKm: number | null } {
  const localizadas = units.filter(
    (unidade): unidade is Unidade & { lat: number, lon: number } => unidade.lat !== null && unidade.lon !== null,
  )
  if (!origem) return { unidades: localizadas.slice(0, limite), raioKm: null }

  const ordenadas = localizadas
    .map(unidade => ({ unidade, distancia: distanciaDaUnidade(unidade, origem)! }))
    .sort((a, b) => a.distancia - b.distancia)
  const raioKm = [2, 5, 10].find(raio => ordenadas.filter(item => item.distancia <= raio).length >= 10) ?? 10

  return {
    unidades: ordenadas
      .filter(item => item.distancia <= raioKm)
      .slice(0, limite)
      .map(item => item.unidade),
    raioKm,
  }
}

export function rotuloMotivo(motivo: MotivoSugestao): string {
  return {
    perto: 'Perto de você',
    chance: 'Histórico favorável',
    concorrencia: 'Menos disputada',
    anoAnterior: 'Você já tentou aqui',
  }[motivo]
}

export function resumoTurmas(unidade: Unidade, grupamento: string, horario: string): string | null {
  const indice = meta.grupamentos.findIndex(item => item.nome === grupamento)
  const linha = unidade.turmas?.[indice]
  if (!linha) return null
  const [alunos, turmas] = horario === 'Integral' ? [linha[0], linha[1]] : [linha[2], linha[3]]
  if (!alunos && !turmas) return null
  return `${turmas} turma${turmas === 1 ? '' : 's'} · ${alunos} criança${alunos === 1 ? '' : 's'} matriculada${alunos === 1 ? '' : 's'}`
}
