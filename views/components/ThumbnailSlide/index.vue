<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="thumbnail-slide"
    :style="{
      width: size + 'px',
      height: size * viewportRatio + 'px',
    }"
  >
    <div
      v-if="visible"
      class="elements"
      :style="{
        width: viewportSize + 'px',
        height: viewportSize * viewportRatio + 'px',
        transform: `scale(${scale})`,
      }"
    >
      <div class="background" :style="backgroundStyle" />
      <ThumbnailElement
        v-for="(element, index) in slide.elements"
        :key="element.id"
        :element-info="element"
        :element-index="index + 1"
      />
    </div>
    <div v-else class="placeholder">加载中 ...</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue'
import { storeToRefs } from 'pinia'
import type { Slide } from '@/types/slides'
import { injectKeySlideScale } from '@/types/injectKey'
import useSlideBackgroundStyle from '@/hooks/useSlideBackgroundStyle'

import ThumbnailElement from './ThumbnailElement.vue'

const props = withDefaults(
  defineProps<{
    slide: Slide
    size: number
    visible?: boolean
  }>(),
  {
    visible: true,
  }
)

const { viewportRatio, viewportSize } = storeToRefs(useSlidesStore())

const background = computed(() => props.slide.background)
const { backgroundStyle } = useSlideBackgroundStyle(background)

const scale = computed(() => props.size / viewportSize.value)
provide(injectKeySlideScale, scale)
</script>

<style lang="scss" scoped>
.thumbnail-slide {
  background-color: #fff;
  overflow: hidden;
  user-select: none;
}
.elements {
  transform-origin: 0 0;
}
.background {
  width: 100%;
  height: 100%;
  background-position: center;
  position: absolute;
}
.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
