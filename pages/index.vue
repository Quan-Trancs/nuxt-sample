<script setup lang="ts">
import data from "@/lib/data";
import { toSlug } from "@/utils";
import {
  getAllCategories,
  getRecipesForCard,
  getRecipesByTag,
} from "~/composables/actions/recipe.actions";
import type { IRecipeInput, Item } from "~/types";

const categories = ref<string[]>([]);
const latestRecipes = ref<Item[]>([]);
const mostPickedRecipes = ref<Item[]>([]);
const featureds = ref<Item[]>([]);
const todaysRecipes = ref<IRecipeInput[]>([]);
const balancedRecipes = ref<IRecipeInput[]>([]);

// Loading states
const isLoading = ref({
  categories: true,
  latestRecipes: true,
  featureds: true,
  mostPickedRecipes: true,
  todaysRecipes: true,
  balancedRecipes: true,
});

// Fetch data with proper error handling
const fetchData = async () => {
  try {
    isLoading.value.categories = true;
    categories.value = getAllCategories().slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  } finally {
    isLoading.value.categories = false;
  }

  try {
    isLoading.value.latestRecipes = true;
    latestRecipes.value = await getRecipesForCard({
      tag: "new-arrival",
      limit: 4,
    });
  } catch (error) {
    console.error("Failed to fetch latest recipes:", error);
  } finally {
    isLoading.value.latestRecipes = false;
  }

  try {
    isLoading.value.featureds = true;
    featureds.value = await getRecipesForCard({ tag: "featured", limit: 4 });
  } catch (error) {
    console.error("Failed to fetch featured recipes:", error);
  } finally {
    isLoading.value.featureds = false;
  }

  try {
    isLoading.value.mostPickedRecipes = true;
    mostPickedRecipes.value = await getRecipesForCard({
      tag: "most-picked",
      limit: 4,
    });
  } catch (error) {
    console.error("Failed to fetch most picked recipes:", error);
  } finally {
    isLoading.value.mostPickedRecipes = false;
  }

  try {
    isLoading.value.todaysRecipes = true;
    todaysRecipes.value = getRecipesByTag("todays-recipe");
  } catch (error) {
    console.error("Failed to fetch today's recipes:", error);
  } finally {
    isLoading.value.todaysRecipes = false;
  }

  try {
    isLoading.value.balancedRecipes = true;
    balancedRecipes.value = getRecipesByTag("balanced-recipe");
  } catch (error) {
    console.error("Failed to fetch balanced recipes:", error);
  } finally {
    isLoading.value.balancedRecipes = false;
  }
};

// Fetch data on component mount
onMounted(fetchData);

const cards = computed(() => [
  {
    title: "Categories to explore",
    link: {
      text: "See More",
      href: "/search",
    },
    items: categories.value.map((category) => ({
      name: category,
      image: `/images/${toSlug(category)}.jpg`,
      href: `/search?category=${category}`,
    })),
  },
  {
    title: "Latest Recipes",
    items: latestRecipes.value,
    link: {
      text: "View All",
      href: "/search?tag=new-arrival",
    },
  },
  {
    title: "Most Popular",
    items: mostPickedRecipes.value,
    link: {
      text: "View All",
      href: "/search?tag=most-picked",
    },
  },
  {
    title: "Featured Recipes",
    items: featureds.value,
    link: {
      text: "View All",
      href: "/search?tag=featured",
    },
  },
]);
</script>

<template>
  <div>
    <RecipeErrorBoundary>
      <HomeCarousel :items="data.carousels" />
    </RecipeErrorBoundary>

    <div class="md:p-4 md:space-y-4 bg-border mt-10">
      <RecipeErrorBoundary>
        <HomeCard :cards="cards" />
      </RecipeErrorBoundary>

      <UCard class="w-full rounded-none">
        <template #header><p class="font-bold">Today's Recipes</p> </template>
        <RecipeErrorBoundary>
          <RecipeSlider :recipes="todaysRecipes" />
        </RecipeErrorBoundary>
      </UCard>

      <UCard class="w-full rounded-none">
        <template #header><p class="font-bold">Balanced Choices</p> </template>
        <RecipeErrorBoundary>
          <RecipeSlider
            :recipes="balancedRecipes"
            :hide-details="false"
            :hide-borders="true"
          />
        </RecipeErrorBoundary>
      </UCard>
    </div>
    <div class="p-4 bg-background">
      <RecipeErrorBoundary>
        <RecipeBrowsingHistoryList />
      </RecipeErrorBoundary>
    </div>
  </div>
</template>
