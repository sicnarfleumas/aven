<script setup lang="ts">
import { findLook } from '~/data/catalog'

definePageMeta({
  validate: route => typeof route.params.handle === 'string',
})

const { shopify: { shopName } } = useAppConfig()
const localePath = useLocalePath()
const router = useRouter()
const route = useRoute()

const handle = computed(() => route.params.handle as string)

const { params: localization } = useLocalization()

const { data, error } = await useStorefrontData(localizedKey('product', handle), `#graphql
  query FetchProduct($handle: String, $language: LanguageCode, $country: CountryCode) 
  @inContext(language: $language, country: $country) {
    product(handle: $handle) {
      ...ProductFields
    }

    productRecommendations(productHandle: $handle) {
      ...ProductFields
    }
  }
`, {
  variables: computed(() => productInputSchema.parse({
    handle: handle.value,
    ...localization.value,
  })),
  cache: 'long',
})

const look = findLook(handle.value)

if ((!data.value?.product || error.value) && !look) {
  throw createError({
    status: 404,
    statusText: `${$t('error.notFound')}: ${route.fullPath}`,
    message: error.value?.message || $t('error.product'),
  })
}

const product = computed(() => data.value?.product)
const recommendations = computed(() => data.value?.productRecommendations)

const selectedVariant = ref(flattenConnection(data.value?.product?.variants)
  .find(variant => variant.id.replace('gid://shopify/ProductVariant/', '') === route.query.variantId)
  ?? product.value?.selectedOrFirstAvailableVariant)

useSeoMeta({
  title: `${product.value?.title ?? look?.title} | ${shopName}`,
  description: product.value?.description ?? (look ? $t(`catalog.looks.${look.copy}`) : $t('seo.description')),
})

watch(selectedVariant, (variant) => {
  if (variant) {
    router.push({
      path: localePath(`/product/${variant.product.handle}`),
      query: { variantId: variant.id.replace('gid://shopify/ProductVariant/', '') },
    })
  }
})
</script>

<template>
  <UContainer class="py-6 pb-12 lg:py-8 lg:pb-16">
    <UBreadcrumb
      :items="[
        { label: $t('breadcrumb.products') },
        { label: product?.title ?? look?.title, to: localePath(`/product/${handle}`) },
      ]"
      class="mb-6 lg:mb-8"
    />

    <CatalogProduct
      v-if="look && !product"
      :look="look"
    />

    <div
      v-if="product && selectedVariant"
      class="mb-12 lg:grid lg:grid-cols-12 lg:mb-16"
    >
      <ProductGallery
        ref="carousel"
        :selected-variant="selectedVariant"
        :product="product"
        class="lg:col-span-6"
        thumbnails
      />

      <div class="lg:col-span-4 lg:col-start-8">
        <div class="lg:sticky lg:top-[calc(var(--ui-header-height)+3rem)]">
          <ProductConfigurator
            v-model="selectedVariant"
            :product="product"
            class="mb-12 lg:mb-16"
          />

          <p class="mb-6 lg:text-lg lg:mb-8">
            {{ product.description }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="recommendations?.length">
      <p class="text-[0.68rem] uppercase tracking-[0.2em] text-muted">
        {{ $t('product.recommendationsEyebrow') }}
      </p>

      <h2 class="mt-2 mb-8 text-2xl font-semibold uppercase tracking-[0.12em] text-highlighted lg:text-3xl">
        {{ $t('product.recommendations') }}
      </h2>

      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ProductCard
          v-for="item in recommendations"
          :key="item.id"
          :product="item"
        />
      </div>
    </div>

    <ShopifyProductView
      v-if="product && selectedVariant"
      :data="{
        products: [{
          id: product.id,
          title: product.title,
          vendor: product.vendor,
          price: selectedVariant.price.amount,
          variantId: selectedVariant.id,
          variantTitle: selectedVariant.title,
        }],
      }"
    />
  </UContainer>
</template>
