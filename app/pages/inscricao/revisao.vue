<script setup lang="ts">
import { dataCurta } from '#shared/domain/format'
import { grupamentoDe } from '#shared/domain/grouping'
import { CANAIS, podeRevisar } from '#shared/domain/registration'
import { documentosNecessarios, pontuacaoDaCrianca } from '#shared/domain/scoring'
import type { Canal, Unidade } from '#shared/types/registration'

const { draft, touch, submitSimulation } = useRegistrationDraft()
const catalog = useUnitCatalog()
const acknowledged = ref(false)
const submitting = ref(false)
const submissionError = ref(false)

const channelItems = CANAIS.map(channel => ({
  label: channel.nome,
  value: channel.id,
  description: channel.detalhe,
}))
const selectedChannels = computed<Canal[]>({
  get: () => draft.value.canais,
  set: (value) => {
    draft.value.canais = value
    touch()
  },
})
const documents = computed(() => documentosNecessarios(draft.value))
const ready = computed(() => podeRevisar(draft.value))

function unitsFor(codes: string[]): Unidade[] {
  return codes.map(code => catalog.find(code)).filter((unit): unit is Unidade => Boolean(unit))
}

function groupFor(date: string) {
  const result = grupamentoDe(date)
  return result.situacao === 'ok' ? result.grupamento : 'Não identificado'
}

