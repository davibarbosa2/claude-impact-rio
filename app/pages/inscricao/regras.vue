<script setup lang="ts">
import { criterios, meta } from '#shared/domain/data'

const scoredCount = criterios.filter(item => !item.desempate).length
const tieBreakCount = criterios.filter(item => item.desempate).length
</script>

<template>
  <div class="journey-container">
    <JourneyProgress current="criterios" />

    <header class="mt-8">
      <p class="text-sm font-semibold text-primary">Antes de responder</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
        Entenda como os critérios funcionam.
      </h1>
      <p class="mt-3 leading-relaxed text-muted">
        As perguntas afetam a ordem de classificação, mas só produzem efeito após a comprovação.
      </p>
    </header>

    <UAlert
      class="mt-6"
      color="warning"
      variant="soft"
      icon="i-lucide-history"
      :title="`Régua histórica do processo de ${meta.anoReferencia}`"
      :description="`A demo projeta essa régua para ${meta.anoProcesso}. No produto real, as regras precisam vir da integração oficial de cada processo.`"
    />

    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <UCard variant="subtle">
        <div class="flex items-start gap-4">
          <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <UIcon name="i-lucide-gauge" class="size-5" />
          </span>
          <div>
            <h2 class="font-semibold text-highlighted">{{ scoredCount }} critérios pontuam</h2>
            <p class="mt-1 text-sm leading-relaxed text-muted">A soma máxima observada é de {{ meta.pontuacaoMaxima }} pontos.</p>
          </div>
        </div>
      </UCard>
      <UCard variant="subtle">
        <div class="flex items-start gap-4">
          <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <UIcon name="i-lucide-scale" class="size-5" />
          </span>
          <div>
            <h2 class="font-semibold text-highlighted">{{ tieBreakCount }} critérios desempata(m)</h2>
            <p class="mt-1 text-sm leading-relaxed text-muted">Eles não somam pontos, mas podem decidir posições iguais.</p>
          </div>
        </div>
      </UCard>
    </div>

    <UAccordion
      class="mt-6"
      :items="[
        {
          label: `Comprovação em até ${meta.prazoDocumentosDias} dias`,
          icon: 'i-lucide-file-clock',
          content: 'Ao marcar um critério, a revisão mostra quais documentos serão necessários. O prazo começa depois do envio da inscrição.',
        },
        {
          label: 'Sem documento, o ponto é retirado',
          icon: 'i-lucide-file-x-2',
          content: 'A falta de comprovação retira os pontos daquele critério; não apaga automaticamente toda a candidatura.',
        },
        {
          label: 'Família e criança são escopos diferentes',
          icon: 'i-lucide-users-round',
          content: 'Perguntas familiares são respondidas uma vez. Perguntas específicas são respondidas separadamente para cada criança.',
        },
      ]"
    />

    <div class="journey-actions mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <UButton to="/inscricao/responsavel" label="Voltar" icon="i-lucide-arrow-left" color="neutral" variant="ghost" />
      <UButton to="/inscricao/criterios" label="Entendi, responder critérios" trailing-icon="i-lucide-arrow-right" />
    </div>
  </div>
</template>
