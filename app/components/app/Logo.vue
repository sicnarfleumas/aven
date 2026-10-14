<script setup lang="ts">
const localePath = useLocalePath()

defineProps<{
  large?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="localePath('/')"
    class="inline-block shrink-0 font-medium uppercase tracking-[0.42em] text-highlighted"
    :class="large ? 'text-3xl' : 'text-sm'"
  >
    AVEN
  </NuxtLink>
</template>
