<script setup lang="ts">
const props = defineProps<{
  rating: number
  size?: number
}>()

const size = `${props.size ?? 24}px`
</script>

<template>
  <NuxtRating
    :rating="rating"
    :rating-size="size"
    :readonly="true"
    :star-size="size"
    active-color="#facc15"
    inactive-color="#e5e7eb"
    :show-rating="false"
  />
</template>
