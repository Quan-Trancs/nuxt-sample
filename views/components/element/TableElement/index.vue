<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    ref="elementRef"
    class="editable-element-table"
    :class="{ lock: elementInfo.lock }"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
    }"
  >
    <div
      class="rotate-wrapper"
      :style="{ transform: `rotate(${elementInfo.rotate}deg)` }"
    >
      <div v-contextmenu="contextmenus" class="element-content">
        <EditableTable
          :data="elementInfo.data"
          :width="elementInfo.width"
          :cell-min-height="elementInfo.cellMinHeight"
          :col-widths="elementInfo.colWidths"
          :outline="elementInfo.outline"
          :theme="elementInfo.theme"
          :editable="editable"
          @mousedown.stop
          @change="(data) => updateTableCells(data)"
          @change-col-widths="(widths) => updateColWidths(widths)"
          @change-selected-cells="(cells) => updateSelectedCells(cells)"
        />
        <div
          v-if="!editable || elementInfo.lock"
          class="table-mask"
          :class="{ lock: elementInfo.lock }"
          @dblclick="startEdit()"
          @mousedown="($event) => handleSelectElement($event)"
          @touchstart="($event) => handleSelectElement($event)"
        >
          <div
            v-if="handleElementId === elementInfo.id"
            class="mask-tip"
            :style="{ transform: `scale(${1 / canvasScale})` }"
          >
            双击编辑
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { PPTTableElement, TableCell } from '@/types/slides'
import type { ContextmenuItem } from '@/components/Contextmenu/types'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import EditableTable from './EditableTable.vue'

const props = defineProps<{
  elementInfo: PPTTableElement
  selectElement: (
    e: MouseEvent | TouchEvent,
    element: PPTTableElement,
    canMove?: boolean
  ) => void
  contextmenus: () => ContextmenuItem[] | null
}>()

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { canvasScale, handleElementId, isScaling } = storeToRefs(mainStore)

const elementRef = ref<HTMLElement>()

const { addHistorySnapshot } = useHistorySnapshot()

const handleSelectElement = (e: MouseEvent | TouchEvent) => {
  if (props.elementInfo.lock) return
  e.stopPropagation()

  props.selectElement(e, props.elementInfo)
}

// 更新表格的可编辑状态，表格处于编辑状态时需要禁用全局快捷键
const editable = ref(false)

watch(handleElementId, () => {
  if (handleElementId.value !== props.elementInfo.id) editable.value = false
})

watch(editable, () => {
  mainStore.setDisableHotkeysState(editable.value)
})

const startEdit = () => {
  if (!props.elementInfo.lock) editable.value = true
}

// 监听表格元素的尺寸变化，当高度变化时，更新高度到vuex
// 如果高度变化时正处在缩放操作中，则等待缩放操作结束后再更新
const realHeightCache = ref(-1)

watch(isScaling, () => {
  if (handleElementId.value !== props.elementInfo.id) return

  if (isScaling.value) editable.value = false

  if (!isScaling.value && realHeightCache.value !== -1) {
    slidesStore.updateElement({
      id: props.elementInfo.id,
      props: { height: realHeightCache.value },
    })
    realHeightCache.value = -1
  }
})

const updateTableElementHeight = (entries: ResizeObserverEntry[]) => {
  const contentRect = entries[0].contentRect
  if (!elementRef.value) return

  const realHeight = contentRect.height

  if (props.elementInfo.height !== realHeight) {
    if (!isScaling.value) {
      slidesStore.updateElement({
        id: props.elementInfo.id,
        props: { height: realHeight },
      })
    } else realHeightCache.value = realHeight
  }
}

const resizeObserver = new ResizeObserver(updateTableElementHeight)

onMounted(() => {
  if (elementRef.value) resizeObserver.observe(elementRef.value)
})
onUnmounted(() => {
  if (elementRef.value) resizeObserver.unobserve(elementRef.value)
})

// 更新表格内容数据
const updateTableCells = (data: TableCell[][]) => {
  slidesStore.updateElement({
    id: props.elementInfo.id,
    props: { data },
  })
  addHistorySnapshot()
}

// 更新表格的列宽数据
const updateColWidths = (widths: number[]) => {
  const width = widths.reduce((a, b) => a + b)
  const colWidths = widths.map((item) => item / width)

  slidesStore.updateElement({
    id: props.elementInfo.id,
    props: { width, colWidths },
  })
  addHistorySnapshot()
}

// 更新表格当前选中的单元格
const updateSelectedCells = (cells: string[]) => {
  nextTick(() => mainStore.setSelectedTableCells(cells))
}
</script>

<style lang="scss" scoped>
.editable-element-table {
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
  position: relative;
  cursor: move;
}
.table-mask {
  @include absolute-0();

  opacity: 0;
  transition: opacity $transitionDelay;

  .mask-tip {
    position: absolute;
    top: 5px;
    left: 5px;
    background-color: rgba($color: #000, $alpha: 0.5);
    color: #fff;
    padding: 6px 12px;
    font-size: 12px;
    transform-origin: 0 0;
  }

  &:hover:not(.lock) {
    opacity: 0.9;
  }
}
</style>
