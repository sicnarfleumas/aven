<script setup lang="ts">
import type { Look } from '~/data/catalog'

const props = defineProps<{
  look: Look
}>()

const { t, locale } = useI18n()
const sizes = ['S', 'M', 'L', 'XL', 'XXL']
const size = ref('M')
const front = ref(true)

const price = computed(() => new Intl.NumberFormat(locale.value, {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(props.look.amount))
</script>

<template>
  <div class="mb-12 lg:mb-16 lg:grid lg:grid-cols-12">
    <button
      type="button"
      class="mb-8 flex aspect-square items-center justify-center bg-muted p-8 sm:p-14 lg:col-span-6 lg:mb-0 lg:aspect-auto lg:min-h-[36rem]"
      :aria-label="look.title"
      @click="front = !front"
    >
      <CatalogTee
        class="max-h-[32rem]"
        :shirt="look.shirt"
        :ink="look.ink"
        :pocket="look.pocket"
        :mark="front"
      />
    </button>

    <div class="lg:col-span-4 lg:col-start-8">
      <div class="lg:sticky lg:top-[calc(var(--ui-header-height)+3rem)]">
        <p class="text-[0.68rem] uppercase tracking-[0.18em] text-muted">
          {{ t('catalog.type') }} · {{ look.gsm }}
        </p>

        <h1 class="mt-3 text-3xl font-semibold uppercase tracking-[0.12em] text-highlighted">
          {{ look.title }}
        </h1>

        <p class="mt-4 text-sm font-semibold text-highlighted">
          {{ price }}
        </p>

        <p class="mt-8 text-toned lg:text-lg">
          {{ t(`catalog.looks.${look.copy}`) }}
        </p>

        <div class="mt-8 flex flex-wrap gap-2">
          <UButton
            v-for="item in sizes"
            :key="item"
            :label="item"
            :variant="item === size ? 'solid' : 'outline'"
            :color="item === size ? 'primary' : 'neutral'"
            @click="size = item"
          />
        </div>
      </div>
    </div>
  </div>
</template>
