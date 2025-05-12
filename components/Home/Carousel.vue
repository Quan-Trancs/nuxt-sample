<script setup lang="ts">
defineProps<{
  items: {
    image: string
    url: string
    title: string
    buttonCaption: string
  }[]
}>()
</script>

<template>
  <UCarousel
    dots
    :items="items"
    loop
    arrows
    indicators
    :autoplay="{
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }"
    class="w-full mx-auto"
    :ui="{ item: 'basis-full' }"
  >
    <template #default="{ item }">
      <NuxtLink :to="item.url">
        <div
          class="flex aspect-[16/6] items-center justify-center p-6 relative -m-1"
        >
          <NuxtImg
            :src="item.image"
            :alt="item.title"
            class="absolute inset-0 w-full h-full object-cover"
            priority
          />
          <div
            class="absolute w-1/3 left-16 md:left-31 top-1/2 transform -translate-y-1/2"
          >
            <h2 class="text-xl md:text-6xl font-bold mb-4 text-primary">
              {{ item.title }}
            </h2>
            <UButton class="hidden md:block">
              {{ item.buttonCaption }}
            </UButton>
          </div>
        </div>
      </NuxtLink>
    </template>
  </UCarousel>
</template>