async function submit() {
  if (!ready.value || !acknowledged.value || submitting.value) return
  submissionError.value = false
  submitting.value = true

  try {
    await submitSimulation()
    await navigateTo('/protocolo')
  }
  catch {
    submissionError.value = true
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="journey-container">
    <JourneyProgress current="revisao" />

    <header class="mt-8">
      <p class="text-sm font-semibold text-primary">Antes do envio</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
        Confira tudo com calma.
      </h1>
      <p class="mt-3 leading-relaxed text-muted">
        Você pode editar qualquer bloco sem perder as outras respostas ou a ordem das unidades.
      </p>
    </header>

    <UAlert
      v-if="!ready"
      class="mt-6"
      color="warning"
      variant="soft"
      icon="i-lucide-triangle-alert"
      title="Ainda faltam dados obrigatórios"
      description="Confira os blocos abaixo. Cada criança precisa de ao menos uma unidade e a comunicação precisa de um canal."
    />

    <UCard class="mt-8" variant="subtle">
      <template #header>
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-primary">Responsável</p>
            <h2 class="mt-1 text-xl font-semibold text-highlighted">{{ draft.responsavel.nome || 'Não informado' }}</h2>
          </div>
          <UButton to="/inscricao/responsavel?returnTo=/inscricao/revisao" label="Editar" icon="i-lucide-pencil" color="neutral" variant="ghost" size="sm" />
        </div>
      </template>

      <dl class="grid gap-4 text-sm sm:grid-cols-2">
        <div><dt class="text-muted">CPF</dt><dd class="mt-1 font-medium text-toned">{{ draft.responsavel.cpf || 'Não informado' }}</dd></div>
        <div><dt class="text-muted">Nascimento</dt><dd class="mt-1 font-medium text-toned">{{ dataCurta(draft.responsavel.nascimento) || 'Não informado' }}</dd></div>
        <div><dt class="text-muted">E-mail</dt><dd class="mt-1 font-medium text-toned">{{ draft.responsavel.email || 'Não informado' }}</dd></div>
        <div><dt class="text-muted">Celular</dt><dd class="mt-1 font-medium text-toned">{{ draft.responsavel.telefone || 'Não informado' }}</dd></div>
      </dl>
    </UCard>

    <UCard class="mt-5" variant="subtle">
      <template #header>
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-primary">Endereço</p>
            <h2 class="mt-1 text-xl font-semibold text-highlighted">{{ draft.endereco.bairro || 'Não informado' }}</h2>
          </div>
          <UButton to="/inscricao/endereco?returnTo=/inscricao/revisao" label="Editar" icon="i-lucide-pencil" color="neutral" variant="ghost" size="sm" />
        </div>
      </template>
      <p class="text-sm leading-relaxed text-toned">
        {{ draft.endereco.logradouro }}, {{ draft.endereco.numero }}<template v-if="draft.endereco.complemento"> · {{ draft.endereco.complemento }}</template><br>
        {{ draft.endereco.cep }} · {{ draft.endereco.cidade }}/{{ draft.endereco.uf }}
      </p>
    </UCard>

    <section class="mt-5 space-y-4" aria-labelledby="children-review-title">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-primary">Candidaturas independentes</p>
          <h2 id="children-review-title" class="mt-1 text-xl font-semibold text-highlighted">Crianças e preferências</h2>
        </div>
        <UButton to="/inscricao/criancas?returnTo=/inscricao/revisao" label="Editar dados" color="neutral" variant="ghost" size="sm" />
      </div>

      <UCard v-for="(child, childIndex) in draft.criancas" :key="child.id" variant="outline">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="font-semibold text-highlighted">{{ child.nome || `Criança ${childIndex + 1}` }}</h3>
            <p class="mt-1 text-sm text-muted">
              {{ groupFor(child.nascimento) }} · {{ child.horario }} · {{ dataCurta(child.nascimento) }}
            </p>
          </div>
          <UBadge color="primary" variant="soft">
            {{ pontuacaoDaCrianca(draft, child).pontos }} pontos
          </UBadge>
        </div>

        <USeparator class="my-4" />

        <div class="flex items-center justify-between gap-3">
          <p class="text-sm font-medium text-highlighted">Ordem de preferência</p>
          <UButton to="/inscricao/unidades?returnTo=/inscricao/revisao" label="Editar" color="neutral" variant="link" size="sm" />
        </div>
        <ol v-if="unitsFor(child.opcoes).length" class="mt-3 space-y-3">
          <li v-for="(unit, index) in unitsFor(child.opcoes)" :key="unit.codigo" class="flex gap-3">
            <span class="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-inverted">{{ index + 1 }}</span>
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-toned">{{ unit.nome }}</p>
              <p class="truncate text-xs text-muted">{{ unit.bairro }}</p>
            </div>
          </li>
        </ol>
        <UEmpty v-else icon="i-lucide-list-x" title="Sem unidades" description="Escolha ao menos uma unidade para esta criança." />
      </UCard>
    </section>

    <UCard class="mt-5" variant="subtle">
      <template #header>
        <div>
          <p class="text-sm font-semibold text-primary">Comunicação</p>
          <h2 class="mt-1 text-xl font-semibold text-highlighted">Como você quer receber atualizações?</h2>
        </div>
      </template>
      <UFormField :error="selectedChannels.length ? undefined : 'Escolha ao menos um canal.'">
        <UCheckboxGroup v-model="selectedChannels" :items="channelItems" />
      </UFormField>
    </UCard>

    <UCard v-if="documents.length" class="mt-5" variant="subtle">
      <template #header>
        <div>
          <p class="text-sm font-semibold text-primary">Comprovação</p>
          <h2 class="mt-1 text-xl font-semibold text-highlighted">Documentos previstos</h2>
        </div>
      </template>
      <UAccordion
        :items="documents.map(item => ({
          label: item.criterio.pergunta,
          icon: 'i-lucide-file-check-2',
          content: item.documentos.join(' · '),
        }))"
      />
    </UCard>

    <UAlert
      v-else
      class="mt-5"
      color="info"
      variant="soft"
      icon="i-lucide-info"
      title="Inscrição sem critérios socioeconômicos"
      description="As crianças seguem com 0 ponto socioeconômico. Isso não impede o envio desta simulação."
    />

    <UCheckbox
      v-model="acknowledged"
      class="mt-6"
      label="Revisei os dados e entendo que este envio é somente uma simulação."
    />

    <UAlert
      v-if="submissionError"
      class="mt-4"
      color="error"
      variant="soft"
      title="Não foi possível concluir a simulação"
      description="Confira os dados e tente novamente."
    />

    <div class="journey-actions mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <UButton to="/inscricao/unidades" label="Voltar" icon="i-lucide-arrow-left" color="neutral" variant="ghost" />
      <UButton
        label="Enviar simulação"
        trailing-icon="i-lucide-send"
        :loading="submitting"
        :disabled="!ready || !acknowledged"
        @click="submit"
      />
    </div>
  </div>
</template>
