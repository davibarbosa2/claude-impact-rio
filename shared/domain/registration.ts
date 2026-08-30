import { meta } from './data'
import { cepValido, cpfValido, digitos, emailValido, telefoneValido } from './format'
import { dataIsoValida, grupamentoDe } from './grouping'
import type { Canal, Crianca, Horario, Inscricao } from '../types/registration'

export const MAX_CRIANCAS = 5

export const CANAIS: Array<{ id: Canal, nome: string, detalhe: string }> = [
  { id: 'email', nome: 'E-mail', detalhe: 'Comprovante completo e próximos passos' },
  { id: 'whatsapp', nome: 'WhatsApp', detalhe: 'Mensagem no celular cadastrado' },
  { id: 'sms', nome: 'SMS', detalhe: 'Funciona mesmo sem internet' },
  { id: 'push', nome: 'Notificação no app', detalhe: 'Disponível para quem usa o aplicativo' },
]

export function criarCrianca(id = 'crianca-1'): Crianca {
  return {
    id,
    nome: '',
    nascimento: '',
    sexo: '',
    cpf: '',
    dnv: '',
    horario: 'Integral',
    historico: [],
    opcoes: [],
    observacoes: '',
  }
}

export function alterarHorarioDaCrianca(crianca: Crianca, horario: Horario): boolean {
  if (crianca.horario === horario) return false
  crianca.horario = horario
  crianca.opcoes = []
  return true
}

export function criarInscricao(): Inscricao {
  return {
    version: 2,
    status: 'rascunho',
    responsavel: {
      nome: '',
      cpf: '',
      nascimento: '',
      parentesco: 'Mãe',
      email: '',
      telefone: '',
      nis: '',
    },
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: 'Rio de Janeiro',
      uf: 'RJ',
    },
    criancas: [criarCrianca()],
    termoAceitoEm: null,
    querComprovar: false,
    avisoSemCriteriosVisto: false,
    criteriosFamilia: {},
    criteriosCrianca: {},
    canais: ['email', 'whatsapp'],
    protocolo: null,
    enviadoEm: null,
    atualizadoEm: null,
  }
}

export type Erros = Record<string, string>

export function validarResponsavel(inscricao: Inscricao): Erros {
  const erros: Erros = {}
  const responsavel = inscricao.responsavel

  if (responsavel.nome.trim().split(/\s+/).length < 2) {
    erros.nome = 'Informe o nome completo, como está no documento.'
  }
  if (!cpfValido(responsavel.cpf)) erros.cpf = 'CPF inválido — confira os números.'
  if (!responsavel.nascimento) erros.nascimento = 'Informe a data de nascimento.'
  else if (!dataIsoValida(responsavel.nascimento)) erros.nascimento = 'Confira a data de nascimento.'
  else if (responsavel.nascimento > hoje()) erros.nascimento = 'A data não pode estar no futuro.'
  if (!emailValido(responsavel.email)) erros.email = 'Informe um e-mail válido, como nome@email.com.'
  if (!telefoneValido(responsavel.telefone)) erros.telefone = 'Informe DDD e número.'
  if (responsavel.nis && digitos(responsavel.nis).length !== 11) erros.nis = 'O NIS tem 11 dígitos.'

  return erros
}

export function validarEndereco(inscricao: Inscricao): Erros {
  const erros: Erros = {}
  const endereco = inscricao.endereco

  if (!cepValido(endereco.cep)) erros.cep = 'O CEP tem 8 dígitos.'
  if (!endereco.logradouro.trim()) erros.logradouro = 'Informe a rua ou avenida.'
  if (!endereco.numero.trim()) erros.numero = 'Informe o número, ou “S/N” se não houver.'
  if (!endereco.bairro.trim()) erros.bairro = 'Informe o bairro.'

  return erros
}

