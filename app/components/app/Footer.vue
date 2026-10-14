<script setup lang="ts">
const { data: policies } = await useMenu('footer')

const analytics = useShopifyAnalytics()
</script>

<template>
  <UFooter
    :ui="{
      root: 'border-t border-default',
      container: 'py-12 lg:py-16 flex flex-col items-center text-center',
      left: 'hidden',
      right: 'hidden',
      center: 'flex flex-col items-center',
      bottom: 'border-t border-muted py-6',
    }"
  >
    <AppLogo large />

    <p class="mt-3 text-[0.68rem] uppercase tracking-[0.32em] text-muted">
      {{ $t('home.tagline') }}
    </p>

    <template #bottom>
      <div class="flex justify-center">
        <UNavigationMenu
          v-if="policies?.length"
          variant="pill"
          :items="[...policies, {
            onSelect: () => analytics.showPreferences(),
            label: $t('footer.cookies'),
          }]"
          :ui="{
            list: 'flex-wrap justify-center',
            link: 'text-dimmed text-xs',
          }"
        />
      </div>
    </template>
  </UFooter>
</template>
