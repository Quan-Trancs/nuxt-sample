<template>
  <div class="py-8">
    <UContainer>
      <h1 class="h1-bold mb-6">Your Recipe Library</h1>

      <!-- Empty state -->
      <UCard v-if="!libraryItems.length" class="text-center py-8">
        <div class="flex flex-col items-center gap-4">
          <Icon
            name="material-symbols:bookmark"
            size="60"
            class="text-gray-400"
          />
          <h2 class="h2-bold">Your Library is Empty</h2>
          <p class="text-gray-600 max-w-md mx-auto">
            Save your favorite recipes to your library for quick access later.
            Browse recipes and click the bookmark icon to add them.
          </p>
          <NuxtLink to="/">
            <UButton color="primary" class="mt-2">Browse Recipes</UButton>
          </NuxtLink>
        </div>
      </UCard>

      <!-- Library content -->
      <div v-else>
        <div class="flex justify-between items-center mb-4">
          <p class="text-gray-600">{{ libraryItems.length }} recipe(s) saved</p>
          <UButton
            v-if="libraryItems.length > 0"
            color="gray"
            variant="ghost"
            size="sm"
            @click="confirmClear"
          >
            Clear All
          </UButton>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <div
            v-for="item in libraryItems"
            :key="item.recipeId"
            class="relative"
          >
            <!-- Remove button -->
            <UButton
              icon="i-heroicons-x-mark"
              color="red"
              variant="ghost"
              class="absolute top-2 right-2 z-10"
              size="xs"
              @click="() => removeItem(item.recipeId)"
              aria-label="Remove from library"
            />

            <!-- Card wrapper -->
            <UCard class="h-full flex flex-col">
              <NuxtLink :to="`/recipe/${item.slug}`" class="block">
                <div class="relative h-52 flex items-center justify-center">
                  <NuxtImg
                    :src="item.image"
                    :alt="item.name"
                    sizes="xs:100vw sm:50vw lg:400px"
                    format="webp"
                    densities="x1"
                    class="rounded-t-md max-h-full object-contain"
                  />
                </div>
              </NuxtLink>

              <div class="p-4 flex-1 flex flex-col">
                <NuxtLink :to="`/recipe/${item.slug}`" class="block">
                  <h3 class="font-bold text-lg mb-2">{{ item.name }}</h3>
                </NuxtLink>
                <div class="mt-auto">
                  <UBadge
                    :color="getCategoryColor(item.category)"
                    size="sm"
                    class="mt-2"
                  >
                    {{ item.category }}
                  </UBadge>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Confirmation modal for clearing library -->
    <UModal v-model="isConfirmModalOpen">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <Icon name="material-symbols:warning" class="text-amber-500" />
            <h3 class="text-lg font-bold">Clear Library</h3>
          </div>
        </template>

        <p>
          Are you sure you want to remove all recipes from your library? This
          action cannot be undone.
        </p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="gray"
              variant="ghost"
              @click="isConfirmModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton color="red" @click="clearLibrary"> Clear All </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useLibraryStore } from "@/stores/library";
import { storeToRefs } from "pinia";

// Initialize page
definePageMeta({
  title: "My Recipe Library",
  layout: "default",
});

// Get library store
const libraryStore = useLibraryStore();
const { library } = storeToRefs(libraryStore);
const libraryItems = computed(() => library.value.items);

// Modal state
const isConfirmModalOpen = ref(false);
const toast = useToast();

// Functions
const removeItem = (recipeId: string) => {
  // Find the item index
  const itemIndex = libraryItems.value.findIndex(
    (item) => item.recipeId === recipeId,
  );
  if (itemIndex !== -1) {
    // Create a new array without the item (avoiding direct state mutation)
    const newItems = [...libraryItems.value];
    newItems.splice(itemIndex, 1);
    libraryStore.library.items = newItems;

    toast.add({
      title: "Recipe Removed",
      description: "Recipe has been removed from your library",
      icon: "i-heroicons-check-circle",
      color: "green",
      timeout: 3000,
    });
  }
};

const confirmClear = () => {
  isConfirmModalOpen.value = true;
};

const clearLibrary = () => {
  libraryStore.clearLibrary();
  isConfirmModalOpen.value = false;

  toast.add({
    title: "Library Cleared",
    description: "All recipes have been removed from your library",
    icon: "i-heroicons-check-circle",
    color: "green",
    timeout: 3000,
  });
};

// Helper function to get a color based on category
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    Dessert: "pink",
    "Main Course": "green",
    Appetizer: "yellow",
    Breakfast: "orange",
    Snack: "blue",
    Soup: "indigo",
    Salad: "emerald",
    Beverage: "purple",
  };

  return colorMap[category] || "gray";
};
</script>
