<script setup lang="ts">
import type { NuxtError } from '#app'

import * as locales from '@nuxt/ui/locale'

const props = defineProps<{
  error: NuxtError
}>()

const { shopify: { shopName } } = useAppConfig()
const { language } = useLocalization()
const { get } = useCart()
const localePath = useLocalePath()

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
      <UError
        :error="props.error"
        :clear="false"
      >
        <template #links>
          <UButton
            @click="clearError({
              redirect: localePath('/'),
            })"
          >
            {{ $t('error.home') }}
          </UButton>
        </template>
      </UError>
    </NuxtLayout>
  </UApp>
</template>
