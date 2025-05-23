// stores/library.ts
import { defineStore } from 'pinia'
import type { LibraryItem, Library } from '~/types/types'

export const useLibraryStore = defineStore('library', {
  state: (): { library: Library } => ({
    library: {
      items: [],
    },
  }),
  actions: {
    async addItem(item: LibraryItem) {
      // Check if the item already exists, don't add duplicates
      if (!this.isInLibrary(item.recipeId)) {
        this.library.items.push({ ...item })
      }
    },
    clearLibrary() {
      this.library.items = []
    },
    removeItem(recipeId: string) {
      const index = this.library.items.findIndex(
        (item) => item.recipeId === recipeId
      )
      if (index !== -1) {
        this.library.items.splice(index, 1)
      }
    },
    isInLibrary(recipeId: string): boolean {
      return this.library.items.some((item) => item.recipeId === recipeId)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLibraryStore, import.meta.hot))
}
