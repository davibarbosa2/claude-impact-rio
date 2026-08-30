export const MAX_UNIT_OPTIONS = 5

export type UnitSelectionError =
  | 'already-selected'
  | 'limit-reached'
  | 'not-selected'
  | 'already-at-edge'

export type UnitSelectionResult =
  | { ok: true, value: string[] }
  | { ok: false, reason: UnitSelectionError, value: string[] }

export function addUnitOption(current: readonly string[], unitId: string): UnitSelectionResult {
  if (current.includes(unitId)) {
    return { ok: false, reason: 'already-selected', value: [...current] }
  }

  if (current.length >= MAX_UNIT_OPTIONS) {
    return { ok: false, reason: 'limit-reached', value: [...current] }
  }

  return { ok: true, value: [...current, unitId] }
}

export function removeUnitOption(current: readonly string[], unitId: string): UnitSelectionResult {
  if (!current.includes(unitId)) {
    return { ok: false, reason: 'not-selected', value: [...current] }
  }

  return { ok: true, value: current.filter(id => id !== unitId) }
}

export function moveUnitOption(
  current: readonly string[],
  unitId: string,
  direction: 'up' | 'down',
): UnitSelectionResult {
  const currentIndex = current.indexOf(unitId)

  if (currentIndex === -1) {
    return { ok: false, reason: 'not-selected', value: [...current] }
  }

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

  if (targetIndex < 0 || targetIndex >= current.length) {
    return { ok: false, reason: 'already-at-edge', value: [...current] }
  }

  const reordered = [...current]
  const targetUnitId = reordered[targetIndex]

  if (!targetUnitId) {
    return { ok: false, reason: 'already-at-edge', value: [...current] }
  }

  reordered[targetIndex] = unitId
  reordered[currentIndex] = targetUnitId

  return { ok: true, value: reordered }
}
