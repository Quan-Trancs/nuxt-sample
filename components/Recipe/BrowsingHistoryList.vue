<template>
  <div v-if="recipes.length !== 0" class="bg-background">
    <RecipeList title="Related to items that you've viewed" type="related" />

    <RecipeList
      title="Your browsing history"
      type="history"
      :hide-details="true"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

defineProps({
  //set default value
  className: {
    type: String,
    default: '',
  },
})

const browsingHistoryStore = useBrowsingHistoryStore()
const { recipes } = storeToRefs(browsingHistoryStore)
</script>
