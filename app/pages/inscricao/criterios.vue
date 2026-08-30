<script setup lang="ts">
import { criterios } from '#shared/domain/data'
import {
  criteriosCrianca,
  criteriosFamilia,
  documentosNecessarios,
  pontuacaoDaCrianca,
  temCriterioMarcado,
} from '#shared/domain/scoring'

const { draft, touch, toggleChildCriterion } = useRegistrationDraft()
const route = useRoute()
const activeChildId = ref(draft.value.criancas[0]?.id ?? '')

const childTabs = computed(() => draft.value.criancas.map((child, index) => ({
  value: child.id,
  label: child.nome.split(' ')[0] || `Criança ${index + 1}`,
  icon: 'i-lucide-baby',
})))

const familyItems = criteriosFamilia.map(criterion => ({
  label: criterion.pergunta,
  value: String(criterion.id),
  description: criterion.desempate
    ? 'Critério de desempate'
    : `${criterion.pontos} ponto${criterion.pontos === 1 ? '' : 's'}`,
}))

const childItems = criteriosCrianca.map(criterion => ({
  label: criterion.pergunta,
  value: String(criterion.id),
  description: criterion.desempate
    ? 'Critério de desempate'
    : `${criterion.pontos} ponto${criterion.pontos === 1 ? '' : 's'}`,
}))

const selectedFamilyIds = computed<string[]>({
  get: () => criteriosFamilia
    .filter(criterion => draft.value.criteriosFamilia[criterion.id])
    .map(criterion => String(criterion.id)),
  set: (ids) => {
    const selected = new Set(ids)
    criteriosFamilia.forEach((criterion) => {
      draft.value.criteriosFamilia[criterion.id] = selected.has(String(criterion.id))
    })
    touch()
  },
})

const selectedChildIds = computed<string[]>({
  get: () => criteriosCrianca
    .filter(criterion => (draft.value.criteriosCrianca[criterion.id] ?? []).includes(activeChildId.value))
    .map(criterion => String(criterion.id)),
  set: (ids) => {
    const selected = new Set(ids)
    criteriosCrianca.forEach((criterion) => {
      toggleChildCriterion(criterion.id, activeChildId.value, selected.has(String(criterion.id)))
    })
  },
})

const marked = computed(() => temCriterioMarcado(draft.value))
const documentItems = computed(() => documentosNecessarios(draft.value).map(({ criterio, documentos }) => ({
  label: criterio.pergunta,
  icon: 'i-lucide-file-check-2',
  content: documentos.join(' · '),
})))
const nextRoute = computed(() => {
  const returnTo = typeof route.query.returnTo === 'string' ? route.query.returnTo : ''
  return returnTo.startsWith('/') ? returnTo : '/inscricao/unidades'
})

function score(childId: string) {
  const child = draft.value.criancas.find(item => item.id === childId)
  return child ? pontuacaoDaCrianca(draft.value, child) : { pontos: 0, maximo: 0, desempates: [] }
}
</script>

<template>
  <div class="journey-container">
    <JourneyProgress current="criterios" />

    <header class="mt-8">
      <p class="text-sm font-semibold text-primary">Pontuação socioeconômica</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
        Marque apenas o que puder comprovar.
      </h1>
      <p class="mt-3 leading-relaxed text-muted">
        Primeiro responda sobre a família; depois confira as perguntas específicas de cada criança.
      </p>
    </header>

    <section class="mt-8" aria-labelledby="family-criteria-title">
      <h2 id="family-criteria-title" class="text-xl font-semibold text-highlighted">Sobre a família</h2>
      <p class="mt-1 text-sm text-muted">Estas respostas valem para todas as crianças desta sessão.</p>
      <UCard class="mt-4" variant="subtle">
        <UCheckboxGroup v-model="selectedFamilyIds" :items="familyItems" />
      </UCard>
    </section>

    <section class="mt-8" aria-labelledby="child-criteria-title">
      <h2 id="child-criteria-title" class="text-xl font-semibold text-highlighted">Sobre cada criança</h2>
      <p class="mt-1 text-sm text-muted">Troque a aba para responder individualmente.</p>

      <UTabs
        v-model="activeChildId"
        class="mt-4 w-full"
        :items="childTabs"
        value-key="value"
        :content="false"
      />

      <UCard class="mt-4" variant="subtle">
        <UCheckboxGroup v-model="selectedChildIds" :items="childItems" />
      </UCard>
    </section>

    <section class="mt-8" aria-labelledby="score-title">
      <h2 id="score-title" class="text-xl font-semibold text-highlighted">Pontuação estimada</h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <UCard v-for="(child, index) in draft.criancas" :key="child.id" variant="outline">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="font-medium text-highlighted">{{ child.nome || `Criança ${index + 1}` }}</p>
              <p class="mt-1 text-xs text-muted">
                {{ score(child.id).desempates.length }} critério(s) de desempate
              </p>
            </div>
            <UBadge color="primary" variant="soft" size="lg">
              {{ score(child.id).pontos }} pontos
            </UBadge>
          </div>
        </UCard>
      </div>
    </section>

    <UAlert
      v-if="!marked"
      class="mt-6"
      color="info"
      variant="soft"
      icon="i-lucide-info"
      title="Nenhum critério marcado"
      description="Isso não é um erro: você pode continuar com 0 ponto socioeconômico e revisar antes do envio."
    />

    <section v-if="documentItems.length" class="mt-8" aria-labelledby="documents-title">
      <h2 id="documents-title" class="text-xl font-semibold text-highlighted">Documentos que serão solicitados</h2>
      <UAccordion class="mt-3" :items="documentItems" />
    </section>

    <div class="journey-actions mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <UButton to="/inscricao/regras" label="Voltar às regras" icon="i-lucide-arrow-left" color="neutral" variant="ghost" />
      <UButton :to="nextRoute" label="Escolher unidades" trailing-icon="i-lucide-arrow-right" />
    </div>
  </div>
</template>
