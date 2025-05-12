<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '#imports'
import {
  getAllRecipes,
  getAllCategories,
  getAllTags,
} from '@/composables/actions/recipe.actions'
import { getFilterUrl, toSlug } from '@/utils'

// Static sort orders and price ranges
const sortOrders = [
  { value: 'popularity', name: 'Most popular' },
  { value: 'prep-time-asc', name: 'Prep time: Low to high' },
  { value: 'prep-time-desc', name: 'Prep time: High to low' },
  { value: 'newest-arrivals', name: 'Newest recipes' },
  { value: 'best reviews', name: 'Avg. customer review' },
  { value: 'difficulty', name: 'Easiest to hardest' },
  { value: 'calories-asc', name: 'Calories: Low to high' },
  { value: 'calories-desc', name: 'Calories: High to low' },
]

// Read query parameters
const route = useRoute()
const router = useRouter()

const q = computed(() =>
  typeof route.query.q === 'string' ? route.query.q : 'all'
)
const tag = computed(() =>
  typeof route.query.tag === 'string' ? route.query.tag : 'all'
)
const category = computed(() =>
  typeof route.query.category === 'string' ? route.query.category : 'all'
)
const rating = computed(() =>
  typeof route.query.rating === 'string' ? route.query.rating : 'all'
)
const sort = computed(() =>
  typeof route.query.sort === 'string' ? route.query.sort : 'best-selling'
)
const page = computed(() => Number(route.query.page || '1'))

const params = computed(() => ({
  q: q.value,
  tag: tag.value,
  category: category.value,
  rating: rating.value,
  sort: sort.value,
  pageString: page.value.toString(),
}))
const recipesData = ref(
  getAllRecipes({
    query: q.value,
    category: category.value,
    tag: tag.value,
    rating: rating.value,
    sort: sort.value,
    page: page.value,
  })
)
const categories = ref(getAllCategories())
const tags = ref(getAllTags())

watch(
  () => [
    q.value,
    tag.value,
    category.value,
    rating.value,
    sort.value,
    page.value,
  ],
  async () => {
    recipesData.value = getAllRecipes({
      query: q.value,
      category: category.value,
      tag: tag.value,
      rating: rating.value,
      sort: sort.value,
      page: page.value,
    })
  },
  { immediate: false }
)
// Metadata
useHead({
  title: computed(() =>
    q.value !== 'all' ||
    category.value !== 'all' ||
    tag.value !== 'all' ||
    rating.value !== 'all'
      ? `Recipes : ${q.value}`
      : 'All Recipes'
  ),
})
</script>

<template>
  <div>
    <div class="p-2 md:border-b flex-between flex-col md:flex-row">
      <div class="flex items-center">
        {{
          recipesData?.totalRecipes === 0
            ? 'No'
            : `${recipesData?.from}-${recipesData?.to} of ${recipesData?.totalRecipes}`
        }}
        results

        <template
          v-if="
            q !== 'all' ||
            category !== 'all' ||
            tag !== 'all' ||
            rating !== 'all'
          "
        >
          for
          <span v-if="q !== 'all'">"{{ q }}"</span>

          <UButton variant="link" @click="router.push('/search')">
            Clear
          </UButton>
        </template>
      </div>
      <div>
        <!-- Replace with a Nuxt UI dropdown component or your own -->
        <select
          v-model="params.sort"
          class="p-2 border rounded-md bg-slate-900"
          @change="router.push(getFilterUrl({ sort: params.sort, params }))"
        >
          <option
            v-for="order in sortOrders"
            :key="order.value"
            :value="order.value"
          >
            {{ order.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="grid md:grid-cols-5 md:gap-4">
      <!-- Filters sidebar -->
      <div class="space-y-4 p-2">
        <!-- Department filter -->
        <div>
          <div class="font-bold">Department</div>
          <ul>
            <li>
              <NuxtLink
                :to="getFilterUrl({ category: 'all', params })"
                :class="{ 'text-primary': category === 'all' }"
              >
                All
              </NuxtLink>
            </li>
            <li v-for="c in categories" :key="c">
              <NuxtLink
                :to="getFilterUrl({ category: c, params })"
                :class="{ 'text-primary': c === category }"
              >
                {{ c }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Price filter -->
        <div>
          <div class="font-bold">Price</div>
          <ul>
            <li>
              <NuxtLink :to="getFilterUrl({ params })" class="text-primary">
                All
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Rating filter -->
        <div>
          <div class="font-bold">Customer Review</div>
          <ul>
            <li>
              <NuxtLink
                :to="getFilterUrl({ rating: 'all', params })"
                :class="{ 'text-primary': rating === 'all' }"
              >
                All
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="getFilterUrl({ rating: '4', params })"
                :class="{ 'text-primary': rating === '4' }"
              >
                <div class="flex"><Rating size="4" :rating="4" /> & Up</div>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Tag filter -->
        <div>
          <div class="font-bold">Tag</div>
          <ul>
            <li>
              <NuxtLink
                :to="getFilterUrl({ tag: 'all', params })"
                :class="{ 'text-primary': tag === 'all' }"
              >
                All
              </NuxtLink>
            </li>
            <li v-for="t in tags" :key="t">
              <NuxtLink
                :to="getFilterUrl({ tag: t, params })"
                :class="{ 'text-primary': toSlug(t) === tag }"
              >
                {{ t }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Products section -->
      <div class="md:col-span-4 space-y-4">
        <div class="my-7">
          <div class="font-bold text-xl">Results</div>
          <div class="text-gray-300">
            Check each product page for other buying options
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div v-if="recipesData?.slicedRecipes?.length === 0">
            No product found
          </div>
          <RecipeCard
            v-for="recipe in recipesData?.slicedRecipes"
            :key="recipe.id"
            :recipe="recipe"
          />
        </div>

        <div class="flex justify-center mt-4">
          <UPagination
            v-model:page="page"
            :items-per-page="20"
            :total="recipesData.totalRecipes"
            size="xl"
          />
        </div>
      </div>
    </div>
  </div>
</template>
