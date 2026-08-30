<script setup lang="ts">
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
    label: 'Entendo que os indicadores da demo são históricos',
    description: 'Eles ajudam a comparar, mas não representam vagas abertas agora.',
  },
  {
    value: 'documentos',
    label: 'Se eu marcar critérios, precisarei comprová-los',
    description: 'A referência atual do protótipo considera prazo de 3 dias.',
  },
  {
    value: 'demo',
    label: 'Entendo que esta não é uma inscrição oficial',
    description: 'Nenhum dado é enviado à Prefeitura nesta demonstração.',
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
          title="A demo começa depois do login"
          description="Assumimos que a identidade do responsável já foi validada por uma conta da Prefeitura. Autenticação não faz parte deste protótipo."
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
              <h2 class="mt-1 text-xl font-semibold text-highlighted">Confirme estes quatro pontos</h2>
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

    <UContainer class="py-10 sm:py-14">
      <div class="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
        <section class="rounded-2xl border border-muted p-5 sm:p-6">
          <UIcon name="i-lucide-circle-check-big" class="size-6 text-success" />
          <h2 class="mt-4 text-xl font-semibold text-highlighted">
            O que a demo cobre
          </h2>
          <p class="mt-2 leading-relaxed text-muted">
            Até cinco irmãos, regras socioeconômicas, endereço assistido por CEP, unidades elegíveis, mapa, sugestões opcionais e revisão.
          </p>
        </section>
        <section class="rounded-2xl border border-muted p-5 sm:p-6">
          <UIcon name="i-lucide-shield-alert" class="size-6 text-warning" />
          <h2 class="mt-4 text-xl font-semibold text-highlighted">
            O que fica fora
          </h2>
          <p class="mt-2 leading-relaxed text-muted">
            Login, comprovação real, reserva de vaga, disponibilidade atual e integração com sistemas oficiais continuam como pontos futuros de integração.
          </p>
        </section>
      </div>
    </UContainer>
  </div>
</template>
