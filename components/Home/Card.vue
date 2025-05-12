<script setup lang="ts">
type CardItem = {
  title: string
  link: { text: string; href: string }
  items: {
    name: string
    href: string
    image: string
    items?: string[]
  }[]
}

defineProps<{
  cards: CardItem[]
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-4">
    <UCard
      v-for="card in cards"
      :key="card.title"
      class="rounded-none flex flex-col"
    >
      <template #header>
        <h3 class="text-xl font-bold mb-4">{{ card.title }}</h3>
      </template>

      <div class="grid grid-cols-2 gap-4">
        <NuxtLink
          v-for="item in card.items"
          :key="item.name"
          :to="item.href"
          class="flex flex-col"
        >
          <NuxtImg
            :src="item.image"
            :alt="item.name"
            width="120"
            height="120"
            class="aspect-square object-scale-down max-w-full h-auto mx-auto"
          />
          <p
            class="text-sm text-center whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {{ item.name }}
          </p>
        </NuxtLink>
      </div>

      <template v-if="card.link" #footer>
        <NuxtLink :to="card.link.href" class="m-4 block">
          {{ card.link.text }}
        </NuxtLink>
      </template>
    </UCard>
  </div>
</template>
