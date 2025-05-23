<template>
  <div class="common-element-operate">
    <BorderLine
      v-for="line in borderLines"
      :key="line.type"
      class="operate-border-line"
      :type="line.type"
      :style="line.style"
    />
    <template v-if="handlerVisible">
      <ResizeHandler
        v-for="point in resizeHandlers"
        :key="point.direction"
        class="operate-resize-handler"
        :type="point.direction"
        :rotate="elementInfo.rotate"
        :style="point.style"
        @mousedown.stop="
          ($event) => scaleElement($event, elementInfo, point.direction)
        "
      />
      <RotateHandler
        v-if="!cannotRotate"
        class="operate-rotate-handler"
        :style="{ left: scaleWidth / 2 + 'px' }"
        @mousedown.stop="($event) => rotateElement($event, elementInfo)"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import type {
  PPTVideoElement,
  PPTLatexElement,
  PPTAudioElement,
  PPTChartElement,
} from '@/types/slides'
import type { OperateResizeHandlers } from '@/types/edit'
import useCommonOperate from '../hooks/useCommonOperate'

import RotateHandler from './RotateHandler.vue'
import ResizeHandler from './ResizeHandler.vue'
import BorderLine from './BorderLine.vue'

type PPTElement =
  | PPTVideoElement
  | PPTLatexElement
  | PPTAudioElement
  | PPTChartElement

const props = defineProps<{
  elementInfo: PPTElement
  handlerVisible: boolean
  rotateElement: (e: MouseEvent, element: PPTElement) => void
  scaleElement: (
    e: MouseEvent,
    element: PPTElement,
    command: OperateResizeHandlers
  ) => void
}>()

const { canvasScale } = storeToRefs(useMainStore())

const scaleWidth = computed(() => props.elementInfo.width * canvasScale.value)
const scaleHeight = computed(() => props.elementInfo.height * canvasScale.value)
const { resizeHandlers, borderLines } = useCommonOperate(
  scaleWidth,
  scaleHeight
)

const cannotRotate = computed(() =>
  ['chart', 'video', 'audio'].includes(props.elementInfo.type)
)
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>
