<template>
  <NuxtLink to="/library" class="header-button px-1">
    <div class="flex items-end text-xs relative">
      <Icon name="material-symbols:bookmark" size="30" />
      <span
        v-if="isMounted"
        :class="[
          'bg-[#131921] px-1 rounded-full text-primary font-bold absolute right-[30px] top-[-4px] z-10',
          libraryItemsCount >= 10 ? 'text-sm px-0 p-[1px]' : 'text-base',
        ]"
      >
        {{ libraryItemsCount }}
      </span>
      <span class="font-bold">Library</span>
    </div>
  </NuxtLink>
</template>

<script setup>
import { ref } from 'vue'
const libraryItemsCount = 0
const isMounted = ref(true)
</script>
