<script setup lang="ts">
import { percentual } from '#shared/domain/format'
import { CANAIS } from '#shared/domain/registration'
import type { Unidade } from '#shared/types/registration'

const { draft } = useRegistrationDraft()
const catalog = useUnitCatalog()

const timelineItems = computed(() => [
  {
    value: 'ativo',
    date: draft.value.enviadoEm ? new Date(draft.value.enviadoEm).toLocaleDateString('pt-BR') : 'Hoje',
    title: 'Ativo',
    description: 'Dados recebidos e candidatura ativa no cenário demonstrativo.',
    icon: 'i-lucide-file-check-2',
  },
  {
    value: 'lista',
    date: 'Estado atual',
    title: 'Lista de espera',
    description: 'Aguardando uma seleção; nenhuma ação é necessária agora.',
    icon: 'i-lucide-clock-3',
  },
  {
    value: 'selecionado',
    date: 'Possível próximo estado',
    title: 'Selecionado / Selecionado da lista',
    description: 'Uma oferta exige resposta e apresentação dos documentos no prazo.',
    icon: 'i-lucide-bell-ring',
  },
  {
    value: 'confirmado',
    date: 'Depois da confirmação',
    title: 'Confirmado',
    description: 'A vaga foi aceita e validada pela unidade.',
    icon: 'i-lucide-circle-check-big',
  },
])

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
    <div class="mx-auto max-w-4xl">
      <UAlert
        v-if="draft.status !== 'enviada'"
        color="warning"
        variant="soft"
        icon="i-lucide-file-pen-line"
        title="A simulação ainda está em rascunho"
        description="Conclua os dados, escolha as unidades e revise antes de acompanhar."
        :actions="[{ label: 'Continuar inscrição', to: '/inscricao/criancas' }]"
      />

      <template v-else>
        <header>
          <UBadge color="info" variant="soft" size="lg">Lista de espera</UBadge>
          <h1 class="mt-4 text-3xl font-bold tracking-tight text-highlighted sm:text-5xl">
            Acompanhe sem precisar refazer a inscrição.
          </h1>
          <p class="mt-3 max-w-2xl leading-relaxed text-muted">
            Cada criança tem seu próprio estado e suas preferências, mas todas as atualizações ficam nesta central.
          </p>
        </header>

        <UAlert
          class="mt-6"
          color="warning"
          variant="soft"
          icon="i-lucide-flask-conical"
          title="Estados e eventos sintéticos"
          description="Os rótulos vêm das bases históricas; nenhum evento desta tela existe no sistema oficial."
        />

        <div class="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <UCard variant="subtle">
            <template #header>
              <div>
                <p class="text-sm font-semibold text-primary">Evolução da candidatura</p>
                <h2 class="mt-1 text-xl font-semibold text-highlighted">O que acontece agora</h2>
              </div>
            </template>
            <UTimeline
              :items="timelineItems"
              value-key="value"
              default-value="lista"
            />
          </UCard>

          <div class="space-y-5">
            <UCard variant="subtle">
              <p class="text-sm font-semibold text-primary">Protocolo</p>
              <p class="mt-2 font-mono font-semibold text-highlighted">{{ draft.protocolo }}</p>
              <UButton to="/protocolo" label="Ver comprovante" color="neutral" variant="link" class="mt-2 px-0" />
            </UCard>

            <UCard variant="subtle">
              <p class="text-sm font-semibold text-primary">Comunicações</p>
              <p class="mt-2 text-sm leading-relaxed text-muted">{{ channelLabels }}</p>
              <p class="mt-2 text-sm text-muted">{{ draft.responsavel.telefone }} · {{ draft.responsavel.email }}</p>
              <UButton to="/inscricao/responsavel?returnTo=/acompanhar" label="Atualizar contato" icon="i-lucide-pencil" color="neutral" variant="link" class="mt-2 px-0" />
            </UCard>
          </div>
        </div>

        <section class="mt-6" aria-labelledby="applications-status-title">
          <div>
            <p class="text-sm font-semibold text-primary">Candidaturas</p>
            <h2 id="applications-status-title" class="mt-1 text-xl font-semibold text-highlighted">Uma situação por criança</h2>
          </div>

          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <UCard v-for="(child, childIndex) in draft.criancas" :key="child.id" variant="outline">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="font-semibold text-highlighted">{{ child.nome || `Criança ${childIndex + 1}` }}</h3>
                  <p class="mt-1 text-sm text-muted">{{ child.opcoes.length }} preferência(s) ativa(s)</p>
                </div>
                <UBadge color="info" variant="soft">Lista de espera</UBadge>
              </div>

              <div v-if="unitsFor(child.opcoes)[0]" class="mt-4 rounded-xl bg-muted p-3">
                <p class="text-xs text-muted">1ª opção</p>
                <p class="mt-1 text-sm font-medium text-toned">{{ unitsFor(child.opcoes)[0]?.nome }}</p>
                <p class="mt-1 text-xs text-muted">
                  {{ percentual(unitsFor(child.opcoes)[0]?.taxaAtendimento ?? 0) }} confirmadas no histórico de 2025
                </p>
              </div>
            </UCard>
          </div>
        </section>

        <UAlert
          class="mt-6"
          color="info"
          variant="soft"
          icon="i-lucide-refresh-cw"
          title="Visão futura: as opções restantes continuam ativas"
          description="Se uma oferta não for confirmada, nossa proposta mantém a candidatura nas preferências restantes. A operação oficial atual precisa ser validada antes de uma integração real."
        />

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <UButton to="/inscricao/unidades?returnTo=/acompanhar" label="Ver preferências no mapa" icon="i-lucide-map" color="neutral" variant="outline" />
          <UButton to="/" label="Voltar ao início" color="neutral" variant="ghost" />
        </div>
      </template>
    </div>
  </UContainer>
</template>
