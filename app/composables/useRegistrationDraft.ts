import { alterarHorarioDaCrianca, criarCrianca, criarInscricao } from '#shared/domain/registration'
import {
  addUnitOption,
  moveUnitOption,
  removeUnitOption,
  type UnitSelectionResult,
} from '#shared/domain/unit-selection'
import type { Canal, Horario, Inscricao } from '#shared/types/registration'
import type { RespostaInscricaoSimulada } from '#shared/types/registration'

const STORAGE_KEY = 'fralda-carioca.inscricao.v2'
const LEGACY_STORAGE_KEY = 'vaga-carioca.inscricao.v2'

export function useRegistrationDraft() {
  const draft = useState<Inscricao>('inscricao-creche-v2', criarInscricao)
  const hydrated = useState('inscricao-creche-v2-hydrated', () => false)
  const resumeRoute = useState('inscricao-creche-v2-route', () => '/inscricao/criancas')
  const route = useRoute()

  if (import.meta.client && !hydrated.value) {
    onMounted(() => {
      try {
        const currentRaw = localStorage.getItem(STORAGE_KEY)
        const raw = currentRaw ?? localStorage.getItem(LEGACY_STORAGE_KEY)
        const saved = raw ? JSON.parse(raw) as { inscricao?: Inscricao, route?: string } : null
        if (saved?.inscricao?.version === 2 && saved.inscricao.criancas?.length) {
          const empty = criarInscricao()
          draft.value = {
            ...empty,
            ...saved.inscricao,
            responsavel: { ...empty.responsavel, ...saved.inscricao.responsavel },
            endereco: { ...empty.endereco, ...saved.inscricao.endereco },
          }
          if (saved.route?.startsWith('/inscricao/')) resumeRoute.value = saved.route
          if (!currentRaw && raw) localStorage.setItem(STORAGE_KEY, raw)
        }
      }
      catch {
        // Um rascunho corrompido não deve impedir uma nova inscrição.
      }
      hydrated.value = true
    })

    watch(
      draft,
      (value) => {
        if (!hydrated.value || value.status === 'enviada') return
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            inscricao: value,
            route: route.path,
          }))
        }
        catch {
          // Modo privado ou armazenamento cheio: o fluxo continua sem rascunho.
        }
      },
      { deep: true },
    )
  }

  function touch() {
    draft.value.atualizadoEm = new Date().toISOString()
  }

  function aceitarTermo() {
    draft.value.termoAceitoEm = new Date().toISOString()
    touch()
  }

  function addChild() {
    if (draft.value.criancas.length >= 5) return false
    const id = globalThis.crypto?.randomUUID?.() ?? `crianca-${Date.now()}`
    draft.value.criancas.push(criarCrianca(id))
    touch()
    return true
  }

  function removeChild(childId: string) {
    if (draft.value.criancas.length === 1) return false
    draft.value.criancas = draft.value.criancas.filter(child => child.id !== childId)
    Object.keys(draft.value.criteriosCrianca).forEach((criterionId) => {
      const id = Number(criterionId)
      draft.value.criteriosCrianca[id] = (draft.value.criteriosCrianca[id] ?? [])
        .filter(id => id !== childId)
    })
    touch()
    return true
  }

  function setChildSchedule(childId: string, horario: Horario) {
    const child = draft.value.criancas.find(item => item.id === childId)
    if (!child || !alterarHorarioDaCrianca(child, horario)) return false
    touch()
    return true
  }

  function setWantsCriteria(value: boolean) {
    draft.value.querComprovar = value
    if (!value) {
      draft.value.criteriosFamilia = {}
      draft.value.criteriosCrianca = {}
    }
    touch()
  }

  function toggleChildCriterion(criterionId: number, childId: string, checked: boolean) {
    const current = new Set(draft.value.criteriosCrianca[criterionId] ?? [])
    if (checked) current.add(childId)
    else current.delete(childId)
    draft.value.criteriosCrianca[criterionId] = [...current]
    touch()
  }

  function toggleChannel(channel: Canal, checked: boolean) {
    const current = new Set(draft.value.canais)
    if (checked) current.add(channel)
    else current.delete(channel)
    draft.value.canais = [...current]
    touch()
  }

  function applySelectionResult(childId: string, result: UnitSelectionResult): UnitSelectionResult {
    if (result.ok) {
      const child = draft.value.criancas.find(item => item.id === childId)
      if (child) child.opcoes = result.value
      touch()
    }

    return result
  }

  function addUnit(childId: string, unitId: string): UnitSelectionResult {
    const selected = draft.value.criancas.find(item => item.id === childId)?.opcoes ?? []
    return applySelectionResult(childId, addUnitOption(selected, unitId))
  }

  function removeUnit(childId: string, unitId: string): UnitSelectionResult {
    const selected = draft.value.criancas.find(item => item.id === childId)?.opcoes ?? []
    return applySelectionResult(childId, removeUnitOption(selected, unitId))
  }

  function moveUnit(childId: string, unitId: string, direction: 'up' | 'down'): UnitSelectionResult {
    const selected = draft.value.criancas.find(item => item.id === childId)?.opcoes ?? []
    return applySelectionResult(
      childId,
      moveUnitOption(selected, unitId, direction),
    )
  }

  async function submitSimulation() {
    const response = await $fetch<RespostaInscricaoSimulada>('/api/applications', {
      method: 'POST',
      body: draft.value,
    })

    draft.value.status = 'enviada'
    draft.value.protocolo = response.data.protocolo
    draft.value.enviadoEm = new Date().toISOString()
    touch()

    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(LEGACY_STORAGE_KEY)
    }
    catch {
      // A inscrição já foi concluída; não há ação corretiva necessária.
    }

    return response.data
  }

  function resetDraft() {
    draft.value = criarInscricao()
    resumeRoute.value = '/inscricao/criancas'
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(LEGACY_STORAGE_KEY)
    }
  }

  return {
    draft,
    hydrated,
    resumeRoute,
    touch,
    aceitarTermo,
    addChild,
    removeChild,
    setChildSchedule,
    setWantsCriteria,
    toggleChildCriterion,
    toggleChannel,
    addUnit,
    removeUnit,
    moveUnit,
    submitSimulation,
    resetDraft,
  }
}
