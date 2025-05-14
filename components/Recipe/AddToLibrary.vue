<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLibraryStore } from '@/stores/library'
import type { LibraryItem } from '~/types'

const props = defineProps<{
  item: LibraryItem
}>()

const router = useRouter()
const toast = useToast()
const library = useLibraryStore()

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
</script>

<template>
  <UButton
    color="primary"
    icon="material-symbols:bookmark-add-sharp"
    @click.prevent="addToLibrary"
  />
</template>
