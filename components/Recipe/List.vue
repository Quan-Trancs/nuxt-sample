<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import data from '@/lib/data'
import type { IRecipeInput } from '~/types/types'

// Props
const props = withDefaults(
  defineProps<{
    title: string
    type?: 'history' | 'related'
    hideDetails?: boolean
  }>(),
  {
    type: 'history',
    hideDetails: false,
  }
)

// Static recipe source
const allRecipes = data.recipes as IRecipeInput[]

// Pinia store
const store = useBrowsingHistoryStore()
const storedRecipes = store.recipes

// Filtered data for the slider
const filteredRecipes = ref<IRecipeInput[]>([])

watchEffect(() => {
  if (storedRecipes.length === 0) {
    return
  }

  const categories = storedRecipes.map((r) => r.category)
  const ids = storedRecipes.map((r) => r.id)

  filteredRecipes.value = allRecipes.filter((recipe) =>
    props.type === 'related'
      ? categories.includes(recipe.category) && !ids.includes(recipe.id)
      : ids.includes(recipe.id)
  )
})
</script>

<template>
  <div>
    <p class="font-bold">{{ title }}</p>
    <RecipeSlider :recipes="filteredRecipes" :hide-details="hideDetails" />
  </div>
</template>
