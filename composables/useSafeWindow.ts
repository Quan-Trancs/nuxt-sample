import { ref, onMounted } from "vue";

export const useSafeWindow = () => {
  const isMounted = ref(false);

  onMounted(() => {
    isMounted.value = true;
  });

  const safeScrollTo = (options: ScrollToOptions) => {
    if (isMounted.value && typeof window !== "undefined") {
      try {
        window.scrollTo(options);
      } catch (e) {
        console.error("Error scrolling:", e);
      }
    }
  };

  const getWindowLocation = () => {
    if (isMounted.value && typeof window !== "undefined") {
      return window.location;
    }
    return null;
  };

  return {
    isMounted,
    safeScrollTo,
    getWindowLocation,
  };
};
