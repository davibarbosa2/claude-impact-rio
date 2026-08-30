<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { meta } from '#shared/domain/data'
import { digitos, mascaraCep } from '#shared/domain/format'
import { distanceInKm } from '#shared/domain/geography'
import { grupamentoDe } from '#shared/domain/grouping'
import { validarEndereco } from '#shared/domain/registration'
import { origemDoBairro, unidadesElegiveis } from '#shared/domain/unit-catalog'
import type { Inscricao, RespostaCep } from '#shared/types/registration'

const { draft, touch } = useRegistrationDraft()
const catalog = useUnitCatalog()
const route = useRoute()
const lookupStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const lookupError = ref('')
const outsideRio = ref(false)
const lastLookup = ref('')
let lookupTimer: ReturnType<typeof setTimeout> | undefined

const nearbyCount = computed(() => {
  const child = draft.value.criancas[0]
  if (!child) return null
  const result = grupamentoDe(child.nascimento)
  const origin = origemDoBairro(draft.value.endereco.bairro)
  if (result.situacao !== 'ok' || !origin) return null

  return unidadesElegiveis(catalog.units.value, result.grupamento, child.horario)
    .filter(unit => unit.lat !== null && unit.lon !== null)
    .filter(unit => distanceInKm(
      { latitude: origin.lat, longitude: origin.lon },
      { latitude: unit.lat!, longitude: unit.lon! },
    ) <= 2)
    .length
})

function updateCep(value: string) {
  draft.value.endereco.cep = mascaraCep(value)
  lookupStatus.value = 'idle'
  lookupError.value = ''
  outsideRio.value = false
  touch()
}

async function lookupCep() {
  const cep = digitos(draft.value.endereco.cep)
  if (cep.length !== 8 || lookupStatus.value === 'loading') return
  if (cep === lastLookup.value && lookupStatus.value === 'success') return

  lookupStatus.value = 'loading'
  lookupError.value = ''
  outsideRio.value = false

  try {
    const response = await $fetch<RespostaCep>(`/api/address/${cep}`)
    const result = response.data
    draft.value.endereco.cep = result.cep
    draft.value.endereco.logradouro = result.logradouro || draft.value.endereco.logradouro
    draft.value.endereco.bairro = result.bairro || draft.value.endereco.bairro
    draft.value.endereco.cidade = result.cidade
    draft.value.endereco.uf = result.uf
    if (result.complemento && !draft.value.endereco.complemento) {
      draft.value.endereco.complemento = result.complemento
    }
    outsideRio.value = !result.dentroDoRio
    lastLookup.value = cep
    lookupStatus.value = 'success'
    touch()
  }
  catch (error) {
    const message = (error as { data?: { statusMessage?: string }, statusMessage?: string }).data?.statusMessage
      ?? (error as { statusMessage?: string }).statusMessage
      ?? 'Não foi possível consultar o CEP.'
    lookupError.value = `${message} Você ainda pode preencher o endereço manualmente.`
    lookupStatus.value = 'error'
  }
}

watch(
  () => digitos(draft.value.endereco.cep),
  (cep) => {
    if (lookupTimer) clearTimeout(lookupTimer)
    if (cep.length === 8 && cep !== lastLookup.value) {
      lookupTimer = setTimeout(lookupCep, 350)
    }
  },
)

onBeforeUnmount(() => {
  if (lookupTimer) clearTimeout(lookupTimer)
})

function validate(_state: Inscricao): FormError[] {
  return Object.entries(validarEndereco(draft.value)).map(([name, message]) => ({
    name: `endereco.${name}`,
    message,
  }))
}

async function submit(_event: FormSubmitEvent<Inscricao>) {
  touch()
  const returnTo = typeof route.query.returnTo === 'string' ? route.query.returnTo : ''
  await navigateTo(returnTo.startsWith('/') ? returnTo : '/inscricao/responsavel')
}
</script>

