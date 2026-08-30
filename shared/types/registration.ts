export type Sexo = 'F' | 'M'
export type Horario = 'Integral' | 'Parcial'
export type Canal = 'email' | 'whatsapp' | 'sms' | 'push'
export type EscopoCriterio = 'familia' | 'crianca'
export type EstadoInscricao = 'rascunho' | 'enviada'

export interface Criterio {
  id: number
  ordem: number
  pergunta: string
  pontos: number
  desempate: boolean
  escopo: EscopoCriterio
  documentos: string[]
}

export interface Unidade {
  codigo: string
  nome: string
  tipo: string
  bairro: string
  endereco: string
  cep: string
  lat: number | null
  lon: number | null
  grupamentos: string[]
  horarios: string[]
  inscricoes: number
  primeiraOpcao: number
  taxaAtendimento: number
  vagas: number
  candidatosPorVaga: number | null
  primeiroAno: number
  turmas: number[][] | null
}

export interface FaixaGrupamento {
  nome: string
  nascidoDe: string
  nascidoAte: string
  inscricoesAnoRef: number
  offsetAnos: number
}

export interface MetaCatalogo {
  anoReferencia: number
  anoProcesso: number
  totalUnidades: number
  unidadesComCoordenada: number
  unidadesComTurmas: number
  primeiroAnoNaoIndicaUnidadeNova: boolean
  totalInscricoesAnoRef: number
  fracaoIntegral: number
  linhasQueryA: number
  pontuacaoMaxima: number
  maxOpcoes: number
  prazoDocumentosDias: number
  situacoes: Record<string, number>
  respostas: {
    total: number
    fracaoSim: number
    fracaoSimConfirmada: number
  }
  grupamentos: FaixaGrupamento[]
  bairros: string[]
}

export interface Crianca {
  id: string
  nome: string
  nascimento: string
  sexo: Sexo | ''
  cpf: string
  dnv: string
  horario: Horario
  historico: string[]
  opcoes: string[]
  observacoes: string
}

export interface Responsavel {
  nome: string
  cpf: string
  nascimento: string
  parentesco: string
  email: string
  telefone: string
  nis: string
}

export interface Endereco {
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
}

export interface Inscricao {
  version: 2
  status: EstadoInscricao
  responsavel: Responsavel
  endereco: Endereco
  criancas: Crianca[]
  termoAceitoEm: string | null
  querComprovar: boolean
  avisoSemCriteriosVisto: boolean
  criteriosFamilia: Record<number, boolean>
  criteriosCrianca: Record<number, string[]>
  canais: Canal[]
  protocolo: string | null
  enviadoEm: string | null
  atualizadoEm: string | null
}

export interface FonteCatalogo {
  repositorio: string
  derivadoDe: string[]
  anoReferencia: number
  aviso: string
}

export interface RespostaCatalogo {
  data: Unidade[]
  meta: MetaCatalogo & {
    retornadas: number
    fonte: FonteCatalogo
    disponibilidadeAtual: false
  }
}

export interface RespostaCep {
  data: {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    codigoIbge: string
    dentroDoRio: boolean
  }
  meta: {
    fonte: 'ViaCEP'
  }
}

export interface RespostaInscricaoSimulada {
  data: {
    protocolo: string
    status: 'Lista de espera'
    proximaAcao: string
    sintetico: true
  }
}
