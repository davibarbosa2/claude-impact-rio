<script setup lang="ts">
const route = useRoute()
const hideFooter = computed(() => ['/', '/acompanhar', '/protocolo'].includes(route.path))
</script>

<template>
  <div class="min-h-dvh bg-default text-default">
    <UHeader :toggle="false">
      <template #left>
        <NuxtLink
          to="/"
          class="flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Fralda Carioca, ir para o início"
        >
          <span class="grid size-10 place-items-center rounded-xl bg-primary text-inverted">
            <UIcon name="i-lucide-school" class="size-5" />
          </span>
          <span>
            <strong class="block leading-tight text-highlighted">Fralda Carioca</strong>
            <span class="block text-xs text-muted">Jornada da creche</span>
          </span>
        </NuxtLink>
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter v-if="!hideFooter" class="mt-16 bg-muted">
      <template #left>
        <div class="text-sm text-muted">
        <p class="font-medium text-toned">Fralda Carioca</p>
        <p class="mt-1 max-w-2xl">
          Inscrição e acompanhamento de creche em um só lugar.
        </p>
        </div>
      </template>
    </UFooter>
  </div>
</template>
