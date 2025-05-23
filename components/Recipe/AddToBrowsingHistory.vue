<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps<{
  id: string
  category: string
}>()

const historyStore = useBrowsingHistoryStore()

onMounted(() => {
  historyStore.addItem({ id: props.id, category: props.category })
})
</script>

<template>
  <div style="display: none" />
</template>
