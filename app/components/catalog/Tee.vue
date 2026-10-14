<script setup lang="ts">
defineProps<{
  shirt: string
  ink: string
  mark?: boolean
  pocket?: boolean
}>()
</script>

<template>
  <svg
    viewBox="0 0 640 720"
    class="h-full w-full"
    aria-hidden="true"
  >
    <path
      :fill="shirt"
      fill-rule="evenodd"
      d="M210 168 L150 210 L108 268 L156 308 L214 248 L214 620 L426 620 L426 248 L484 308 L532 268 L490 210 L430 168 C390 210 250 210 210 168 Z M278 176 C286 228 354 228 362 176 C340 198 300 198 278 176 Z"
    />

    <rect
      v-if="pocket"
      x="246"
      y="300"
      width="72"
      height="78"
      rx="6"
      fill="none"
      :stroke="ink"
      stroke-width="3"
      opacity="0.55"
    />

    <g
      v-if="mark"
      :fill="ink"
      text-anchor="middle"
      font-family="Outfit, sans-serif"
    >
      <text
        x="320"
        y="348"
        font-size="40"
        letter-spacing="12"
      >
        AVEN
      </text>
      <text
        x="320"
        y="376"
        font-size="11"
        letter-spacing="3.2"
      >
        WEAR YOUR WAY
      </text>
    </g>
  </svg>
</template>
