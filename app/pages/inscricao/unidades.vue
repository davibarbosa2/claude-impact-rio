<script setup lang="ts">
import { distanceInKm } from '#shared/domain/geography'
import { grupamentoDe } from '#shared/domain/grouping'
import { maxOpcoes } from '#shared/domain/registration'
import {
  buscarUnidades,
  comporUnidadesDoMapa,
  origemDoBairro,
  sugestoesDeUnidades,
  unidadesElegiveis,
  unidadesVisiveisNoMapa,
} from '#shared/domain/unit-catalog'
import type { Horario, Unidade } from '#shared/types/registration'

const toast = useToast()
const route = useRoute()
const { draft, addUnit, removeUnit, moveUnit, setChildSchedule } = useRegistrationDraft()
const catalog = useUnitCatalog()
const activeChildId = ref(draft.value.criancas[0]?.id ?? '')
const query = ref('')

watch(
  () => draft.value.criancas.map(child => child.id),
  (childIds) => {
    if (!childIds.includes(activeChildId.value)) activeChildId.value = childIds[0] ?? ''
  },
  { immediate: true },
)

const childTabs = computed(() => draft.value.criancas.map((child, index) => ({
  value: child.id,
  label: child.nome.split(' ')[0] || `Criança ${index + 1}`,
  icon: 'i-lucide-baby',
  badge: `${child.opcoes.length}/${maxOpcoes}`,
})))
const activeChild = computed(() => draft.value.criancas.find(child => child.id === activeChildId.value))
const groupResult = computed(() => grupamentoDe(activeChild.value?.nascimento ?? ''))
const group = computed(() => groupResult.value.situacao === 'ok' ? groupResult.value.grupamento : '')
const eligibleUnits = computed(() => activeChild.value && group.value
  ? unidadesElegiveis(catalog.units.value, group.value, activeChild.value.horario)
  : [])
const selectedUnits = computed(() => activeChild.value?.opcoes
  .map(code => catalog.find(code))
  .filter((unit): unit is Unidade => Boolean(unit)) ?? [])
const origin = computed(() => origemDoBairro(draft.value.endereco.bairro))
const mapWindow = computed(() => unidadesVisiveisNoMapa(eligibleUnits.value, origin.value))
const mapUnits = computed(() => comporUnidadesDoMapa(mapWindow.value.unidades, selectedUnits.value))
const suggestionGroups = computed(() => activeChild.value && group.value
  ? sugestoesDeUnidades(
      catalog.units.value,
      activeChild.value,
      group.value,
      draft.value.endereco.bairro,
      3,
    )
  : [])
const matchingUnits = computed(() => buscarUnidades(eligibleUnits.value, query.value))
const visibleUnits = computed(() => matchingUnits.value.slice(0, 24))
const atLimit = computed(() => (activeChild.value?.opcoes.length ?? 0) >= maxOpcoes)
const allChildrenReady = computed(() => draft.value.criancas.every(child => child.opcoes.length > 0))
const backRoute = computed(() => draft.value.querComprovar ? '/inscricao/criterios' : '/inscricao/responsavel')
const nextRoute = computed(() => {
  const returnTo = typeof route.query.returnTo === 'string' ? route.query.returnTo : ''
  return returnTo.startsWith('/') ? returnTo : '/inscricao/revisao'
})

function distanceTo(unit: Unidade): number | null {
  if (!origin.value || unit.lat === null || unit.lon === null) return null
  return distanceInKm(
    { latitude: origin.value.lat, longitude: origin.value.lon },
    { latitude: unit.lat, longitude: unit.lon },
  )
}

function handleAdd(unitId: string) {
  const child = activeChild.value
  if (!child) return
  const result = addUnit(child.id, unitId)

  if (result.ok) {
    toast.add({
      title: 'Unidade adicionada',
      description: `Ela agora é a ${result.value.length}ª opção de ${child.nome.split(' ')[0] || 'esta criança'}.`,
      color: 'success',
      icon: 'i-lucide-check',
    })
    return
  }
  if (result.reason === 'limit-reached') {
    toast.add({
      title: 'A lista já tem cinco unidades',
      description: 'Remova uma opção antes de adicionar outra.',
      color: 'warning',
      icon: 'i-lucide-list-x',
    })
  }
}

function handleSchedule(value: string | number) {
  const child = activeChild.value
  if (!child) return
  const hadOptions = child.opcoes.length > 0
  const changed = setChildSchedule(child.id, value as Horario)
  query.value = ''
  if (changed && hadOptions) {
    toast.add({
      title: 'Lista reiniciada para o novo turno',
      description: 'Agora mostramos somente unidades compatíveis com essa escolha.',
      color: 'warning',
      icon: 'i-lucide-refresh-cw',
    })
  }
}
</script>

