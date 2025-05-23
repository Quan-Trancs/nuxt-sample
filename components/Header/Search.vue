<template>
  <UForm class="flex items-stretch h-10" :state="formState" @submit="onSubmit">
    <!-- Category Select -->
    <USelect
      v-model="formState.category"
      :items="categories"
      option-attribute="label"
      name="category"
      class="w-40 h-full"
      :ui="{
        base: 'bg-gray-100 text-black border-r border-gray-300 rounded-l-md rounded-r-none',
      }"
    />

    <!-- Search Input -->
    <UInput
      v-model="formState.q"
      name="q"
      type="search"
      :placeholder="`Search Site ${APP_NAME}`"
      class="flex-1 h-full"
      size="xl"
      :ui="{
        base: 'bg-gray-100 text-black rounded-none',
      }"
    />

    <!-- Submit Button -->
    <UButton
      type="submit"
      icon="i-heroicons-magnifying-glass"
      class="rounded-s-none rounded-e-md h-full px-3"
      color="primary"
    />
  </UForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { APP_NAME } from '@/lib/constants'

const categories = [
  { label: 'All', value: 'All' },
  { label: 'Appetizers', value: 'Appetizers' },
  { label: 'Main Dishes', value: 'Main Dishes' },
  { label: 'Desserts', value: 'Desserts' },
  { label: 'Soups & Stews', value: 'Soups & Stews' },
  { label: 'Salads', value: 'Salads' },
  { label: 'Beverages', value: 'Beverages' },
  { label: 'Snacks', value: 'Snacks' },
  { label: 'Breakfast', value: 'Breakfast' },
  { label: 'Vegan', value: 'Vegan' },
  { label: 'Gluten-Free', value: 'Gluten-Free' },
]

const formState = ref({
  category: 'All',
  q: '',
})

const router = useRouter()

const onSubmit = ({ data }: { data: typeof formState.value }) => {
  const params = new URLSearchParams({
    category: data.category,
    q: data.q,
  })
  router.push(`/search?${params.toString()}`)
}
</script>
