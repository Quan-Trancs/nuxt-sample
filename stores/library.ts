// stores/library.ts
import { defineStore } from "pinia";
import type { LibraryItem, Library } from "@/types";

export const useLibraryStore = defineStore("library", {
  state: (): { library: Library } => ({
    library: {
      items: [],
    },
  }),
  actions: {
    async addItem(item: LibraryItem) {
      this.library.items.push({ ...item });
    },
    clearLibrary() {
      this.library.items = [];
    },
    // ...other actions
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLibraryStore, import.meta.hot));
}
