<script setup lang="ts">
const { shopify: { shopName } } = useAppConfig()
const localePath = useLocalePath()
const { t } = useI18n()
const { params: localization } = useLocalization()

const letters = computed(() => t('home.title').split(''))

const { data: edit } = await useStorefrontData(localizedKey('home-edit'), `#graphql
  query FetchHomeEdit(
    $first: Int,
    $sortKey: ProductSortKeys,
    $language: LanguageCode,
    $country: CountryCode
  )
  @inContext(language: $language, country: $country) {
    products(first: $first, sortKey: $sortKey) {
      ...ProductConnectionFields
    }
  }
`, {
  variables: computed(() => productConnectionParamsSchema.extend(localizationParamsSchema.shape).parse({
    first: 5,
    sortKey: 'BEST_SELLING',
    ...localization.value,
  })),
  transform: data => flattenConnection(data?.products),
  cache: 'long',
})

const lead = computed(() => edit.value?.[0])
const row = computed(() => edit.value?.slice(1) ?? [])

const leadImage = computed(() => {
  const product = lead.value
  if (!product) return

  return product.featuredImage ?? flattenConnection(product.images)[0]
})

const leadPrice = computed(() => lead.value ? displayPrice(lead.value) : undefined)

useSeoMeta({
  title: `${shopName} | ${t('home.tagline')}`,
  description: t('seo.description'),
})
</script>

<template>
  <div>
    <section class="lg:grid lg:min-h-[calc(100svh-var(--ui-header-height))] lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
      <div class="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
        <h1
          class="text-[clamp(3.4rem,8vw,6.25rem)] leading-none font-medium tracking-[0.2em] text-highlighted uppercase"
          :aria-label="t('home.title')"
        >
          <span
            v-for="(letter, index) in letters"
            :key="`${letter}-${index}`"
            class="aven-letter"
            :style="{ animationDelay: `${0.05 + index * 0.09}s` }"
            aria-hidden="true"
          >{{ letter }}</span>
        </h1>

        <p
          class="aven-fade mt-6 text-[0.68rem] tracking-[0.46em] text-muted uppercase"
          style="animation-delay: 0.48s"
        >
          {{ t('home.tagline') }}
        </p>

        <p
          class="aven-fade mt-8 max-w-xs text-sm leading-relaxed text-toned sm:text-base"
          style="animation-delay: 0.64s"
        >
          {{ t('home.description') }}
        </p>

        <NuxtLink
          :to="localePath('/collections')"
          class="aven-shop aven-fade mt-10"
          style="animation-delay: 0.8s"
        >
          <span class="inline-flex items-center gap-3">
            {{ t('home.shop') }}
            <UIcon
              name="i-lucide-arrow-right"
              class="aven-shop-arrow size-3.5"
            />
          </span>
          <span
            class="aven-shop-line"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>

      <NuxtLink
        v-if="lead && leadImage"
        :to="localePath(`/product/${lead.handle}`)"
        class="aven-hero-frame group relative flex min-h-[72vw] items-end overflow-hidden bg-elevated sm:min-h-[28rem] lg:min-h-0"
        :aria-label="`${t('product.view')}: '${lead.title}'`"
      >
        <NuxtImg
          provider="shopify"
          :src="leadImage.url"
          :alt="leadImage.altText || lead.title"
          class="aven-hero-image absolute inset-0 h-full w-full object-contain p-8 pb-24 sm:p-14 sm:pb-28"
          style="animation-delay: 0.2s"
          width="1400"
          height="1600"
          sizes="100vw lg:58vw"
          loading="eager"
          fetchpriority="high"
        />

        <span class="aven-fade absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 border-t border-muted bg-elevated px-6 py-4 sm:px-8" style="animation-delay: 0.95s">
          <span class="text-[0.68rem] tracking-[0.18em] text-highlighted uppercase">
            {{ lead.title }}
          </span>
          <ProductPrice
            v-if="leadPrice"
            :price="leadPrice"
            class="text-sm"
          />
        </span>
      </NuxtLink>
    </section>

    <section
      v-if="row.length"
      class="border-t border-muted px-6 py-16 sm:px-10 lg:px-14 lg:py-24"
    >
      <AppReveal>
        <h2 class="mb-8 text-[0.68rem] tracking-[0.28em] text-muted uppercase lg:mb-10">
          {{ t('home.products.bestsellers') }}
        </h2>
      </AppReveal>

      <div class="aven-edit grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        <AppReveal
          v-for="(product, index) in row"
          :key="product.id"
          :delay="index * 90"
        >
          <ProductCard
            :product="product"
            :loading="index < 2 ? 'eager' : 'lazy'"
          />
        </AppReveal>
      </div>
    </section>

    <section class="border-t border-muted px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
      <AppReveal>
        <h2 class="mb-8 text-[0.68rem] tracking-[0.28em] text-muted uppercase lg:mb-10">
          {{ t('collection.all') }}
        </h2>

        <CollectionGrid />
      </AppReveal>
    </section>
  </div>
</template>
