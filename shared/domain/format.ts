export function mascaraCpf(valor: string): string {
  const numeros = valor.replace(/\D/g, '').slice(0, 11)
  return numeros
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
}

export function mascaraCep(valor: string): string {
  const numeros = valor.replace(/\D/g, '').slice(0, 8)
  return numeros.replace(/^(\d{5})(\d)/, '$1-$2')
}

export function mascaraTelefone(valor: string): string {
  const numeros = valor.replace(/\D/g, '').slice(0, 11)
  if (numeros.length <= 10) {
    return numeros.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
  }
  return numeros.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
}

export const digitos = (valor: string) => valor.replace(/\D/g, '')

export function cpfValido(valor: string): boolean {
  const numeros = digitos(valor)
  if (numeros.length !== 11 || /^(\d)\1{10}$/.test(numeros)) return false

  for (const [tamanho, posicao] of [[9, 10], [10, 11]] as const) {
    let soma = 0
    for (let indice = 0; indice < tamanho; indice += 1) {
      soma += Number(numeros[indice]) * (posicao - indice)
    }
    const resto = (soma * 10) % 11 % 10
    if (resto !== Number(numeros[tamanho])) return false
  }

  return true
}

export function emailValido(valor: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim())
}

export function telefoneValido(valor: string): boolean {
  const numeros = digitos(valor)
  return numeros.length === 10 || numeros.length === 11
}

export function cepValido(valor: string): boolean {
  return digitos(valor).length === 8
}

const NOMES_MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

export function dataLonga(iso: string): string {
  const [ano, mes, dia] = iso.split('-').map(Number)
  if (!ano || !mes || !dia) return iso
  return `${dia} de ${NOMES_MESES[mes - 1]} de ${ano}`
}

export function dataCurta(iso: string): string {
  const [ano, mes, dia] = iso.split('-')
  return dia ? `${dia}/${mes}/${ano}` : iso
}

export function percentual(fracao: number, casas = 0): string {
  return `${(fracao * 100).toFixed(casas).replace('.', ',')}%`
}

export function primeiroNome(nomeCompleto: string): string {
  return nomeCompleto.trim().split(/\s+/)[0] ?? ''
}
