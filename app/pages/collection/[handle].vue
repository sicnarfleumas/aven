<script setup lang="ts">
definePageMeta({
  validate: route => typeof route.params.handle === 'string',
})

const { shopify: { shopName } } = useAppConfig()
const localePath = useLocalePath()
const route = useRoute()

const handle = computed(() => route.params.handle as string)

const key = localizedKey('collection', handle)

const { params: localization } = useLocalization()

const { data: collection, error } = await useStorefrontData(key, `#graphql
  query FetchCollection(
    $handle: String,
    $language: LanguageCode,
    $country: CountryCode
  )
  @inContext(language: $language, country: $country) {
    collection(handle: $handle) {
      ...CollectionFields
    }
  }
`, {
  variables: computed(() => collectionInputSchema.parse({
    handle: handle.value,
    ...localization.value,
  })),
  transform: data => data?.collection,
  cache: 'long',
})

if (!collection.value || error.value) {
  throw createError({
    status: 404,
    statusText: `${$t('error.notFound')}: ${route.fullPath}`,
    message: error.value?.message || $t('error.collection'),
    fatal: true,
  })
}

useSeoMeta({
  title: `${collection.value?.title} | ${shopName}`,
  description: collection.value?.description ?? $t('seo.description'),
})
</script>

<template>
  <UContainer class="py-6 lg:py-8">
    <UBreadcrumb
      :items="[
        { label: $t('breadcrumb.collections') },
        { label: collection?.title, to: localePath(`/collection/${handle}`) },
      ]"
      class="mb-6 lg:mb-8"
    />

    <h1 class="mb-6 text-2xl font-semibold uppercase tracking-[0.12em] text-highlighted lg:mb-8 lg:text-3xl">
      {{ collection?.title }}
    </h1>

    <p class="mb-8 max-w-md text-toned lg:mb-10 lg:text-lg">
      {{ collection?.description }}
    </p>

    <CollectionProducts :handle="handle" />

    <ShopifyCollectionView
      v-if="collection"
      :data="{ collection: { id: collection.id, handle } }"
    />
  </UContainer>
</template>
