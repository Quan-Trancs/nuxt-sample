<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
class="editable-element-chart"
    :class="{ 'lock': elementInfo.lock }"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
    }"
  >
    <div
      class="rotate-wrapper"
      :style="{ transform: `rotate(${elementInfo.rotate}deg)` }"
    >
      <div 
        v-contextmenu="contextmenus" 
        class="element-content"
        :style="{
          backgroundColor: elementInfo.fill,
        }"
        @mousedown="$event => handleSelectElement($event)"
        @touchstart="$event => handleSelectElement($event)"
        @dblclick="openDataEditor()"
      >
        <ElementOutline
          :width="elementInfo.width"
          :height="elementInfo.height"
          :outline="elementInfo.outline"
        />
        <Chart
          :width="elementInfo.width"
          :height="elementInfo.height"
          :type="elementInfo.chartType"
          :data="elementInfo.data"
          :theme-colors="elementInfo.themeColors"
          :text-color="elementInfo.textColor"
          :options="elementInfo.options"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PPTChartElement } from '@/types/slides'
import type { ContextmenuItem } from '@/components/Contextmenu/types'
import emitter, { EmitterEvents } from '@/utils/emitter'

import ElementOutline from '@/views/components/element/ElementOutline.vue'
import Chart from './Chart.vue'

const props = defineProps<{
  elementInfo: PPTChartElement
  selectElement: (e: MouseEvent | TouchEvent, element: PPTChartElement, canMove?: boolean) => void
  contextmenus: () => ContextmenuItem[] | null
}>()

const handleSelectElement = (e: MouseEvent | TouchEvent) => {
  if (props.elementInfo.lock) return
  e.stopPropagation()

  props.selectElement(e, props.elementInfo)
}

const openDataEditor = () => {
  emitter.emit(EmitterEvents.OPEN_CHART_DATA_EDITOR)
}
</script>

<style lang="scss" scoped>
.editable-element-chart {
  position: absolute;

  &.lock .element-content {
    cursor: default;
  }
}
.rotate-wrapper {
  width: 100%;
  height: 100%;
}
.element-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: move;
}
</style>