<template>
  <div class="journey-container">
    <JourneyProgress current="endereco" />

    <header class="mt-8">
      <p class="text-sm font-semibold text-primary">Sugestões mais úteis</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
        Onde a família mora?
      </h1>
      <p class="mt-3 leading-relaxed text-muted">
        O endereço aproxima o mapa e organiza sugestões. Ele nunca restringe as cinco unidades que você pode escolher.
      </p>
    </header>

    <UForm :state="draft" :validate="validate" class="mt-8 space-y-6" @submit="submit">
      <UCard variant="subtle">
        <div class="space-y-5">
          <UFormField
            name="endereco.cep"
            label="CEP"
            description="Ao completar os 8 dígitos, buscamos rua e bairro automaticamente."
            required
          >
            <UFieldGroup class="w-full">
              <UInput
                class="min-w-0 flex-1"
                inputmode="numeric"
                autocomplete="postal-code"
                placeholder="00000-000"
                icon="i-lucide-map-pin"
                :loading="lookupStatus === 'loading'"
                :model-value="draft.endereco.cep"
                @update:model-value="updateCep(String($event))"
                @blur="lookupCep"
              />
              <UButton
                label="Buscar"
                icon="i-lucide-search"
                color="neutral"
                variant="outline"
                :loading="lookupStatus === 'loading'"
                :disabled="digitos(draft.endereco.cep).length !== 8"
                @click="lookupCep"
              />
            </UFieldGroup>
          </UFormField>

          <UAlert
            v-if="lookupStatus === 'success' && !outsideRio"
            color="success"
            variant="soft"
            icon="i-lucide-circle-check"
            title="Endereço encontrado"
            description="Confira os dados e complete o número. Todos os campos continuam editáveis."
          />
          <UAlert
            v-if="outsideRio"
            color="warning"
            variant="soft"
            icon="i-lucide-map-pin-off"
            title="Este CEP parece estar fora da cidade do Rio"
            description="Confira o CEP ou ajuste o endereço manualmente antes de continuar."
          />
          <UAlert
            v-if="lookupStatus === 'error'"
            color="error"
            variant="soft"
            icon="i-lucide-wifi-off"
            title="Não encontramos o endereço automaticamente"
            :description="lookupError"
          />

          <UFormField name="endereco.logradouro" label="Rua ou avenida" required>
            <UInput
              v-model="draft.endereco.logradouro"
              class="w-full"
              autocomplete="address-line1"
              placeholder="Nome do logradouro"
              @change="touch"
            />
          </UFormField>

          <div class="grid gap-5 sm:grid-cols-2">
            <UFormField name="endereco.numero" label="Número" required>
              <UInput
                v-model="draft.endereco.numero"
                class="w-full"
                inputmode="numeric"
                autocomplete="address-line2"
                placeholder="Ex.: 120 ou S/N"
                @change="touch"
              />
            </UFormField>
            <UFormField name="endereco.complemento" label="Complemento" description="Opcional">
              <UInput
                v-model="draft.endereco.complemento"
                class="w-full"
                placeholder="Apto., bloco, casa"
                @change="touch"
              />
            </UFormField>
          </div>

          <UFormField name="endereco.bairro" label="Bairro" required>
            <UInputMenu
              v-model="draft.endereco.bairro"
              class="w-full"
              mode="autocomplete"
              :items="meta.bairros"
              virtualize
              icon="i-lucide-map"
              placeholder="Digite ou escolha o bairro"
              @change="touch"
            />
          </UFormField>

          <div v-if="draft.endereco.cidade" class="flex flex-wrap gap-2">
            <UBadge color="neutral" variant="soft" icon="i-lucide-building-2">
              {{ draft.endereco.cidade }} · {{ draft.endereco.uf }}
            </UBadge>
            <UBadge v-if="nearbyCount !== null" color="info" variant="soft" icon="i-lucide-school">
              {{ nearbyCount }} unidade(s) compatível(is) em até 2 km
            </UBadge>
          </div>
        </div>
      </UCard>

      <UAlert
        color="info"
        variant="soft"
        icon="i-lucide-navigation"
        title="A distância é aproximada nesta demo"
        description="O catálogo anonimizado não traz a rua da família; usamos o centro do bairro para as sugestões e mostramos essa limitação."
      />

      <div class="journey-actions flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <UButton to="/inscricao/criancas" label="Voltar" icon="i-lucide-arrow-left" color="neutral" variant="ghost" />
        <UButton type="submit" label="Continuar" trailing-icon="i-lucide-arrow-right" />
      </div>
    </UForm>
  </div>
</template>
