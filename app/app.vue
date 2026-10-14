<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { shopify: { shopName } } = useAppConfig()
const { language } = useLocalization()
const { get } = useCart()

const uiLocales = locales as Record<string, typeof locales.en>
const uiLocale = computed(() => uiLocales[language.value] ?? locales.en)
const lang = computed(() => language.value)
const dir = computed(() => uiLocale.value.dir)

useHead({
  htmlAttrs: {
    lang,
    dir,
  },

  title: shopName,
})

await callOnce('shopify-cart', get)
</script>

<template>
  <UApp :locale="uiLocale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
