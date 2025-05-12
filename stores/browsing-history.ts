import { defineStore } from 'pinia'

export const useBrowsingHistoryStore = defineStore('browsingHistory', {
  // State of the store
  state: () => ({
    recipes: [] as { id: string; category: string }[], // Type the array of recipes
  }),
  // Actions (methods to modify the state)
  actions: {
    addItem(recipe: { id: string; category: string }) {
      const index = this.recipes.findIndex((p) => p.id === recipe.id)
      if (index !== -1) this.recipes.splice(index, 1) // Remove existing item
      this.recipes.unshift(recipe) // Add new recipe to the start

      if (this.recipes.length > 10) this.recipes.pop() // Ensure max length of 10
    },
    clear() {
      this.recipes = [] // Clear all recipes
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useBrowsingHistoryStore, import.meta.hot)
  )
}
