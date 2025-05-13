<template>
  <div>
    <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-md mb-4">
      <h3 class="font-bold text-lg">Something went wrong</h3>
      <p>{{ error.message || "An unknown error occurred" }}</p>
      <UButton class="mt-3" size="sm" @click="resetError">Try Again</UButton>
    </div>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";

const error = ref<Error | null>(null);

onErrorCaptured((err) => {
  error.value = err;
  return false; // Prevent error from propagating further
});

const resetError = () => {
  error.value = null;
};

defineExpose({
  resetError,
});
</script>
