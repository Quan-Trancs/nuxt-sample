<template>
  <div class="w-full bg-background">
    <UCarousel
      :items="recipes"
      :per-page="getPerPage"
      navigation
      loop
      class="w-full"
      arrows
      :ui="{
        item: hideDetails
          ? 'sm:basis-1/3 lg:basis-1/5'
          : 'sm:basis-1/3 lg:basis-1/5',
      }"
    >
      <template #default="{ item }">
        <div :key="item.slug">
          <RecipeCard
            :recipe="item"
            :hide-details="hideDetails"
            :hide-add-to-library="false"
            :hide-borders="true"
          />
        </div>
      </template>
    </UCarousel>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  recipes: {
    type: Array,
    required: true,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
})

// Computed property to determine the number of items per slide
const getPerPage = computed(() => (props.hideDetails ? 4 : 3))
</script>
