<script setup lang="ts">
const props = defineProps<{
  delay?: number
}>()

const root = useTemplateRef<HTMLElement>('root')
const visible = ref(false)

onMounted(() => {
  const node = root.value
  if (!node) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    visible.value = true
    return
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return
    visible.value = true
    observer.disconnect()
  }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' })

  observer.observe(node)
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div
    ref="root"
    class="aven-reveal"
    :class="{ 'is-visible': visible }"
    :style="props.delay ? { transitionDelay: `${props.delay}ms` } : undefined"
  >
    <slot />
  </div>
</template>
