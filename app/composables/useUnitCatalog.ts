import { buscarUnidades, unidadesElegiveis } from '#shared/domain/unit-catalog'
import type { RespostaCatalogo } from '#shared/types/registration'

export function useUnitCatalog() {
  const catalogRequest = useFetch<RespostaCatalogo>('/api/units', {
    key: 'catalogo-unidades-2025',
  })

  const units = computed(() => catalogRequest.data.value?.data ?? [])
  const meta = computed(() => catalogRequest.data.value?.meta)
  const byCode = computed(() => new Map(units.value.map(unit => [unit.codigo, unit])))

  return {
    meta,
    units,
    status: catalogRequest.status,
    error: catalogRequest.error,
    find: (code: string) => byCode.value.get(code),
    search: (query: string) => buscarUnidades(units.value, query),
    eligible: (group: string, schedule: string) => unidadesElegiveis(units.value, group, schedule),
  }
}
