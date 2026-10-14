<script setup lang="ts">
const props = defineProps<{
  product: ProductFieldsFragment
  carousel?: boolean
  loading?: 'eager' | 'lazy'
}>()

const localePath = useLocalePath()

const url = computed(() => localePath(`/product/${props.product.handle}`))
const images = computed(() => flattenConnection(props.product.images))
const variants = computed(() => flattenConnection(props.product.variants))

const variant = computed(() => props.product.selectedOrFirstAvailableVariant ?? variants.value[0])

const range = computed(() => hasPriceRange(props.product))
const price = computed(() => displayPrice(props.product, variant.value ?? undefined))
const compareAtPrice = computed(() => displayCompareAtPrice(props.product, variant.value ?? undefined))

const soldOut = computed(() => isSoldOut(props.product))
const discount = computed(() => discountPercentage(price.value, compareAtPrice.value))
const eyebrow = computed(() => productEyebrow(props.product))
</script>

<template>
  <UCard
    class="h-full"
    variant="outline"
    :ui="{
      root: 'h-full overflow-hidden bg-elevated ring-default',
      body: 'flex h-full flex-col !p-0',
    }"
  >
    <NuxtLink
      :to="url"
      class="flex h-full flex-col"
      :aria-label="`${$t('product.view')}: '${props.product.title}'`"
    >
      <div class="group relative bg-muted">
        <div class="absolute top-3 left-3 z-10 flex flex-col items-start gap-1">
          <UBadge
            v-if="soldOut"
            color="neutral"
            variant="solid"
            :label="$t('product.soldOut')"
          />

          <UBadge
            v-else-if="discount"
            color="error"
            variant="solid"
            :label="$t('product.discount', { percentage: discount })"
          />

          <UBadge
            v-if="product.isGiftCard"
            color="primary"
            variant="solid"
            :label="$t('product.giftCard')"
          />
        </div>

        <UCarousel
          v-if="carousel && images.length > 1"
          v-slot="{ item, index }"
          :items="images"
          :ui="{
            prev: 'left-3! transition-opacity duration-150 lg:opacity-0 lg:group-hover:opacity-100',
            next: 'right-3! transition-opacity duration-150 lg:opacity-0 lg:group-hover:opacity-100',
          }"
          arrows
          loop
        >
          <ProductImage
            flush
            :image="item"
            :loading="index === 0 ? props.loading : 'lazy'"
            :title="`${props.product.title}${index !== 0 ? ` (${index})` : ''}`"
          />
        </UCarousel>

        <div
          v-else
          class="group relative"
        >
          <ProductImage
            flush
            :image="images?.[0] ?? undefined"
            :loading="props.loading"
            :title="props.product.title"
          />

          <ProductImage
            v-if="images?.[1]"
            flush
            :image="images[1]"
            :title="`${props.product.title} (1)`"
            class="absolute inset-0 hidden bg-muted group-hover:block"
          />
        </div>
      </div>

      <div class="flex flex-1 flex-col px-4 py-4">
        <p
          v-if="eyebrow"
          class="text-[0.68rem] uppercase tracking-[0.16em] text-muted"
        >
          {{ eyebrow }}
        </p>

        <p class="mt-2 text-sm font-semibold uppercase leading-snug tracking-wide text-highlighted">
          {{ props.product.title }}
        </p>

        <ProductPrice
          v-if="price"
          :price="price"
          :compare-at-price="compareAtPrice"
          :from="range"
          class="mt-3 text-sm"
        />
      </div>
    </NuxtLink>
  </UCard>
</template>
