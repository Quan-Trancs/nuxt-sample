<template>
  <div
    class="screen-slide"
    :style="{
      width: viewportSize + 'px',
      height: viewportSize * viewportRatio + 'px',
      transform: `scale(${scale})`,
    }"
  >
    <div class="background" :style="{ ...backgroundStyle }" />
    <ScreenElement
      v-for="(element, index) in slide.elements"
      :key="element.id"
      :element-info="element"
      :element-index="index + 1"
      :animation-index="animationIndex"
      :turn-slide-to-id="turnSlideToId"
      :manual-exit-fullscreen="manualExitFullscreen"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue'
import { storeToRefs } from 'pinia'

import type { Slide } from '@/types/slides'
import { injectKeySlideId } from '@/types/injectKey'
import useSlideBackgroundStyle from '@/hooks/useSlideBackgroundStyle'

import ScreenElement from './ScreenElement.vue'

const props = defineProps<{
  slide: Slide
  scale: number
  animationIndex: number
  turnSlideToId: (id: string) => void
  manualExitFullscreen: () => void
}>()

const { viewportRatio, viewportSize } = storeToRefs(useSlidesStore())

const background = computed(() => props.slide.background)
const { backgroundStyle } = useSlideBackgroundStyle(background)

const slideId = computed(() => props.slide.id)
provide(injectKeySlideId, slideId)
</script>

<style lang="scss" scoped>
.screen-slide {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
  overflow: hidden;
}
.background {
  width: 100%;
  height: 100%;
  background-position: center;
  position: absolute;
}
</style>
