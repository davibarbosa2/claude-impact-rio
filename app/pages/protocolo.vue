<script setup lang="ts">
import { CANAIS } from '#shared/domain/registration'
import { documentosNecessarios, prazoDocumentos } from '#shared/domain/scoring'
import type { Unidade } from '#shared/types/registration'

const { draft } = useRegistrationDraft()
const catalog = useUnitCatalog()
const documents = computed(() => documentosNecessarios(draft.value))
const deadline = computed(() => draft.value.enviadoEm
  ? prazoDocumentos(draft.value.enviadoEm).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  : '')
const channelLabels = computed(() => draft.value.canais
  .map(id => CANAIS.find(channel => channel.id === id)?.nome)
  .filter(Boolean)
  .join(', '))

function unitsFor(codes: string[]): Unidade[] {
  return codes.map(code => catalog.find(code)).filter((unit): unit is Unidade => Boolean(unit))
}
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <div class="mx-auto max-w-3xl">
      <UAlert
        v-if="draft.status !== 'enviada'"
        color="warning"
        variant="soft"
        icon="i-lucide-file-pen-line"
        title="A simulação ainda não foi enviada"
        description="Conclua a revisão para gerar o protocolo demonstrativo."
        :actions="[{ label: 'Continuar inscrição', to: '/inscricao/revisao' }]"
      />

      <template v-else>
        <header class="text-center">
          <span class="mx-auto grid size-14 place-items-center rounded-full bg-success/10 text-success">
            <UIcon name="i-lucide-circle-check-big" class="size-7" />
          </span>
          <UBadge class="mt-5" color="success" variant="soft" size="lg">Simulação enviada</UBadge>
          <h1 class="mt-4 text-3xl font-bold tracking-tight text-highlighted sm:text-5xl">
            Guarde este protocolo.
          </h1>
          <p class="mt-3 text-muted">Um único envio reuniu {{ draft.criancas.length }} candidatura(s) independente(s).</p>
        </header>

        <UCard class="mt-8" variant="subtle">
          <div class="text-center">
            <p class="text-sm text-muted">Protocolo demonstrativo</p>
            <p class="mt-2 font-mono text-xl font-bold tracking-wide text-highlighted sm:text-2xl">{{ draft.protocolo }}</p>
            <p class="mt-2 text-xs text-muted">Enviado por {{ channelLabels }}</p>
          </div>
        </UCard>

        <UAlert
          v-if="documents.length"
          class="mt-5"
          color="warning"
          variant="soft"
          icon="i-lucide-file-clock"
          title="Há documentos para comprovar"
          :description="`Na regra demonstrada, apresente-os até ${deadline}.`"
        />

        <section class="mt-8" aria-labelledby="applications-title">
          <h2 id="applications-title" class="text-xl font-semibold text-highlighted">Resumo das candidaturas</h2>
          <div class="mt-4 space-y-4">
            <UCard v-for="(child, childIndex) in draft.criancas" :key="child.id" variant="outline">
              <div class="flex items-center justify-between gap-3">
                <h3 class="font-semibold text-highlighted">{{ child.nome || `Criança ${childIndex + 1}` }}</h3>
                <UBadge color="info" variant="soft">Lista de espera</UBadge>
              </div>
              <ol class="mt-4 space-y-2">
                <li v-for="(unit, index) in unitsFor(child.opcoes)" :key="unit.codigo" class="flex items-center gap-3 text-sm">
                  <span class="grid size-7 shrink-0 place-items-center rounded-full bg-muted font-semibold text-toned">{{ index + 1 }}</span>
                  <span class="min-w-0 truncate text-toned">{{ unit.nome }}</span>
                </li>
              </ol>
            </UCard>
          </div>
        </section>

        <UAccordion
          v-if="documents.length"
          class="mt-6"
          :items="documents.map(item => ({
            label: item.criterio.pergunta,
            icon: 'i-lucide-file-check-2',
            content: item.documentos.join(' · '),
          }))"
        />

        <UAlert
          class="mt-6"
          color="warning"
          variant="soft"
          icon="i-lucide-flask-conical"
          title="Este protocolo é sintético"
          description="Nenhuma candidatura foi criada nos sistemas da Prefeitura."
        />

        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <UButton to="/acompanhar" label="Acompanhar candidaturas" trailing-icon="i-lucide-arrow-right" />
          <UButton to="/" label="Voltar ao início" color="neutral" variant="ghost" />
        </div>
      </template>
    </div>
  </UContainer>
</template>
