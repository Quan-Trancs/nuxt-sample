<template>
  <div class="flex gap-2 items-center">
    <UDropdownMenu
      :items="items"
      :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 2,
      }"
      :ui="{
        content: 'w-48',
      }"
    >
      <template #default>
        <div class="flex items-center header-button cursor-pointer">
          <div class="flex flex-col text-xs text-left">
            <span>Hello, John Doe</span>
            <span class="font-bold">Account & Library</span>
          </div>
          <UIcon
            name="i-heroicons-chevron-down"
            class="self-end p-0 text-gray-500"
          />
        </div>
      </template>
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const items = [
  [
    {
      label: 'John Doe',
      slot: 'account-info',
      disabled: true,
    },
    {
      label: 'johnDoe@example.com',
      disabled: true,
    },
  ],
  [
    {
      label: 'Your account',
      icon: 'i-heroicons-user',
      click: () => router.push('/account'),
    },
  ],
  [
    {
      label: 'Your library',
      icon: 'i-heroicons-clipboard-document-check',
      click: () => router.push('/library'),
    },
  ],
  [
    {
      label: 'Admin',
      icon: 'i-heroicons-cog-6-tooth',
      click: () => router.push('/admin/overview'),
    },
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: () => router.push('/signout'),
    },
  ],
]
</script>
