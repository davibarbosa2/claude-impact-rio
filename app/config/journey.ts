export const journeySteps = [
  {
    id: 'criancas',
    label: 'Crianças',
    route: '/inscricao/criancas',
    icon: 'i-lucide-baby',
  },
  {
    id: 'endereco',
    label: 'Endereço',
    route: '/inscricao/endereco',
    icon: 'i-lucide-map-pin-house',
  },
  {
    id: 'responsavel',
    label: 'Responsável',
    route: '/inscricao/responsavel',
    icon: 'i-lucide-user-round',
  },
  {
    id: 'criterios',
    label: 'Critérios',
    route: '/inscricao/criterios',
    icon: 'i-lucide-clipboard-check',
  },
  {
    id: 'unidades',
    label: 'Unidades',
    route: '/inscricao/unidades',
    icon: 'i-lucide-school',
  },
  {
    id: 'revisao',
    label: 'Revisão',
    route: '/inscricao/revisao',
    icon: 'i-lucide-list-checks',
  },
] as const

export type JourneyStepId = typeof journeySteps[number]['id']
