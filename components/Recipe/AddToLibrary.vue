<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLibraryStore } from '@/stores/library'
import type { LibraryItem } from '~/types'

const props = defineProps<{
  item: LibraryItem
  minimal?: boolean
}>()

const router = useRouter()
const toast = useToast()
const library = useLibraryStore()

// Compute whether the item is already in library
const isInLibrary = computed(() => {
  return library.isInLibrary(props.item.recipeId)
})

const addToLibrary = async () => {
  try {
    library.addItem(props.item)

    toast.add({
      title: 'Success',
      description: 'Item added to your library.',
      icon: 'i-heroicons-check-circle',
      actions: [
        {
          label: 'View Library',
          onClick: () => {
            router.push('/library')
          },
        },
      ],
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to add item.'

    toast.add({
      title: 'Error',
      description: message,
      color: 'error',
      icon: 'i-heroicons-x-circle',
    })
  }
}

const removeFromLibrary = async () => {
  try {
    library.removeItem(props.item.recipeId)

    toast.add({
      title: 'Removed',
      description: 'Item removed from your library.',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to remove item.'

    toast.add({
      title: 'Error',
      description: message,
      color: 'error',
      icon: 'i-heroicons-x-circle',
    })
  }
}

// Toggle function that handles both adding and removing
const toggleLibraryItem = () => {
  if (isInLibrary.value) {
    removeFromLibrary()
  } else {
    addToLibrary()
  }
}
</script>

<template>
  <!-- Minimal version (for recipe cards) -->
  <UButton
    v-if="minimal"
    :color="isInLibrary ? 'error' : 'success'"
    :icon="
      isInLibrary
        ? 'material-symbols:bookmark-remove'
        : 'material-symbols:bookmark-add-sharp'
    "
    size="sm"
    variant="ghost"
    @click.prevent="toggleLibraryItem"
    :title="isInLibrary ? 'Remove from library' : 'Add to library'"
  />

  <!-- Full version (for recipe details page) -->
  <UButton
    v-else
    :color="isInLibrary ? 'error' : 'success'"
    :icon="
      isInLibrary
        ? 'material-symbols:bookmark-remove'
        : 'material-symbols:bookmark-add-sharp'
    "
    :variant="isInLibrary ? 'soft' : 'solid'"
    @click="toggleLibraryItem"
  >
    {{ isInLibrary ? 'Remove from Library' : 'Add to Library' }}
  </UButton>
</template>
