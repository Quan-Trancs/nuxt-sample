<template>
  <footer class="bg-black text-white underline-link">
    <div class="w-full">
      <UButton
        variant="ghost"
        class="bg-gray-800 rounded-none"
        :ui="{
          base: 'w-full justify-center',
        }"
        @click="scrollToTop"
      >
        <!-- Replace Lucide Icon with Nuxt Icon -->
        <Icon name="material-symbols:keyboard-arrow-up" size="30" />
        Back to top
      </UButton>
    </div>

    <div class="p-4">
      <div class="flex justify-center gap-3 text-sm">
        <NuxtLink to="/conditions-of-use">Conditions of Use</NuxtLink>
        <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>
        <NuxtLink to="/help">Help</NuxtLink>
      </div>

      <div class="flex justify-center text-sm">
        <p>© {{ currentYear }} {{ appName }}</p>
      </div>

      <div class="mt-8 flex justify-center text-sm text-gray-400">
        123 Example Street, Sample City, ST, Zip 12345 | +1 (123) 456-7890
      </div>
    </div>
  </footer>
</template>

<script setup>
import { APP_NAME } from '@/lib/constants'

import { useSafeWindow } from '@/composables/useSafeWindow'

// Computed properties
const currentYear = new Date().getFullYear()
const appName = APP_NAME

const { safeScrollTo } = useSafeWindow()

// Methods
const scrollToTop = () => {
  safeScrollTo({ top: 0, behavior: 'smooth' })
}
</script>
