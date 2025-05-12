<script setup lang="ts">
import { APP_NAME } from '~/lib/constants'
import data from '~/lib/data'
</script>

<template>
  <header class="bg-[#131921] text-white">
    <UContainer class="px-2">
      <!-- Top Row: Logo + Search + Menu -->
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <!-- Logo and Title -->
          <NuxtLink
            to="/"
            class="flex items-center header-button font-extrabold text-2xl m-1"
          >
            <img src="/favicon.ico" alt="Logo" width="40" height="40" />
            {{ APP_NAME }}
          </NuxtLink>
        </div>
        <!-- Desktop Search -->
        <div class="hidden md:block flex-1 max-w-xl">
          <HeaderSearch />
        </div>

        <!-- Right Side Menu -->
        <HeaderMenu />
      </div>

      <!-- Mobile Search -->
      <div class="md:hidden block py-2">
        <HeaderSearch />
      </div>
    </UContainer>

    <!-- Secondary Navigation -->
    <div class="flex items-center px-3 mb-[1px] bg-[#232f3e]">
      <UButton
        variant="ghost"
        color="neutral"
        class="flex items-center gap-1 text-base [&_svg]:size-6 dark header-button"
        icon="i-heroicons-bars-3"
      >
        All
      </UButton>
      <div
        class="flex items-center flex-wrap gap-3 overflow-hidden max-h-[42px]"
      >
        <NuxtLink
          v-for="menu in data.headerMenus"
          :key="menu.href"
          :to="menu.href"
          class="header-button !p-2"
        >
          {{ menu.name }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