<template>
  <div class="journey-container journey-container--wide">
    <JourneyProgress current="unidades" />

    <header class="mt-8">
      <p class="text-sm font-semibold text-primary">Sugestões sem tirar sua liberdade</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
        Escolha até cinco unidades para cada criança.
      </h1>
      <p class="mt-3 max-w-3xl leading-relaxed text-muted">
        As sugestões ajudam a comparar. Nenhuma unidade entra na candidatura até você tocar em “Adicionar”.
      </p>
    </header>

    <UAlert
      class="mt-6"
      color="warning"
      variant="soft"
      icon="i-lucide-database"
      title="Indicadores históricos, não vagas atuais"
      description="Grupamentos, turnos e resultados vêm do processo de 2025 e não representam disponibilidade atual."
    />

    <UTabs
      v-model="activeChildId"
      class="mt-8 w-full"
      :items="childTabs"
      value-key="value"
      :content="false"
    />

    <template v-if="activeChild">
      <UCard class="mt-5" variant="subtle">
        <div class="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p class="text-sm font-semibold text-primary">{{ group || 'Grupamento não identificado' }}</p>
            <h2 class="mt-1 text-xl font-semibold text-highlighted">
              Escolhas de {{ activeChild.nome || 'esta criança' }}
            </h2>
            <p class="mt-1 text-sm text-muted">
              {{ eligibleUnits.length }} unidade(s) do histórico oferecem este grupamento e turno.
            </p>
          </div>
          <UFormField label="Turno">
            <URadioGroup
              :model-value="activeChild.horario"
              orientation="horizontal"
              :items="[
                { label: 'Integral', value: 'Integral' },
                { label: 'Parcial', value: 'Parcial' },
              ]"
              @update:model-value="handleSchedule"
            />
          </UFormField>
        </div>
      </UCard>

      <UAlert
        v-if="groupResult.situacao !== 'ok'"
        class="mt-5"
        color="error"
        variant="soft"
        icon="i-lucide-calendar-x"
        title="Confira a data de nascimento"
        description="Precisamos identificar o grupamento antes de mostrar unidades compatíveis."
        :actions="[{ label: 'Editar criança', to: '/inscricao/criancas' }]"
      />

      <template v-else>
        <section class="mt-8" aria-labelledby="selected-title">
          <div class="flex items-end justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-primary">Sua ordem de preferência</p>
              <h2 id="selected-title" class="mt-1 text-2xl font-semibold text-highlighted">Escolhidas por você</h2>
            </div>
            <UBadge :color="atLimit ? 'warning' : 'neutral'" variant="soft" size="lg">
              {{ activeChild.opcoes.length }}/{{ maxOpcoes }}
            </UBadge>
          </div>

          <div v-if="selectedUnits.length" class="mt-4 space-y-3">
            <UCard v-for="(unit, index) in selectedUnits" :key="unit.codigo" variant="outline">
              <div class="flex items-center gap-3">
                <span class="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-bold text-inverted">
                  {{ index + 1 }}
                </span>
                <div class="min-w-0 flex-1">
                  <h3 class="truncate font-semibold text-highlighted">{{ unit.nome }}</h3>
                  <p class="truncate text-sm text-muted">{{ unit.bairro }} · {{ unit.endereco }}</p>
                </div>
                <div class="flex shrink-0 items-center">
                  <UButton
                    :aria-label="`Mover ${unit.nome} para cima`"
                    icon="i-lucide-arrow-up"
                    color="neutral"
                    variant="ghost"
                    square
                    :disabled="index === 0"
                    @click="moveUnit(activeChild.id, unit.codigo, 'up')"
                  />
                  <UButton
                    :aria-label="`Mover ${unit.nome} para baixo`"
                    icon="i-lucide-arrow-down"
                    color="neutral"
                    variant="ghost"
                    square
                    :disabled="index === selectedUnits.length - 1"
                    @click="moveUnit(activeChild.id, unit.codigo, 'down')"
                  />
                  <UButton
                    :aria-label="`Remover ${unit.nome}`"
                    icon="i-lucide-trash-2"
                    color="error"
                    variant="ghost"
                    square
                    @click="removeUnit(activeChild.id, unit.codigo)"
                  />
                </div>
              </div>
            </UCard>
          </div>
          <UEmpty
            v-else
            class="mt-4"
            icon="i-lucide-list-plus"
            title="Nenhuma unidade escolhida ainda"
            description="Explore o mapa, as sugestões ou a busca completa abaixo."
          />
        </section>

        <section class="mt-10" aria-labelledby="map-title">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-primary">Exploração geográfica</p>
              <h2 id="map-title" class="mt-1 text-2xl font-semibold text-highlighted">Mapa perto de {{ draft.endereco.bairro }}</h2>
            </div>
            <UBadge color="neutral" variant="soft">
              {{ mapUnits.length }} pontos visíveis
            </UBadge>
          </div>

          <ClientOnly>
            <UnitsUnitMap
              class="mt-4"
              :units="mapUnits"
              :selected-unit-ids="activeChild.opcoes"
              :origin="origin"
              :neighborhood="draft.endereco.bairro"
              :radius-km="mapWindow.raioKm"
              :full="atLimit"
              @add="handleAdd"
            />
            <template #fallback>
              <USkeleton class="mt-4 h-88 w-full rounded-2xl" />
            </template>
          </ClientOnly>
          <p class="mt-3 text-xs leading-relaxed text-muted">
            Exibimos no máximo 45 unidades e abrimos no menor raio de 2, 5 ou 10 km com opções suficientes. O ponto verde é o centro aproximado do bairro.
          </p>
        </section>

        <section class="mt-10" aria-labelledby="suggestions-title">
          <p class="text-sm font-semibold text-primary">Atalhos opcionais</p>
          <h2 id="suggestions-title" class="mt-1 text-2xl font-semibold text-highlighted">Compare por diferentes motivos</h2>
          <p class="mt-2 text-sm leading-relaxed text-muted">
            Não existe um ranking único: proximidade, confirmação histórica e concorrência respondem a perguntas diferentes.
          </p>

          <div class="mt-5 space-y-8">
            <section v-for="suggestionGroup in suggestionGroups" :key="suggestionGroup.motivo">
              <h3 class="text-lg font-semibold text-highlighted">{{ suggestionGroup.titulo }}</h3>
              <p class="mt-1 max-w-3xl text-sm leading-relaxed text-muted">{{ suggestionGroup.explicacao }}</p>
              <div class="mt-4 grid gap-4 md:grid-cols-3">
                <UnitsUnitChoiceCard
                  v-for="suggestion in suggestionGroup.sugestoes"
                  :key="`${suggestionGroup.motivo}-${suggestion.unidade.codigo}`"
                  :unit="suggestion.unidade"
                  :selected="activeChild.opcoes.includes(suggestion.unidade.codigo)"
                  :disabled="atLimit"
                  :distance-km="suggestion.distanciaKm"
                  :reason="suggestionGroup.explicacao"
                  :group="group"
                  :schedule="activeChild.horario"
                  suggested
                  @add="handleAdd"
                />
              </div>
            </section>
          </div>
        </section>

        <section class="mt-10" aria-labelledby="catalog-title">
          <p class="text-sm font-semibold text-primary">Sem filtro por recomendação</p>
          <h2 id="catalog-title" class="mt-1 text-2xl font-semibold text-highlighted">Buscar em todas as unidades compatíveis</h2>

          <UInput
            v-model="query"
            class="mt-4 w-full"
            icon="i-lucide-search"
            placeholder="Nome, bairro ou código da unidade"
            aria-label="Buscar em todas as unidades compatíveis"
          />

          <div class="mt-3 flex items-center justify-between gap-4 text-xs text-muted">
            <span>{{ matchingUnits.length }} resultado(s)</span>
            <span v-if="matchingUnits.length > visibleUnits.length">Mostrando os primeiros 24</span>
          </div>

          <UAlert
            v-if="catalog.error.value"
            class="mt-4"
            color="error"
            variant="soft"
            title="Não foi possível carregar o catálogo"
            description="Tente novamente em instantes."
          />
          <div v-else-if="visibleUnits.length" class="mt-4 grid gap-4 md:grid-cols-2">
            <UnitsUnitChoiceCard
              v-for="unit in visibleUnits"
              :key="unit.codigo"
              :unit="unit"
              :selected="activeChild.opcoes.includes(unit.codigo)"
              :disabled="atLimit"
              :distance-km="distanceTo(unit)"
              :group="group"
              :schedule="activeChild.horario"
              @add="handleAdd"
            />
          </div>
          <UEmpty
            v-else-if="catalog.status.value !== 'pending'"
            class="mt-4"
            icon="i-lucide-search-x"
            title="Nenhuma unidade encontrada"
            description="Tente outro nome, bairro ou código."
          />
          <USkeleton v-else class="mt-4 h-48 w-full rounded-2xl" />
        </section>
      </template>
    </template>

    <div class="journey-actions mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <UButton :to="backRoute" label="Voltar" icon="i-lucide-arrow-left" color="neutral" variant="ghost" />
      <UButton
        :to="nextRoute"
        label="Revisar inscrição"
        trailing-icon="i-lucide-arrow-right"
        :disabled="!allChildrenReady"
      />
    </div>
  </div>
</template>
