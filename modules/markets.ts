import type { Nuxt } from 'nuxt/schema'
import type { LocaleObject } from '@nuxtjs/i18n'

import { resolve } from 'node:path'
import { defineNuxtModule } from 'nuxt/kit'

const indiaLocales = (): LocaleObject[] => [
  {
    code: 'en-in',
    language: 'en-IN',
    name: 'English',
    file: 'en.json',
  },
  {
    code: 'ta-in',
    language: 'ta-IN',
    name: 'தமிழ்',
    file: 'ta.json',
  },
]

const setLanguageOptions = (nuxt: Nuxt) => {
  const locales = indiaLocales()

  nuxt.options.i18n.defaultLocale = 'en-in'
  nuxt.options.i18n.locales = locales

  nuxt.hook('i18n:registerModule', register => register({
    langDir: resolve(nuxt.options.rootDir, 'i18n/locales'),
    locales,
  }))
}

export default defineNuxtModule({
  meta: {
    name: 'shopify-markets',
  },

  setup(_options, nuxt) {
    setLanguageOptions(nuxt)
  },
})
