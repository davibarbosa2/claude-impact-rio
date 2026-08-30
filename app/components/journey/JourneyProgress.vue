<script setup lang="ts">
import { journeySteps, type JourneyStepId } from '~/config/journey'

const props = defineProps<{
  current: JourneyStepId
}>()

const currentIndex = computed(() => (
  journeySteps.findIndex(step => step.id === props.current)
))

const currentStep = computed(() => journeySteps[currentIndex.value])
const stepperItems = journeySteps.map(step => ({
  value: step.id,
  title: step.label,
  icon: step.icon,
}))
</script>

<template>
  <section aria-labelledby="journey-progress-title" class="space-y-4">
    <div class="flex items-center justify-between gap-4 text-sm">
      <p id="journey-progress-title" class="font-semibold text-highlighted">
        Etapa {{ currentIndex + 1 }} de {{ journeySteps.length }}
      </p>
      <p class="text-muted">
        {{ currentStep?.label }}
      </p>
    </div>
    <UStepper
      :items="stepperItems"
      :model-value="current"
      value-key="value"
      size="sm"
      disabled
      :ui="{ wrapper: 'hidden sm:block' }"
    />
  </section>
</template>
