import { describe, expect, it } from 'vitest'
import {
  addUnitOption,
  MAX_UNIT_OPTIONS,
  moveUnitOption,
  removeUnitOption,
} from '../shared/domain/unit-selection'

describe('seleção de unidades', () => {
  it('só adiciona uma unidade depois de uma ação explícita', () => {
    const before: string[] = []
    const result = addUnitOption(before, '01004')

    expect(before).toEqual([])
    expect(result).toEqual({ ok: true, value: ['01004'] })
  })

  it('bloqueia a sexta opção e preserva as cinco anteriores', () => {
    const selected = Array.from({ length: MAX_UNIT_OPTIONS }, (_, index) => String(index))
    const result = addUnitOption(selected, 'sexta')

    expect(result).toEqual({ ok: false, reason: 'limit-reached', value: selected })
  })

  it('não duplica uma unidade já escolhida', () => {
    const result = addUnitOption(['01004'], '01004')

    expect(result).toEqual({
      ok: false,
      reason: 'already-selected',
      value: ['01004'],
    })
  })

  it('libera espaço quando uma opção é removida', () => {
    const result = removeUnitOption(['01004', '01005'], '01004')

    expect(result).toEqual({ ok: true, value: ['01005'] })
  })

  it('muda a ordem declarada sem alterar os identificadores', () => {
    const result = moveUnitOption(['01004', '01005', '01006'], '01006', 'up')

    expect(result).toEqual({ ok: true, value: ['01004', '01006', '01005'] })
  })
})
