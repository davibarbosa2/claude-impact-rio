import { describe, expect, it } from 'vitest'
import { cpfValido } from '../shared/domain/format'
import { faixas } from '../shared/domain/grouping'
import {
  alterarHorarioDaCrianca,
  criarCrianca,
  criarInscricao,
  validarCrianca,
  validarCriancas,
  validarEndereco,
  validarOpcoes,
  validarResponsavel,
} from '../shared/domain/registration'
import type { Crianca } from '../shared/types/registration'

function criancaValida(id: string, cpf = '529.982.247-25'): Crianca {
  return {
    ...criarCrianca(id),
    nome: `Criança ${id}`,
    nascimento: `${faixas[0]!.de}-15`,
    sexo: 'F',
    cpf,
  }
}

describe('validação da inscrição', () => {
  it('valida os dígitos do CPF e rejeita sequências repetidas', () => {
    expect(cpfValido('529.982.247-25')).toBe(true)
    expect(cpfValido('529.982.247-24')).toBe(false)
    expect(cpfValido('111.111.111-11')).toBe(false)
  })

  it('aceita DNV como alternativa ao CPF e valida seus 11 dígitos', () => {
    const child = criancaValida('um', '')
    child.dnv = '12345678901'

    expect(validarCrianca(child)).toEqual({})

    child.dnv = '1234567890'
    expect(validarCrianca(child)).toMatchObject({ dnv: 'A DNV tem 11 dígitos.' })
  })

  it('impede o mesmo CPF em crianças diferentes', () => {
    const registration = criarInscricao()
    registration.criancas = [criancaValida('um'), criancaValida('dois')]

    expect(validarCriancas(registration)).toEqual({
      um: { cpf: 'Este CPF já foi usado em outra criança.' },
      dois: { cpf: 'Este CPF já foi usado em outra criança.' },
    })
  })

  it('valida CPF, data, contato e NIS do responsável', () => {
    const registration = criarInscricao()
    registration.responsavel = {
      nome: 'Maria da Silva',
      cpf: '529.982.247-25',
      nascimento: '1990-05-10',
      parentesco: 'Mãe',
      email: 'maria@example.com',
      telefone: '(21) 99999-9999',
      nis: '12345678901',
    }

    expect(validarResponsavel(registration)).toEqual({})

    registration.responsavel = {
      ...registration.responsavel,
      nascimento: '1990-02-30',
      email: 'maria@',
      telefone: '123',
      nis: '123',
    }
    expect(validarResponsavel(registration)).toMatchObject({
      nascimento: 'Confira a data de nascimento.',
      email: expect.any(String),
      telefone: expect.any(String),
      nis: expect.any(String),
    })
  })

  it('valida CEP e os campos mínimos do endereço', () => {
    const registration = criarInscricao()
    registration.endereco = {
      cep: '20040-020',
      logradouro: 'Rua da Assembleia',
      numero: '10',
      complemento: '',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      uf: 'RJ',
    }

    expect(validarEndereco(registration)).toEqual({})

    registration.endereco.cep = '2004'
    expect(validarEndereco(registration)).toMatchObject({ cep: 'O CEP tem 8 dígitos.' })
  })

  it('limpa opções somente quando o turno realmente muda', () => {
    const child = criancaValida('um')
    child.opcoes = ['001', '002']

    expect(alterarHorarioDaCrianca(child, 'Integral')).toBe(false)
    expect(child.opcoes).toEqual(['001', '002'])
    expect(alterarHorarioDaCrianca(child, 'Parcial')).toBe(true)
    expect(child.horario).toBe('Parcial')
    expect(child.opcoes).toEqual([])
  })

  it('exige de uma a cinco opções distintas por criança', () => {
    const registration = criarInscricao()
    const child = criancaValida('um')
    registration.criancas = [child]

    expect(validarOpcoes(registration)).toEqual({ um: 'Escolha pelo menos uma unidade.' })

    child.opcoes = ['001', '001']
    expect(validarOpcoes(registration)).toEqual({ um: 'Escolha unidades diferentes em cada posição.' })

    child.opcoes = ['001', '002', '003', '004', '005', '006']
    expect(validarOpcoes(registration)).toEqual({ um: 'Escolha no máximo 5 unidades.' })

    child.opcoes = ['001', '002']
    expect(validarOpcoes(registration)).toEqual({})
  })
})
