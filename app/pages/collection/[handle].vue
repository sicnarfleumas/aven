<script setup lang="ts">
import { findEdit, looksFor } from '~/data/catalog'

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

const edit = findEdit(handle.value)
const editLooks = edit ? looksFor(edit) : []

if ((!collection.value || error.value) && !edit) {
  throw createError({
    status: 404,
    statusText: `${$t('error.notFound')}: ${route.fullPath}`,
    message: error.value?.message || $t('error.collection'),
    fatal: true,
  })
}

useSeoMeta({
  title: `${collection.value?.title ?? (edit ? $t(`catalog.edits.${edit.handle}.title`) : '')} | ${shopName}`,
  description: collection.value?.description ?? (edit ? $t(`catalog.edits.${edit.handle}.description`) : $t('seo.description')),
})
</script>

<template>
  <UContainer class="py-6 lg:py-8">
    <UBreadcrumb
      :items="[
        { label: $t('breadcrumb.collections') },
        { label: collection?.title ?? (edit ? $t(`catalog.edits.${edit.handle}.title`) : ''), to: localePath(`/collection/${handle}`) },
      ]"
      class="mb-6 lg:mb-8"
    />

    <h1 class="mb-6 text-2xl font-semibold uppercase tracking-[0.12em] text-highlighted lg:mb-8 lg:text-3xl">
      {{ collection?.title ?? (edit ? $t(`catalog.edits.${edit.handle}.title`) : '') }}
    </h1>

    <p class="mb-8 max-w-md text-toned lg:mb-10 lg:text-lg">
      {{ collection?.description ?? (edit ? $t(`catalog.edits.${edit.handle}.description`) : '') }}
    </p>

    <div
      v-if="edit && !collection?.id"
      class="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5"
    >
      <CatalogCard
        v-for="item in editLooks"
        :key="item.handle"
        :look="item"
      />
    </div>

    <CollectionProducts
      v-else
      :handle="handle"
    />

    <ShopifyCollectionView
      v-if="collection?.id"
      :data="{ collection: { id: collection.id, handle } }"
    />
  </UContainer>
</template>
