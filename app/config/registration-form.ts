export const registrationFieldCopy = {
  childName: {
    label: 'Nome completo da criança',
    placeholder: 'Como aparece no documento',
  },
  birthDate: {
    label: 'Data de nascimento',
    description: 'Usaremos esta data para orientar a etapa de elegibilidade.',
  },
  responsibleName: {
    label: 'Nome completo do responsável',
    placeholder: 'Digite seu nome completo',
  },
  phone: {
    label: 'Celular para contato',
    placeholder: '(21) 99999-9999',
    description: 'Inclua DDD. Nesta demonstração, nenhuma mensagem será enviada.',
  },
  street: {
    label: 'Logradouro',
    placeholder: 'Rua, avenida ou travessa',
  },
  number: {
    label: 'Número',
    placeholder: 'Ex.: 120',
  },
  neighborhood: {
    label: 'Bairro',
    placeholder: 'Ex.: Santa Teresa',
  },
} as const

export const communicationChannels = [
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'SMS', value: 'sms' },
  { label: 'E-mail', value: 'email' },
]
