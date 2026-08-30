<script setup lang="ts">
import { meta } from '#shared/domain/data'

const { draft, resumeRoute, aceitarTermo } = useRegistrationDraft()
const acceptedItems = ref<string[]>([])

const requirements = [
  {
    value: 'dados',
    label: 'Vou conferir os dados antes de enviar',
    description: 'Informações incorretas podem impedir a análise da inscrição.',
  },
  {
    value: 'historico',
    label: 'Entendo que os indicadores são históricos',
    description: 'Eles ajudam a comparar, mas não representam vagas abertas agora.',
  },
  {
    value: 'documentos',
    label: 'Se eu marcar critérios, precisarei comprová-los',
    description: `A regra de referência considera prazo de ${meta.prazoDocumentosDias} dias corridos.`,
  },
]

const canStart = computed(() => acceptedItems.value.length === requirements.length)
const hasStarted = computed(() => Boolean(
  draft.value.termoAceitoEm
  || draft.value.criancas.some(child => child.nome || child.nascimento)
  || draft.value.endereco.cep,
))

const primaryAction = computed(() => {
  if (draft.value.status === 'enviada') {
    return {
      label: 'Acompanhar candidatura',
      to: '/acompanhar',
      icon: 'i-lucide-arrow-right',
    }
  }

  return {
    label: hasStarted.value ? 'Continuar de onde parei' : 'Começar inscrição',
    to: hasStarted.value ? resumeRoute.value : undefined,
    icon: 'i-lucide-arrow-right',
  }
})

async function start() {
  if (!canStart.value) return
  aceitarTermo()
  await navigateTo('/inscricao/criancas')
}

const benefits = [
  {
    icon: 'i-lucide-list-checks',
    title: 'Um passo por vez',
    description: 'Perguntas curtas, ajuda no contexto e revisão antes do envio.',
  },
  {
    icon: 'i-lucide-map',
    title: 'Escolha com liberdade',
    description: 'Sugestões ajudam a explorar, mas você decide e ordena até cinco unidades.',
  },
  {
    icon: 'i-lucide-bell-ring',
    title: 'Próxima ação clara',
    description: 'Depois do envio, o estado e o que fazer aparecem em um só lugar.',
  },
]
</script>

<template>
  <div>
    <UContainer class="py-10 sm:py-16">
      <section class="mx-auto max-w-3xl">
        <UBadge color="info" variant="soft" size="lg">
          Experiência pensada primeiro para celular
        </UBadge>

        <h1 class="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-highlighted sm:text-6xl">
          Uma inscrição em creche mais simples de entender e acompanhar.
        </h1>
        <p class="mt-5 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          Cadastre as crianças, entenda as regras, compare unidades compatíveis e monte sua ordem de preferência com clareza.
        </p>

        <UAlert
          class="mt-7"
          color="neutral"
          variant="soft"
          icon="i-lucide-log-in"
          title="Você já entra com sua identidade confirmada"
          description="O acesso acontece pela sua conta da Prefeitura antes desta jornada. Aqui, você começa direto pela inscrição."
        />

        <div v-if="hasStarted" class="mt-8 max-w-sm">
          <UButton
            :label="primaryAction.label"
            :to="primaryAction.to"
            :trailing-icon="primaryAction.icon"
            size="xl"
            block
          />
          <p class="mt-3 text-center text-xs text-muted">
            Seu rascunho foi mantido somente neste navegador.
          </p>
        </div>

        <UCard v-else class="mt-8" variant="subtle">
          <template #header>
            <div>
              <p class="text-sm font-semibold text-primary">Antes de começar</p>
              <h2 class="mt-1 text-xl font-semibold text-highlighted">Confirme estes três pontos</h2>
            </div>
          </template>

          <UCheckboxGroup v-model="acceptedItems" :items="requirements" />

          <template #footer>
            <UButton
              label="Começar inscrição"
              trailing-icon="i-lucide-arrow-right"
              block
              :disabled="!canStart"
              @click="start"
            />
          </template>
        </UCard>
      </section>
    </UContainer>

    <section class="border-y border-muted bg-muted">
      <UContainer class="py-10 sm:py-14">
        <div class="mx-auto grid max-w-5xl gap-7 sm:grid-cols-3">
          <article v-for="benefit in benefits" :key="benefit.title" class="flex gap-4 sm:block">
            <span class="grid size-11 shrink-0 place-items-center rounded-xl bg-elevated text-primary shadow-xs">
              <UIcon :name="benefit.icon" class="size-5" />
            </span>
            <div class="sm:mt-4">
              <h2 class="font-semibold text-highlighted">
                {{ benefit.title }}
              </h2>
              <p class="mt-1 text-sm leading-relaxed text-muted">
                {{ benefit.description }}
              </p>
            </div>
          </article>
        </div>
      </UContainer>
    </section>

  </div>
</template>
