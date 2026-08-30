import * as z from 'zod'
import {
  gerarProtocolo,
  validarCanais,
  validarCriancas,
  validarEndereco,
  validarOpcoes,
  validarResponsavel,
} from '#shared/domain/registration'
import type { Inscricao, RespostaInscricaoSimulada } from '#shared/types/registration'

const submissionSchema = z.object({
  version: z.literal(2),
  status: z.enum(['rascunho', 'enviada']),
  termoAceitoEm: z.string().min(1),
  responsavel: z.object({
    nome: z.string().trim().min(3),
    cpf: z.string().min(11),
    nascimento: z.string().min(1),
    parentesco: z.string().min(1),
    email: z.string().min(3),
    telefone: z.string().min(10),
    nis: z.string(),
  }),
  endereco: z.object({
    cep: z.string().min(8),
    logradouro: z.string().trim().min(2),
    numero: z.string().trim().min(1),
    complemento: z.string(),
    bairro: z.string().trim().min(2),
    cidade: z.string(),
    uf: z.string(),
  }),
  criancas: z.array(z.object({
    id: z.string().min(1),
    nome: z.string().trim().min(3),
    nascimento: z.string().min(1),
    sexo: z.enum(['F', 'M']),
    cpf: z.string(),
    dnv: z.string(),
    horario: z.enum(['Integral', 'Parcial']),
    historico: z.array(z.string()),
    opcoes: z.array(z.string().min(1)).min(1).max(5),
    observacoes: z.string(),
  })).min(1).max(5),
  querComprovar: z.boolean(),
  avisoSemCriteriosVisto: z.boolean(),
  criteriosFamilia: z.record(z.string(), z.boolean()),
  criteriosCrianca: z.record(z.string(), z.array(z.string())),
  canais: z.array(z.enum(['email', 'whatsapp', 'sms', 'push'])).min(1),
  protocolo: z.string().nullable(),
  enviadoEm: z.string().nullable(),
  atualizadoEm: z.string().nullable(),
}).passthrough()

export default defineEventHandler(async (event): Promise<RespostaInscricaoSimulada> => {
  const body = await readBody(event)
  const parsed = submissionSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'A inscrição possui dados incompletos.',
      data: parsed.error.flatten(),
    })
  }

  const inscricao: Inscricao = parsed.data
  const invalid = Object.keys(validarCriancas(inscricao)).length
    || Object.keys(validarResponsavel(inscricao)).length
    || Object.keys(validarEndereco(inscricao)).length
    || Object.keys(validarOpcoes(inscricao)).length
    || Object.keys(validarCanais(inscricao)).length

  if (invalid) {
    throw createError({
      statusCode: 422,
      statusMessage: 'A inscrição possui dados inválidos.',
    })
  }

  return {
    data: {
      protocolo: gerarProtocolo(),
      status: 'Lista de espera',
      proximaAcao: 'Acompanhar as próximas atualizações.',
      sintetico: true,
    },
  }
})
