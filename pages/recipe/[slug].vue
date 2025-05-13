<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import {
  getRecipeBySlug,
  getRelatedRecipesByCategory,
} from "~/composables/actions/recipe.actions";

const route = useRoute();
const router = useRouter();

const slug = route.params.slug as string;
const page = Number(route.query.page || "1");

const recipe = getRecipeBySlug(slug);
const loading = ref(true);
const error = ref<string | null>(null);

// If recipe not found, redirect to home page
onMounted(() => {
  loading.value = false;
  if (!recipe) {
    error.value = "Recipe not found";
    setTimeout(() => {
      router.push("/");
    }, 3000);
  }
});

const { data: relatedRecipes } = getRelatedRecipesByCategory({
  category: recipe?.category || "all",
  productId: recipe?.id || "",
  page: page || 1,
});
</script>

<template>
  <div
    v-if="loading"
    class="p-10 flex justify-center items-center min-h-[50vh]"
  >
    <USpinner size="lg" />
  </div>

  <div
    v-else-if="error"
    class="p-10 flex flex-col justify-center items-center min-h-[50vh]"
  >
    <p class="text-xl text-red-500">{{ error }}</p>
    <p class="mt-2">Redirecting to homepage...</p>
  </div>

  <div v-else-if="recipe" class="p-10">
    <RecipeAddToBrowsingHistory :id="recipe.id" :category="recipe.category" />
    <section>
      <div class="grid grid-cols-1 md:grid-cols-5">
        <div class="col-span-2">
          <RecipeGallery :images="recipe.images" />
        </div>
        <div class="flex w-full flex-col gap-2 md:p-5 col-span-1">
          <div class="flex flex-col gap-3">
            <p class="p-medium-16 rounded-full bg-grey-500/10 text-grey-500">
              Category: {{ recipe.category }}
            </p>
            <h1 class="font-bold text-lg lg:text-xl">
              {{ recipe.name }}
            </h1>
            <div class="flex flex-col gap-2">
              <span>{{ recipe.avgRating.toFixed(1) }}</span>
              <RecipeRating :rating="recipe.avgRating" />
              <span>({{ recipe.numReviews }} ratings)</span>
            </div>
            <USeparator />
          </div>

          <div class="flex flex-col gap-2">
            <p class="p-bold-20 text-grey-600">Description:</p>
            <p class="p-medium-16 lg:p-medium-18">
              {{ recipe.description }}
            </p>
          </div>
        </div>
        <div class="mb-8 col-span-2">
          <h2 class="text-3xl font-semibold mb-4 mt-5 flex-between">
            Ingredients
            <RecipeAddToLibrary
              :item="{
                image: recipe.images[0],
                name: recipe.name,
                slug: recipe.slug,
                category: recipe.category,
                recipeId: recipe.id,
              }"
            />
          </h2>
          <ul class="grid grid-cols-1 md:grid-cols-3 gap-2 text-lg">
            <li v-for="ingredient in recipe?.ingredients" :key="ingredient">
              <label class="flex gap-2 items-center">
                <input class="hidden peer" type="checkbox" />
                <div
                  class="relative w-6 h-6 rounded-full border-2 border-dodgeroll-gold-500 flex items-center justify-center peer-checked:after:absolute peer-checked:after:w-4 peer-checked:after:h-4 peer-checked:after:bg-dodgeroll-gold-500 peer-checked:after:rounded-full"
                />
                <span class="peer-checked:line-through">
                  {{ ingredient }}
                </span>
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <h2 class="text-3xl font-medium mb-4">Instructions</h2>
        <ul class="flex flex-col text-lg gap-4">
          <li
            v-for="(instruction, index) in recipe?.instructions"
            :key="instruction"
            class="flex gap-2"
          >
            <span
              class="flex items-center justify-center bg-dodgeroll-gold-500 w-7 h-7 rounded-full text-white text-lg font-bold"
            >
              {{ index + 1 }}
            </span>
            <span class="flex-1">{{ instruction }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="mt-10">
      <p class="font-bold">Best recipes in {{ recipe.category }}</p>
      <RecipeSlider :recipes="relatedRecipes" />
    </section>

    <section>
      <RecipeBrowsingHistoryList class-name="mt-10" />
    </section>
  </div>
</template>
