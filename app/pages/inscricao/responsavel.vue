<script setup lang="ts">
import { parseDate, type DateValue } from '@internationalized/date'
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { digitos, mascaraCpf, mascaraTelefone } from '#shared/domain/format'
import { hoje, validarResponsavel } from '#shared/domain/registration'
import type { Inscricao } from '#shared/types/registration'

const { draft, touch, setWantsCriteria } = useRegistrationDraft()
const route = useRoute()
const showNoCriteriaWarning = ref(false)
const maxDate = parseDate(hoje())
const relationships = [
  { label: 'Mãe', value: 'Mãe' },
  { label: 'Pai', value: 'Pai' },
  { label: 'Avó ou avô', value: 'Avó ou avô' },
  { label: 'Responsável legal', value: 'Responsável legal' },
  { label: 'Outro parentesco', value: 'Outro parentesco' },
]

function responsibleDate(): DateValue | undefined {
  if (!draft.value.responsavel.nascimento) return undefined
  try {
    return parseDate(draft.value.responsavel.nascimento)
  }
  catch {
    return undefined
  }
}

function updateResponsibleDate(value: DateValue | undefined) {
  draft.value.responsavel.nascimento = value?.toString() ?? ''
  touch()
}

function updateCpf(value: string) {
  draft.value.responsavel.cpf = mascaraCpf(value)
  touch()
}

function updatePhone(value: string) {
  draft.value.responsavel.telefone = mascaraTelefone(value)
  touch()
}

function updateNis(value: string) {
  draft.value.responsavel.nis = digitos(value).slice(0, 11)
  touch()
}

function validate(_state: Inscricao): FormError[] {
  return Object.entries(validarResponsavel(draft.value)).map(([name, message]) => ({
    name: `responsavel.${name}`,
    message,
  }))
}

async function continueWithoutCriteria() {
  draft.value.avisoSemCriteriosVisto = true
  touch()
  showNoCriteriaWarning.value = false
  await navigateTo('/inscricao/unidades')
}

async function reviewCriteria() {
  setWantsCriteria(true)
  showNoCriteriaWarning.value = false
  await navigateTo('/inscricao/regras')
}

async function submit(_event: FormSubmitEvent<Inscricao>) {
  touch()
  const returnTo = typeof route.query.returnTo === 'string' ? route.query.returnTo : ''
  if (returnTo.startsWith('/')) {
    await navigateTo(returnTo)
    return
  }
  if (draft.value.querComprovar) {
    await navigateTo('/inscricao/regras')
    return
  }
  if (!draft.value.avisoSemCriteriosVisto) {
    showNoCriteriaWarning.value = true
    return
  }
  await navigateTo('/inscricao/unidades')
}
</script>

<template>
  <div class="journey-container">
    <JourneyProgress current="responsavel" />

    <header class="mt-8">
      <p class="text-sm font-semibold text-primary">Contato da inscrição</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
        Agora, os dados do responsável.
      </h1>
      <p class="mt-3 leading-relaxed text-muted">
        Estes dados identificam a pessoa responsável e serão usados nas comunicações da candidatura.
      </p>
    </header>

    <UAlert
      class="mt-6"
      color="neutral"
      variant="soft"
      icon="i-lucide-log-in"
      title="Acesso já realizado nesta simulação"
      description="A demo assume uma conta autenticada anteriormente. Esta etapa coleta dados da inscrição, não cria login."
    />

    <UForm :state="draft" :validate="validate" class="mt-8 space-y-6" @submit="submit">
      <UCard variant="subtle">
        <div class="space-y-5">
          <UFormField name="responsavel.nome" label="Nome completo" required>
            <UInput
              v-model="draft.responsavel.nome"
              class="w-full"
              autocomplete="name"
              placeholder="Como está no documento"
              @change="touch"
            />
          </UFormField>

          <UFormField name="responsavel.cpf" label="CPF" required>
            <UInput
              class="w-full"
              inputmode="numeric"
              autocomplete="off"
              placeholder="000.000.000-00"
              :model-value="draft.responsavel.cpf"
              @update:model-value="updateCpf(String($event))"
            />
          </UFormField>

          <UFormField name="responsavel.nascimento" label="Data de nascimento" required>
            <UInputDate
              class="w-full"
              locale="pt-BR"
              icon="i-lucide-calendar-days"
              :model-value="responsibleDate()"
              :max-value="maxDate"
              @update:model-value="updateResponsibleDate($event)"
            />
          </UFormField>

          <UFormField name="responsavel.parentesco" label="Relação com a criança" required>
            <USelect
              v-model="draft.responsavel.parentesco"
              class="w-full"
              :items="relationships"
              @change="touch"
            />
          </UFormField>

          <UFormField name="responsavel.nis" label="NIS" description="Opcional · 11 dígitos">
            <UInput
              class="w-full"
              inputmode="numeric"
              placeholder="Número de Identificação Social"
              :model-value="draft.responsavel.nis"
              @update:model-value="updateNis(String($event))"
            />
          </UFormField>

          <USeparator />

          <UFormField name="responsavel.email" label="E-mail" required>
            <UInput
              v-model="draft.responsavel.email"
              class="w-full"
              type="email"
              inputmode="email"
              autocomplete="email"
              icon="i-lucide-mail"
              placeholder="nome@email.com"
              @change="touch"
            />
          </UFormField>

          <UFormField name="responsavel.telefone" label="Celular com DDD" required>
            <UInput
              class="w-full"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              icon="i-lucide-smartphone"
              placeholder="(21) 99999-9999"
              :model-value="draft.responsavel.telefone"
              @update:model-value="updatePhone(String($event))"
            />
          </UFormField>
        </div>
      </UCard>

      <div class="journey-actions flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <UButton to="/inscricao/endereco" label="Voltar" icon="i-lucide-arrow-left" color="neutral" variant="ghost" />
        <UButton type="submit" label="Continuar" trailing-icon="i-lucide-arrow-right" />
      </div>
    </UForm>

    <UModal
      v-model:open="showNoCriteriaWarning"
      title="Continuar sem critérios socioeconômicos?"
      description="A inscrição continua válida, mas cada criança começa com 0 ponto socioeconômico."
    >
      <template #body>
        <div class="space-y-4">
          <UAlert
            color="warning"
            variant="soft"
            icon="i-lucide-scale"
            title="Os critérios podem mudar a classificação"
            description="Só contam os critérios que forem comprovados no prazo. Você pode voltar e informar os que se aplicam à família."
          />
          <p class="text-sm leading-relaxed text-muted">
            Esta mensagem informa a consequência, mas não bloqueia a decisão do responsável.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <UButton label="Continuar sem critérios" color="neutral" variant="ghost" @click="continueWithoutCriteria" />
          <UButton label="Ver critérios" icon="i-lucide-list-checks" @click="reviewCriteria" />
        </div>
      </template>
    </UModal>
  </div>
</template>
