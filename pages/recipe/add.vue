<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "@nuxt/ui";
import { RecipeInputSchema } from "@/lib/validator";
import { generateId, toSlug, formatError } from "@/utils";
import type { IRecipeInput } from "@/types";

const router = useRouter();
const toast = useToast();

// Form state
const formState = reactive<Partial<IRecipeInput>>({
  id: generateId(),
  name: "",
  slug: "",
  category: "",
  description: "",
  images: [],
  ingredients: [""],
  instructions: [""],
  prepTimeMinutes: 0,
  cookTimeMinutes: 0,
  servings: 1,
  difficulty: "EASY",
  cuisine: "",
  caloriesPerServing: 0,
  isPublished: false,
  tags: [],
  avgRating: 0,
  numReviews: 0,
  ratingDistribution: [],
  reviews: [],
});

// Form validation
const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

// Update slug when name changes
const updateSlug = () => {
  if (formState.name) {
    formState.slug = toSlug(formState.name);
  }
};

// Add more ingredient fields
const addIngredient = () => {
  if (!formState.ingredients) {
    formState.ingredients = [""];
  } else {
    formState.ingredients.push("");
  }
};

// Remove ingredient field
const removeIngredient = (index: number) => {
  if (formState.ingredients && formState.ingredients.length > 1) {
    formState.ingredients.splice(index, 1);
  }
};

// Add more instruction fields
const addInstruction = () => {
  if (!formState.instructions) {
    formState.instructions = [""];
  } else {
    formState.instructions.push("");
  }
};

// Remove instruction field
const removeInstruction = (index: number) => {
  if (formState.instructions && formState.instructions.length > 1) {
    formState.instructions.splice(index, 1);
  }
};

// Handle tag input
const tagInput = ref("");
const addTag = () => {
  if (tagInput.value && tagInput.value.trim()) {
    if (!formState.tags) {
      formState.tags = [];
    }
    // Check if tag already exists
    if (!formState.tags.includes(tagInput.value.trim())) {
      formState.tags.push(tagInput.value.trim());
    }
    tagInput.value = "";
  }
};

const removeTag = (tag: string) => {
  if (formState.tags) {
    const index = formState.tags.indexOf(tag);
    if (index !== -1) {
      formState.tags.splice(index, 1);
    }
  }
};

