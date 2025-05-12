<template>
  <!-- Show basic layout without border -->
  <div v-if="!hideBorders" class="flex flex-col">
    <NuxtLink :to="`/recipe/${recipe.slug}`"
      ><template v-if="recipe.images.length > 1">
        <RecipeImageHover
          :src="recipe.images[0]"
          :alt="recipe.name"
          :hover-src="recipe.images[1]"
        />
      </template>
      <template v-else>
        <NuxtImg
          :src="recipe.images[0]"
          :alt="recipe.name"
          sizes="xs:100vw sm:50vw lg:80vw"
          format="webp"
          densities="x1"
          class="rounded-t-md max-h-full object-contain"
        />
      </template>
    </NuxtLink>

    <div v-if="!hideDetails">
      <div class="flex-1 p-3">
        <div className="flex-1 space-y-2">
          <NuxtLink
            :to="`/recipe/${recipe.slug}`"
            class="overflow-hidden text-eclipse"
            :style="{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }"
          >
            <p class="font-bold mb-2 flex-between">
              {{ recipe.name }}
              <RecipeAddToLibrary
                minimal
                :item="{
                  recipeId: recipe.id,
                  name: recipe.name,
                  slug: recipe.slug,
                  category: recipe.category,
                  image: recipe.images[0],
                }"
              />
            </p>
            <p>
              {{ recipe.description }}
            </p>
          </NuxtLink>
          <div class="flex gap-2">
            <RecipeRating :rating="recipe.avgRating" :size="15" />
            <span class="text-sm"
              >{{ formatNumber(recipe.numReviews) }} reviews</span
            >
          </div>
          <div class="text-sm">
            {{ recipe.cookTimeMinutes + recipe.prepTimeMinutes }} min ·
            {{ recipe.caloriesPerServing }} cals · {{ recipe.servings }} servs
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Show UCard with border -->
  <UCard v-else class="flex flex-col">
    <template #header>
      <NuxtLink :to="`/recipe/${recipe.slug}`">
        <template v-if="recipe.images.length > 1">
          <RecipeImageHover
            :src="recipe.images[0]"
            :alt="recipe.name"
            :hover-src="recipe.images[1]"
          />
        </template>
        <template v-else>
          <div class="relative h-52 flex items-center justify-center">
            <NuxtImg
              :src="recipe.images[0]"
              :alt="recipe.name"
              sizes="xs:100vw sm:50vw lg:400px"
              format="webp"
              densities="x1"
              class="rounded-t-md max-h-full object-contain"
            />
          </div>
        </template>
      </NuxtLink>
    </template>

    <div v-if="!hideDetails" class="flex-1">
      <div className="flex-1 space-y-2">
        <NuxtLink
          :to="`/recipe/${recipe.slug}`"
          class="overflow-hidden text-eclipse"
          :style="{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }"
        >
          <p class="font-bold mb-2 flex-between">
            {{ recipe.name }}
            <RecipeAddToLibrary
              minimal
              :item="{
                recipeId: recipe.id,
                name: recipe.name,
                slug: recipe.slug,
                category: recipe.category,
                image: recipe.images[0],
              }"
            />
          </p>
          <p>
            {{ recipe.description }}
          </p>
        </NuxtLink>
        <div class="flex gap-2">
          <RecipeRating :rating="recipe.avgRating" :size="15" />
          <span class="text-sm"
            >{{ formatNumber(recipe.numReviews) }} reviews</span
          >
        </div>
        <div class="text-sm">
          {{ recipe.cookTimeMinutes + recipe.prepTimeMinutes }} min ·
          {{ recipe.caloriesPerServing }} cals · {{ recipe.servings }} servs
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { RecipeImageHover } from '#components'
import { formatNumber } from '@/utils'
import type { IRecipeInput } from '~/types'

defineProps({
  recipe: {
    type: Object as PropType<IRecipeInput>,
    required: true,
  },
  hideBorders: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
  hideAddToLibrary: {
    type: Boolean,
    default: false,
  },
})
</script>
