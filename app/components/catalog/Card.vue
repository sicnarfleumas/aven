<script setup lang="ts">
import type { Look } from '~/data/catalog'

const props = defineProps<{
  look: Look
}>()

const localePath = useLocalePath()
const { t, locale } = useI18n()

const price = computed(() => new Intl.NumberFormat(locale.value, {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(props.look.amount))
</script>

<template>
  <UCard
    class="h-full"
    variant="outline"
    :ui="{
      root: 'h-full overflow-hidden bg-elevated ring-default',
      body: 'flex h-full flex-col !p-0',
    }"
  >
    <NuxtLink
      :to="localePath(`/product/${look.handle}`)"
      class="flex h-full flex-col"
      :aria-label="`${t('product.view')}: '${look.title}'`"
    >
      <div class="group relative bg-muted">
        <div class="aspect-square p-6 sm:p-8">
          <CatalogTee
            :shirt="look.shirt"
            :ink="look.ink"
            :pocket="look.pocket"
            mark
          />
        </div>

        <div class="absolute inset-0 hidden bg-muted p-6 group-hover:block sm:p-8">
          <CatalogTee
            :shirt="look.shirt"
            :ink="look.ink"
            :pocket="look.pocket"
          />
        </div>
      </div>

      <div class="flex flex-1 flex-col px-4 py-4">
        <p class="text-[0.68rem] uppercase tracking-[0.16em] text-muted">
          {{ t('catalog.type') }} · {{ look.gsm }}
        </p>

        <p class="mt-2 text-sm font-semibold uppercase leading-snug tracking-wide text-highlighted">
          {{ look.title }}
        </p>

        <p class="mt-3 text-sm font-semibold text-highlighted">
          {{ price }}
        </p>
      </div>
    </NuxtLink>
  </UCard>
</template>
