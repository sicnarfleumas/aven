<script setup lang="ts">
const { shopify: { shopName } } = useAppConfig()

useSeoMeta({
  title: `${$t('collection.all')} | ${shopName}`,
  description: $t('collection.description'),
})
</script>

<template>
  <UContainer class="py-6 lg:py-8">
    <UBreadcrumb
      :items="[{ label: $t('collection.all') }]"
      class="mb-6 lg:mb-8"
    />

    <h1 class="mb-6 text-2xl font-semibold uppercase tracking-[0.12em] text-highlighted lg:mb-8 lg:text-3xl">
      {{ $t('collection.all') }}
    </h1>

    <p class="mb-8 max-w-md text-toned lg:mb-10 lg:text-lg">
      {{ $t('collection.description') }}
    </p>

    <CollectionGrid :first="50" />
  </UContainer>
</template>
