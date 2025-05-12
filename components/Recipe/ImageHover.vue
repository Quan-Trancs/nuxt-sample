<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  src: string
  hoverSrc: string
  alt: string
}>()

const isHovered = ref<boolean>(false)
let hoverTimeout: ReturnType<typeof setTimeout> | null = null

const handleMouseEnter = () => {
  hoverTimeout = setTimeout(() => {
    isHovered.value = true
  }, 1000)
}

const handleMouseLeave = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
  }
  isHovered.value = false
}
</script>

<template>
  <div
    class="relative w-full h-52"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <NuxtImg
      :src="src"
      :alt="alt"
      fit="contain"
      class="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
      :class="{ 'opacity-0': isHovered, 'opacity-100': !isHovered }"
    />
    <NuxtImg
      :src="hoverSrc"
      :alt="alt"
      fit="contain"
      class="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
      :class="{ 'opacity-100': isHovered, 'opacity-0': !isHovered }"
    />
  </div>
</template>
