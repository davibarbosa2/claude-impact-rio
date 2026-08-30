import { digitos } from '#shared/domain/format'
import type { RespostaCep } from '#shared/types/registration'

interface ViaCepResponse {
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
  ibge?: string
  erro?: boolean | 'true'
}

export default defineEventHandler(async (event): Promise<RespostaCep> => {
  const cep = digitos(getRouterParam(event, 'cep') ?? '')
  if (cep.length !== 8) {
    throw createError({ statusCode: 400, statusMessage: 'Informe um CEP com 8 dígitos.' })
  }

  let response: ViaCepResponse
  try {
    response = await $fetch<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`, {
      timeout: 5000,
    })
  }
  catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'O serviço de CEP está indisponível. Preencha o endereço manualmente.',
    })
  }

  if (response.erro || !response.cep) {
    throw createError({ statusCode: 404, statusMessage: 'CEP não encontrado.' })
  }

  const cidade = response.localidade?.trim() ?? ''
  const uf = response.uf?.trim() ?? ''

  setHeader(event, 'Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')

  return {
    data: {
      cep: response.cep,
      logradouro: response.logradouro?.trim() ?? '',
      complemento: response.complemento?.trim() ?? '',
      bairro: response.bairro?.trim() ?? '',
      cidade,
      uf,
      codigoIbge: response.ibge?.trim() ?? '',
      dentroDoRio: cidade === 'Rio de Janeiro' && uf === 'RJ',
    },
    meta: { fonte: 'ViaCEP' },
  }
})
