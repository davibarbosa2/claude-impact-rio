<script setup lang="ts">
import { percentual } from '#shared/domain/format'
import { resumoTurmas } from '#shared/domain/unit-catalog'
import type { Unidade } from '#shared/types/registration'

defineProps<{
  unit: Unidade
  selected: boolean
  suggested?: boolean
  disabled?: boolean
  distanceKm?: number | null
  reason?: string
  group: string
  schedule: string
}>()

defineEmits<{
  add: [unitId: string]
}>()
</script>

<template>
  <UCard variant="outline">
    <div class="min-w-0">
      <div class="mb-2 flex flex-wrap gap-2">
        <UBadge v-if="suggested" color="info" variant="soft" size="sm">
          Sugestão
        </UBadge>
        <UBadge v-if="selected" color="success" variant="soft" size="sm">
          Escolhida
        </UBadge>
        <UBadge color="neutral" variant="soft" size="sm">
          {{ unit.bairro }}
        </UBadge>
      </div>
      <h3 class="font-semibold leading-snug text-highlighted">
        {{ unit.nome }}
      </h3>
      <p class="mt-1 text-sm text-muted">
        {{ unit.endereco }}
      </p>
    </div>

    <div class="mt-4 flex flex-wrap gap-2 text-xs text-toned">
      <UBadge v-if="distanceKm !== null && distanceKm !== undefined" color="neutral" variant="subtle" icon="i-lucide-map-pin">
        {{ distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1).replace('.', ',')} km` }}
      </UBadge>
      <UBadge color="neutral" variant="subtle" icon="i-lucide-chart-no-axes-combined">
        {{ percentual(unit.taxaAtendimento) }} confirmadas em 2025
      </UBadge>
    </div>

    <p v-if="resumoTurmas(unit, group, schedule)" class="mt-3 text-xs text-muted">
      {{ resumoTurmas(unit, group, schedule) }}
    </p>
    <p v-if="suggested && reason" class="mt-3 text-xs leading-relaxed text-muted">
      {{ reason }}
    </p>

    <template #footer>
      <UButton
        :label="selected ? 'Já está na sua lista' : 'Adicionar à minha lista'"
        :icon="selected ? 'i-lucide-check' : 'i-lucide-plus'"
        color="neutral"
        variant="outline"
        block
        :disabled="selected || disabled"
        @click="$emit('add', unit.codigo)"
      />
    </template>
  </UCard>
</template>
