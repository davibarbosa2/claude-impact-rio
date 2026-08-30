<script setup lang="ts">
import { parseDate, type DateValue } from '@internationalized/date'
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { dataLonga, mascaraCpf } from '#shared/domain/format'
import { grupamentoDe, idadeEmTexto } from '#shared/domain/grouping'
import { MAX_CRIANCAS, hoje, validarCriancas } from '#shared/domain/registration'
import type { Crianca, Horario, Inscricao } from '#shared/types/registration'

const toast = useToast()
const route = useRoute()
const {
  draft,
  touch,
  addChild,
  removeChild,
  setChildSchedule,
  setWantsCriteria,
} = useRegistrationDraft()

const sexItems = [
  { label: 'Feminino', value: 'F' },
  { label: 'Masculino', value: 'M' },
]
const scheduleItems = [
  { label: 'Integral', value: 'Integral', description: 'A criança permanece o dia todo.' },
  { label: 'Parcial', value: 'Parcial', description: 'Atendimento em um turno.' },
]
const maxDate = parseDate(hoje())

function asDateValue(value: string): DateValue | undefined {
  if (!value) return undefined
  try {
    return parseDate(value)
  }
  catch {
    return undefined
  }
}

function updateBirthDate(child: Crianca, value: DateValue | null | undefined) {
  child.nascimento = value?.toString() ?? ''
  touch()
}

function groupFeedback(child: Crianca) {
  const result = grupamentoDe(child.nascimento)
  if (result.situacao !== 'ok') return null
  return {
    group: result.grupamento,
    age: idadeEmTexto(child.nascimento),
    date: dataLonga(child.nascimento),
  }
}

function updateCpf(child: Crianca, value: string) {
  child.cpf = mascaraCpf(value)
  touch()
}

function updateSchedule(child: Crianca, value: string | number) {
  const hadOptions = child.opcoes.length > 0
  const changed = setChildSchedule(child.id, value as Horario)
  if (changed && hadOptions) {
    toast.add({
      title: 'Escolhas de unidade removidas',
      description: 'O turno mudou; escolha novamente entre as unidades compatíveis.',
      color: 'warning',
      icon: 'i-lucide-triangle-alert',
    })
  }
}

function validate(_state: Inscricao): FormError[] {
  const errors = validarCriancas(draft.value)
  return draft.value.criancas.flatMap((child, index) => {
    const childErrors = errors[child.id] ?? {}
    return Object.entries(childErrors).map(([field, message]) => ({
      name: `criancas.${index}.${field === 'documento' ? 'cpf' : field}`,
      message,
    }))
  })
}

async function submit(_event: FormSubmitEvent<Inscricao>) {
  touch()
  const returnTo = typeof route.query.returnTo === 'string' ? route.query.returnTo : ''
  await navigateTo(returnTo.startsWith('/') ? returnTo : '/inscricao/endereco')
}
</script>

<template>
  <div class="journey-container">
    <JourneyProgress current="criancas" />

    <header class="mt-8">
      <p class="text-sm font-semibold text-primary">Uma inscrição por criança</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
        Quem você quer inscrever?
      </h1>
      <p class="mt-3 leading-relaxed text-muted">
        Você pode cadastrar até cinco irmãos nesta sessão. Cada criança terá sua própria lista de unidades.
      </p>
    </header>

    <UForm :state="draft" :validate="validate" class="mt-8 space-y-6" @submit="submit">
      <UCard v-for="(child, index) in draft.criancas" :key="child.id" variant="subtle">
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-primary">Criança {{ index + 1 }}</p>
              <h2 class="mt-1 font-semibold text-highlighted">
                {{ child.nome || 'Dados da criança' }}
              </h2>
            </div>
            <UButton
              v-if="draft.criancas.length > 1"
              label="Remover"
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="sm"
              @click="removeChild(child.id)"
            />
          </div>
        </template>

        <div class="space-y-5">
          <UFormField :name="`criancas.${index}.nome`" label="Nome completo" required>
            <UInput
              v-model="child.nome"
              class="w-full"
              autocomplete="off"
              placeholder="Como está na certidão"
              @change="touch"
            />
          </UFormField>

          <UFormField
            :name="`criancas.${index}.nascimento`"
            label="Data de nascimento"
            description="Digite dia, mês e ano."
            required
          >
            <UInputDate
              class="w-full"
              locale="pt-BR"
              icon="i-lucide-calendar-days"
              :range="false"
              :model-value="asDateValue(child.nascimento)"
              :max-value="maxDate"
              @update:model-value="updateBirthDate(child, $event)"
            />
          </UFormField>

          <UAlert
            v-if="groupFeedback(child)"
            color="success"
            variant="soft"
            icon="i-lucide-circle-check"
            :title="`${groupFeedback(child)?.group} no processo atual`"
            :description="`${groupFeedback(child)?.date} · ${groupFeedback(child)?.age} na data de corte`"
          />

          <UFormField :name="`criancas.${index}.sexo`" label="Sexo no documento" required>
            <URadioGroup v-model="child.sexo" orientation="horizontal" :items="sexItems" @change="touch" />
          </UFormField>

          <div>
            <p class="text-sm font-medium text-highlighted">Documento da criança</p>
            <p class="mt-1 text-sm text-muted">Informe CPF ou DNV. Não é necessário preencher os dois.</p>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <UFormField :name="`criancas.${index}.cpf`" label="CPF">
                <UInput
                  class="w-full"
                  inputmode="numeric"
                  autocomplete="off"
                  placeholder="000.000.000-00"
                  :model-value="child.cpf"
                  @update:model-value="updateCpf(child, String($event))"
                />
              </UFormField>
              <UFormField :name="`criancas.${index}.dnv`" label="Declaração de Nascido Vivo (DNV)">
                <UInput
                  v-model="child.dnv"
                  class="w-full"
                  inputmode="numeric"
                  maxlength="11"
                  placeholder="11 dígitos"
                  @change="touch"
                />
              </UFormField>
            </div>
          </div>

          <UFormField :name="`criancas.${index}.horario`" label="Turno desejado" required>
            <URadioGroup
              :model-value="child.horario"
              :items="scheduleItems"
              @update:model-value="updateSchedule(child, $event)"
            />
          </UFormField>

          <UFormField :name="`criancas.${index}.observacoes`" label="Observações" description="Opcional">
            <UTextarea
              v-model="child.observacoes"
              class="w-full"
              :rows="3"
              placeholder="Algo importante para o atendimento"
              @change="touch"
            />
          </UFormField>
        </div>
      </UCard>

      <UButton
        v-if="draft.criancas.length < MAX_CRIANCAS"
        label="Adicionar outra criança"
        icon="i-lucide-user-round-plus"
        color="neutral"
        variant="outline"
        block
        @click="addChild"
      />

      <UCard variant="subtle">
        <UCheckbox
          :model-value="draft.querComprovar"
          label="Quero informar critérios socioeconômicos"
          description="É opcional, mas critérios comprovados podem alterar a pontuação de cada criança."
          @update:model-value="setWantsCriteria(Boolean($event))"
        />
      </UCard>

      <div class="journey-actions flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <UButton to="/" label="Voltar" icon="i-lucide-arrow-left" color="neutral" variant="ghost" />
        <UButton type="submit" label="Continuar para endereço" trailing-icon="i-lucide-arrow-right" />
      </div>
    </UForm>
  </div>
</template>
