<script setup lang="ts">
import data from '@/lib/data'
import { toSlug } from '@/utils'
import {
  getAllCategories,
  getRecipesForCard,
  getRecipesByTag,
} from '~/composables/actions/recipe.actions'
import type { IRecipeInput, Item } from '~/types'

const categories = ref<string[]>([])
const latestRecipes = ref<Item[]>([])
const mostPickedRecipes = ref<Item[]>([])
const featureds = ref<Item[]>([])
const todaysRecipes = ref<IRecipeInput[]>([])
const balencedRecipes = ref<IRecipeInput[]>([])

try {
  categories.value = getAllCategories().slice(0, 4)
} catch (error) {
  console.error('Failed to fetch categories:', error)
}

try {
  latestRecipes.value = await getRecipesForCard({
    tag: 'new-arrival',
    limit: 4,
  })
} catch (error) {
  console.error('Failed to fetch latest recipes:', error)
}

try {
  featureds.value = await getRecipesForCard({ tag: 'featured', limit: 4 })
} catch (error) {
  console.error('Failed to fetch featured recipes:', error)
}

try {
  mostPickedRecipes.value = await getRecipesForCard({
    tag: 'most-picked',
    limit: 4,
  })
} catch (error) {
  console.error('Failed to fetch most picked recipes:', error)
}

try {
  todaysRecipes.value = getRecipesByTag('todays-recipe')
} catch (error) {
  console.error("Failed to fetch today's recipes:", error)
}

try {
  balencedRecipes.value = getRecipesByTag('balanced-recipe')
} catch (error) {
  console.error('Failed to fetch balanced recipes:', error)
}

const cards = [
  {
    title: 'Categories to explore',
    link: {
      text: 'See More',
      href: '/search',
    },
    items: categories.value.map((category) => ({
      name: category,
      image: `/images/${toSlug(category)}.jpg`,
      href: `/search?category=${category}`,
    })),
  },
  {
    title: 'Latest Recipes',
    items: latestRecipes.value,
    link: {
      text: 'View All',
      href: '/search?tag=new-arrival',
    },
  },
  {
    title: 'Most Popular',
    items: mostPickedRecipes.value,
    link: {
      text: 'View All',
      href: '/search?tag=most-picked',
    },
  },
  {
    title: 'Featured Recipes',
    items: featureds.value,
    link: {
      text: 'View All',
      href: '/search?tag=featured',
    },
  },
]
</script>

<template>
  <div>
    <HomeCarousel :items="data.carousels" />

    <div class="md:p-4 md:space-y-4 bg-border mt-10">
      <HomeCard :cards="cards" />

      <UCard class="w-full rounded-none">
        <template #header><p class="font-bold">Today's Recipes</p> </template>
        <RecipeSlider :recipes="todaysRecipes" />
      </UCard>

      <UCard class="w-full rounded-none">
        <template #header><p class="font-bold">Balanced Choices</p> </template>
        <RecipeSlider
          :recipes="balencedRecipes"
          :hide-details="false"
          :hide-borders="true"
        />
      </UCard>
    </div>
    <div class="p-4 bg-background">
      <RecipeBrowsingHistoryList />
    </div>
  </div>
</template>
