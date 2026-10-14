<script setup lang="ts">
import { edits, findLook } from '~/data/catalog'

const props = defineProps<{
  first?: number
}>()

const localePath = useLocalePath()

const first = computed(() => props.first ?? 10)

const { params: localization } = useLocalization()

const { data: collections } = await useStorefrontData(localizedKey('collections'), `#graphql
  query FetchCollections($first: Int, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    collections(
      first: $first
    ) {
      ...CollectionConnectionFields
    }
  }
`, {
  variables: computed(() => connectionParamsSchema.extend(localizationParamsSchema.shape).parse({
    first: first.value,
    ...localization.value,
  })),
  transform: data => flattenConnection(data?.collections),
  cache: 'long',
})

const listed = computed(() => Array.isArray(collections.value) ? collections.value : [])
const covers = edits.map(edit => ({
  edit,
  look: findLook(edit.pieces[0] ?? ''),
}))
</script>

<template>
  <div
    v-if="listed.length"
    class="sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2 lg:grid-cols-3"
  >
    <UPageCard
      v-for="(collection, index) in listed"
      :key="`collection-${index}`"
      class="mb-4"
      :title="collection.title"
      :description="collection.description"
      :to="localePath(`/collection/${collection.handle}`)"
      :ui="{
        title: 'uppercase tracking-wide',
        description: 'line-clamp-3',
      }"
      reverse
    >
      <NuxtImg
        v-if="collection.image"
        provider="shopify"
        :src="collection.image.url"
        :alt="collection.image.altText || collection.title"
        class="rounded-md object-cover aspect-square"
        sizes="xs:100vw sm:50vw lg:33vw xl:33vw"
        :width="600"
        :height="600"
      />
    </UPageCard>
  </div>

  <div
    v-else
    class="sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2 lg:grid-cols-3"
  >
    <UPageCard
      v-for="{ edit, look } in covers"
      :key="edit.handle"
      class="mb-4"
      :title="$t(`catalog.edits.${edit.handle}.title`)"
      :description="$t(`catalog.edits.${edit.handle}.description`)"
      :to="localePath(`/collection/${edit.handle}`)"
      :ui="{
        title: 'uppercase tracking-wide',
        description: 'line-clamp-3',
      }"
      reverse
    >
      <div
        v-if="look"
        class="aspect-square bg-muted p-6"
      >
        <CatalogTee
          :shirt="look.shirt"
          :ink="look.ink"
          :pocket="look.pocket"
          mark
        />
      </div>
    </UPageCard>
  </div>
</template>
