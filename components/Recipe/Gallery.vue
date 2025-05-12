<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ images: string[] }>()

const selectedImage = ref(0)
</script>

<template>
  <div class="flex gap-2">
    <!-- Thumbnail list -->
    <div class="flex flex-col gap-2 mt-8">
      <button
        v-for="(image, index) in props.images"
        :key="index"
        :class="[
          'bg-white rounded-lg overflow-hidden',
          selectedImage === index
            ? 'ring-2 ring-blue-500'
            : 'ring-1 ring-gray-300',
        ]"
        @click="selectedImage = index"
        @mouseover="selectedImage = index"
      >
        <NuxtImg :src="image" alt="Recipe image" width="48" height="48" />
      </button>
    </div>

    <!-- Selected image with zoom -->
    <div class="w-full">
      <div class="relative h-[500px]">
        <NuxtImg
          :src="props.images[selectedImage]"
          densities="x1"
          sizes="xs:100vw sm:100vw md:100vw lg:100vw"
          class="w-full max-h-[500px] object-cover rounded-md shadow-sm mb-12"
          alt=""
        />
      </div>
    </div>
  </div>
</template>
