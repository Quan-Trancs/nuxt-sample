<script setup lang="ts">
// Check if user is on the add recipe page to highlight the button
const route = useRoute();
const isActive = computed(() => route.path === "/recipe/add");
</script>

<template>
  <NuxtLink
    to="/recipe/add"
    class="header-button !p-2 flex items-center gap-1"
    :class="{ 'bg-white/10': isActive }"
  >
    <UIcon name="i-heroicons-plus-circle" class="w-5 h-5" />
    Add Recipe
  </NuxtLink>
</template>