export function validarCrianca(crianca: Crianca): Erros {
  const erros: Erros = {}

  if (crianca.nome.trim().split(/\s+/).length < 2) {
    erros.nome = 'Informe o nome completo da criança.'
  }
  if (!crianca.nascimento) erros.nascimento = 'Informe a data de nascimento.'
  else if (!dataIsoValida(crianca.nascimento)) erros.nascimento = 'Confira a data de nascimento.'
  else if (crianca.nascimento > hoje()) erros.nascimento = 'A data não pode estar no futuro.'
  else {
    const faixa = grupamentoDe(crianca.nascimento)
    if (faixa.situacao === 'muito-nova') {
      erros.nascimento = `A criança entra no processo de ${faixa.primeiraInscricao}.`
    }
    if (faixa.situacao === 'muito-velha') {
      erros.nascimento = 'Pela data de nascimento, a inscrição deve ser na pré-escola.'
    }
    if (faixa.situacao === 'indefinido') erros.nascimento = 'Confira a data de nascimento.'
  }
  if (!crianca.sexo) erros.sexo = 'Selecione uma opção.'
  if (!crianca.cpf && !crianca.dnv) {
    erros.documento = 'Informe o CPF ou a Declaração de Nascido Vivo.'
  }
  if (crianca.cpf && !cpfValido(crianca.cpf)) erros.cpf = 'CPF inválido — confira os números.'
  if (crianca.dnv && digitos(crianca.dnv).length !== 11) erros.dnv = 'A DNV tem 11 dígitos.'

  return erros
}

export function validarCriancas(inscricao: Inscricao): Record<string, Erros> {
  const porCrianca: Record<string, Erros> = {}
  const cpfs = inscricao.criancas.map(crianca => digitos(crianca.cpf)).filter(Boolean)

  inscricao.criancas.forEach((crianca) => {
    const erros = validarCrianca(crianca)
    const cpf = digitos(crianca.cpf)
    if (cpf && cpfs.filter(item => item === cpf).length > 1) {
      erros.cpf = 'Este CPF já foi usado em outra criança.'
    }
    if (Object.keys(erros).length) porCrianca[crianca.id] = erros
  })

  return porCrianca
}

export function validarOpcoes(inscricao: Inscricao): Record<string, string> {
  const erros: Record<string, string> = {}

  inscricao.criancas.forEach((crianca) => {
    if (crianca.opcoes.length === 0) {
      erros[crianca.id] = 'Escolha pelo menos uma unidade.'
    }
    else if (crianca.opcoes.length > maxOpcoes) {
      erros[crianca.id] = `Escolha no máximo ${maxOpcoes} unidades.`
    }
    else if (new Set(crianca.opcoes).size !== crianca.opcoes.length) {
      erros[crianca.id] = 'Escolha unidades diferentes em cada posição.'
    }
  })

  return erros
}

export function validarCanais(inscricao: Inscricao): Erros {
  return inscricao.canais.length
    ? {}
    : { canais: 'Escolha ao menos um canal para receber as comunicações.' }
}

export function podeRevisar(inscricao: Inscricao): boolean {
  return Boolean(
    inscricao.termoAceitoEm
    && Object.keys(validarCriancas(inscricao)).length === 0
    && Object.keys(validarEndereco(inscricao)).length === 0
    && Object.keys(validarResponsavel(inscricao)).length === 0
    && Object.keys(validarOpcoes(inscricao)).length === 0
    && inscricao.canais.length,
  )
}

export function hoje(): string {
  return new Date().toISOString().slice(0, 10)
}

export function gerarProtocolo(): string {
  const alfabeto = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  const bytes = globalThis.crypto?.getRandomValues(new Uint8Array(8)) ?? new Uint8Array(8)
  const sufixo = Array.from(bytes, numero => alfabeto[numero % alfabeto.length]).join('')
  return `IC-${meta.anoProcesso}-${sufixo}`
}

export const maxOpcoes = meta.maxOpcoes