// Handle form submission
const submitForm = async () => {
  try {
    isSubmitting.value = true;
    errors.value = {};

    // Basic validation
    if (!formState.name) {
      errors.value.name = "Recipe name is required";
    }
    if (!formState.category) {
      errors.value.category = "Category is required";
    }
    if (!formState.description) {
      errors.value.description = "Description is required";
    }
    if (!formState.images || formState.images.length === 0) {
      errors.value.images = "At least one image is required";
    }
    if (Object.keys(errors.value).length > 0) {
      throw new Error("Please correct the errors in the form");
    }

    // Validate with Zod schema
    const validatedRecipe = RecipeInputSchema.parse(formState);

    // Here we would typically make an API call to save the recipe
    // For now, we'll just show a success message and redirect
    console.log("Recipe submitted:", validatedRecipe);

    toast.add({
      title: "Success!",
      description: "Recipe has been created successfully.",
      icon: "i-heroicons-check-circle",
      color: "green",
    });

    // Redirect to the recipe page
    router.push(`/recipe/${formState.slug}`);
  } catch (error) {
    const errorMessage = formatError(error);
    toast.add({
      title: "Error",
      description: errorMessage,
      icon: "i-heroicons-x-circle",
      color: "red",
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Categories for selection
const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Appetizer",
  "Salad",
  "Soup",
  "Beverage",
  "Smoothie",
  "Baked Goods",
];

// Difficulty levels for selection
const difficultyLevels = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

// Handle media upload success
const handleMediaUploadSuccess = (urls: string[]) => {
  if (!formState.images) {
    formState.images = [];
  }
  formState.images = [...formState.images, ...urls];
};
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <UBreadcrumb
      :links="[
        { label: 'Home', to: '/' },
        { label: 'Add Recipe', to: '/recipe/add' },
      ]"
      class="mb-6"
    />

    <h1 class="text-3xl font-bold mb-6">Add New Recipe</h1>

    <form @submit.prevent="submitForm" class="space-y-8">
      <!-- Basic Information Section -->
      <UCard class="p-6">
        <template #header>
          <div class="px-4 py-5 sm:px-6">
            <h2 class="text-xl font-semibold">Basic Information</h2>
            <p class="mt-1 text-sm text-gray-500">
              Add the basic details about your recipe.
            </p>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Recipe Name -->
          <UFormGroup label="Recipe Name" :error="errors.name" required>
            <UInput
              v-model="formState.name"
              @blur="updateSlug"
              placeholder="Enter recipe name"
            />
          </UFormGroup>

          <!-- Recipe Slug -->
          <UFormGroup label="Recipe URL Slug" :error="errors.slug" required>
            <UInput
              v-model="formState.slug"
              placeholder="recipe-url-slug"
              hint="This will be used in the URL. Automatically generated from recipe name."
            />
          </UFormGroup>

          <!-- Category -->
          <UFormGroup label="Category" :error="errors.category" required>
            <USelectMenu
              v-model="formState.category"
              :options="categories"
              placeholder="Select a category"
            />
          </UFormGroup>

          <!-- Cuisine -->
          <UFormGroup label="Cuisine" :error="errors.cuisine" required>
            <UInput
              v-model="formState.cuisine"
              placeholder="e.g., Italian, Mexican, Chinese"
            />
          </UFormGroup>

          <!-- Description -->
          <UFormGroup label="Description" :error="errors.description" required>
            <UTextarea
              v-model="formState.description"
              placeholder="Describe your recipe"
              rows="4"
            />
          </UFormGroup>

          <!-- Tags -->
          <UFormGroup label="Tags" :error="errors.tags">
            <div class="flex flex-wrap gap-2 mb-2">
              <UBadge
                v-for="tag in formState.tags"
                :key="tag"
                color="blue"
                class="mr-2 mb-2"
              >
                {{ tag }}
                <button type="button" class="ml-1" @click="removeTag(tag)">
                  ×
                </button>
              </UBadge>
            </div>
            <div class="flex">
              <UInput
                v-model="tagInput"
                placeholder="Add a tag"
                @keyup.enter.prevent="addTag"
                class="mr-2"
              />
              <UButton
                type="button"
                color="blue"
                variant="soft"
                @click="addTag"
              >
                Add
              </UButton>
            </div>
          </UFormGroup>

          <!-- Difficulty -->
          <UFormGroup label="Difficulty" :error="errors.difficulty" required>
            <URadioGroup
              v-model="formState.difficulty"
              :options="difficultyLevels"
              orientation="horizontal"
            />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Recipe Details Section -->
      <UCard class="p-6">
        <template #header>
          <div class="px-4 py-5 sm:px-6">
            <h2 class="text-xl font-semibold">Recipe Details</h2>
            <p class="mt-1 text-sm text-gray-500">
              Add preparation details and nutritional information.
            </p>
          </div>
        </template>

        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Prep Time -->
            <UFormGroup
              label="Prep Time (minutes)"
              :error="errors.prepTimeMinutes"
              required
            >
              <UInput
                v-model.number="formState.prepTimeMinutes"
                type="number"
                min="0"
              />
            </UFormGroup>

            <!-- Cook Time -->
            <UFormGroup
              label="Cook Time (minutes)"
              :error="errors.cookTimeMinutes"
              required
            >
              <UInput
                v-model.number="formState.cookTimeMinutes"
                type="number"
                min="0"
              />
            </UFormGroup>

            <!-- Servings -->
            <UFormGroup label="Servings" :error="errors.servings" required>
              <UInput
                v-model.number="formState.servings"
                type="number"
                min="1"
              />
            </UFormGroup>
          </div>

          <!-- Calories -->
          <UFormGroup
            label="Calories per Serving"
            :error="errors.caloriesPerServing"
          >
            <UInput
              v-model.number="formState.caloriesPerServing"
              type="number"
              min="0"
              placeholder="e.g., 350"
            />
          </UFormGroup>

          <!-- Ingredients -->
          <UFormGroup label="Ingredients" :error="errors.ingredients" required>
            <div
              v-for="(ingredient, index) in formState.ingredients"
              :key="`ingredient-${index}`"
              class="flex mb-2"
            >
              <UInput
                v-model="formState.ingredients[index]"
                placeholder="e.g., 2 tablespoons olive oil"
                class="flex-grow"
              />
              <UButton
                v-if="formState.ingredients && formState.ingredients.length > 1"
                type="button"
                color="red"
                variant="soft"
                icon="i-heroicons-trash"
                class="ml-2"
                @click="removeIngredient(index)"
              />
            </div>
            <UButton
              type="button"
              color="gray"
              variant="soft"
              class="mt-2"
              @click="addIngredient"
            >
              Add Ingredient
            </UButton>
          </UFormGroup>

          <!-- Instructions -->
          <UFormGroup
            label="Instructions"
            :error="errors.instructions"
            required
          >
            <div
              v-for="(instruction, index) in formState.instructions"
              :key="`instruction-${index}`"
              class="flex mb-2"
            >
              <div class="flex-grow">
                <div class="flex items-center">
                  <span
                    class="flex items-center justify-center bg-dodgeroll-gold-500 w-7 h-7 rounded-full text-white text-lg font-bold mr-2"
                  >
                    {{ index + 1 }}
                  </span>
                  <UTextarea
                    v-model="formState.instructions[index]"
                    placeholder="Describe this step..."
                    rows="2"
                    class="flex-grow"
                  />
                </div>
              </div>
              <UButton
                v-if="
                  formState.instructions && formState.instructions.length > 1
                "
                type="button"
                color="red"
                variant="soft"
                icon="i-heroicons-trash"
                class="ml-2 self-start mt-2"
                @click="removeInstruction(index)"
              />
            </div>
            <UButton
              type="button"
              color="gray"
              variant="soft"
              class="mt-2"
              @click="addInstruction"
            >
              Add Instruction
            </UButton>
          </UFormGroup>
        </div>
      </UCard>

      <!-- Media Upload Section -->
      <UCard class="p-6">
        <template #header>
          <div class="px-4 py-5 sm:px-6">
            <h2 class="text-xl font-semibold">Recipe Images</h2>
            <p class="mt-1 text-sm text-gray-500">
              Upload images of your recipe. At least one image is required.
            </p>
          </div>
        </template>

        <div class="space-y-6">
          <UFormGroup label="Images" :error="errors.images" required>
            <RecipeMediaUpload @upload-success="handleMediaUploadSuccess" />
          </UFormGroup>

          <!-- Preview Current Images -->
          <div v-if="formState.images && formState.images.length > 0">
            <p class="font-semibold mb-2">Current Images</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div
                v-for="(image, index) in formState.images"
                :key="index"
                class="relative"
              >
                <NuxtImg
                  :src="image"
                  width="150"
                  height="150"
                  class="object-cover rounded-lg h-32 w-full"
                  alt="Recipe image"
                />
                <UButton
                  type="button"
                  color="red"
                  variant="solid"
                  icon="i-heroicons-trash"
                  size="xs"
                  class="absolute top-1 right-1"
                  @click="formState.images?.splice(index, 1)"
                />
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Publishing Settings -->
      <UCard class="p-6">
        <template #header>
          <div class="px-4 py-5 sm:px-6">
            <h2 class="text-xl font-semibold">Publishing Settings</h2>
            <p class="mt-1 text-sm text-gray-500">
              Choose whether to publish your recipe immediately or save as
              draft.
            </p>
          </div>
        </template>

        <UFormGroup label="Publishing Status">
          <UToggle
            v-model="formState.isPublished"
            :on-icon="'i-heroicons-check'"
            :off-icon="'i-heroicons-x-mark'"
          >
            <template #on>Published</template>
            <template #off>Draft</template>
          </UToggle>
        </UFormGroup>
      </UCard>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-4">
        <UButton
          type="button"
          color="gray"
          variant="soft"
          @click="router.push('/')"
        >
          Cancel
        </UButton>
        <UButton
          type="submit"
          color="green"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          {{ formState.isPublished ? "Publish Recipe" : "Save as Draft" }}
        </UButton>
      </div>
    </form>
  </div>
</template>
