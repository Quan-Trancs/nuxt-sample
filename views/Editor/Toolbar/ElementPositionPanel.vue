<template>
  <div class="element-positopn-panel">
    <div class="title">层级：</div>
    <ButtonGroup class="row">
      <Button
        style="flex: 1"
        @click="orderElement(handleElement!, ElementOrderCommands.TOP)"
        ><IconSendToBack class="btn-icon" /> 置顶</Button
      >
      <Button
        style="flex: 1"
        @click="orderElement(handleElement!, ElementOrderCommands.BOTTOM)"
        ><IconBringToFrontOne class="btn-icon" /> 置底</Button
      >
    </ButtonGroup>
    <ButtonGroup class="row">
      <Button
        style="flex: 1"
        @click="orderElement(handleElement!, ElementOrderCommands.UP)"
        ><IconBringToFront class="btn-icon" /> 上移</Button
      >
      <Button
        style="flex: 1"
        @click="orderElement(handleElement!, ElementOrderCommands.DOWN)"
        ><IconSentToBack class="btn-icon" /> 下移</Button
      >
    </ButtonGroup>

    <Divider />

    <div class="title">对齐：</div>
    <ButtonGroup class="row">
      <Button
        v-tooltip="'左对齐'"
        style="flex: 1"
        @click="alignElementToCanvas(ElementAlignCommands.LEFT)"
        ><IconAlignLeft
      /></Button>
      <Button
        v-tooltip="'水平居中'"
        style="flex: 1"
        @click="alignElementToCanvas(ElementAlignCommands.HORIZONTAL)"
        ><IconAlignVertically
      /></Button>
      <Button
        v-tooltip="'右对齐'"
        style="flex: 1"
        @click="alignElementToCanvas(ElementAlignCommands.RIGHT)"
        ><IconAlignRight
      /></Button>
    </ButtonGroup>
    <ButtonGroup class="row">
      <Button
        v-tooltip="'上对齐'"
        style="flex: 1"
        @click="alignElementToCanvas(ElementAlignCommands.TOP)"
        ><IconAlignTop
      /></Button>
      <Button
        v-tooltip="'垂直居中'"
        style="flex: 1"
        @click="alignElementToCanvas(ElementAlignCommands.VERTICAL)"
        ><IconAlignHorizontally
      /></Button>
      <Button
        v-tooltip="'下对齐'"
        style="flex: 1"
        @click="alignElementToCanvas(ElementAlignCommands.BOTTOM)"
        ><IconAlignBottom
      /></Button>
    </ButtonGroup>

    <Divider />

    <div class="row">
      <NumberInput
        :min="-1000"
        :step="5"
        :value="left"
        style="width: 45%"
        @update:value="(value) => updateLeft(value)"
      >
        <template #prefix> 水平： </template>
      </NumberInput>
      <div style="width: 10%" />
      <NumberInput
        :min="-1000"
        :step="5"
        :value="top"
        style="width: 45%"
        @update:value="(value) => updateTop(value)"
      >
        <template #prefix> 垂直： </template>
      </NumberInput>
    </div>

    <template v-if="handleElement!.type !== 'line'">
      <div class="row">
        <NumberInput
          :min="minSize"
          :max="1500"
          :step="5"
          :disabled="isVerticalText"
          :value="width"
          style="width: 45%"
          @update:value="(value) => updateWidth(value)"
        >
          <template #prefix> 宽度： </template>
        </NumberInput>
        <template
          v-if="['image', 'shape', 'audio'].includes(handleElement!.type)"
        >
          <IconLock
            v-if="fixedRatio"
            v-tooltip="'解除宽高比锁定'"
            style="width: 10%"
            class="icon-btn active"
            @click="updateFixedRatio(false)"
          />
          <IconUnlock
            v-else
            v-tooltip="'宽高比锁定'"
            style="width: 10%"
            class="icon-btn"
            @click="updateFixedRatio(true)"
          />
        </template>
        <div v-else style="width: 10%" />
        <NumberInput
          :min="minSize"
          :max="800"
          :step="5"
          :disabled="isHorizontalText || handleElement!.type === 'table'"
          :value="height"
          style="width: 45%"
          @update:value="(value) => updateHeight(value)"
        >
          <template #prefix> 高度： </template>
        </NumberInput>
      </div>
    </template>

    <template v-if="!['line', 'video', 'audio'].includes(handleElement!.type)">
      <Divider />

      <div class="row">
        <NumberInput
          :min="-180"
          :max="180"
          :step="5"
          :value="rotate"
          style="width: 45%"
          @update:value="(value) => updateRotate(value)"
        >
          <template #prefix> 旋转： </template>
        </NumberInput>
        <div style="width: 7%" />
        <div class="text-btn" style="width: 24%" @click="updateRotate45('-')">
          <IconRotate /> -45°
        </div>
        <div class="text-btn" style="width: 24%" @click="updateRotate45('+')">
          <IconRotate :style="{ transform: 'rotateY(180deg)' }" /> +45°
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { round } from 'lodash'
import { storeToRefs } from 'pinia'
import type { PPTElement } from '@/types/slides'
import { ElementAlignCommands, ElementOrderCommands } from '@/types/edit'
import { MIN_SIZE } from '@/configs/element'
import { SHAPE_PATH_FORMULAS } from '@/configs/shapes'
import useOrderElement from '@/hooks/useOrderElement'
import useAlignElementToCanvas from '@/hooks/useAlignElementToCanvas'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import Divider from '~/components/Divider.vue'
import Button from '~/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import NumberInput from '@/components/NumberInput.vue'

const slidesStore = useSlidesStore()
const { handleElement, handleElementId } = storeToRefs(useMainStore())

const left = ref(0)
const top = ref(0)
const width = ref(0)
const height = ref(0)
const rotate = ref(0)
const fixedRatio = ref(false)

const minSize = computed(() => {
  if (!handleElement.value) return 20
  return MIN_SIZE[handleElement.value.type] || 20
})

const isHorizontalText = computed(() => {
  return handleElement.value?.type === 'text' && !handleElement.value.vertical
})
const isVerticalText = computed(() => {
  return handleElement.value?.type === 'text' && handleElement.value.vertical
})

watch(
  handleElement,
  () => {
    if (!handleElement.value) return

    left.value = round(handleElement.value.left, 1)
    top.value = round(handleElement.value.top, 1)

    fixedRatio.value =
      'fixedRatio' in handleElement.value && !!handleElement.value.fixedRatio

    if (handleElement.value.type !== 'line') {
      width.value = round(handleElement.value.width, 1)
      height.value = round(handleElement.value.height, 1)
      rotate.value =
        'rotate' in handleElement.value &&
        handleElement.value.rotate !== undefined
          ? round(handleElement.value.rotate, 1)
          : 0
    }
  },
  { deep: true, immediate: true }
)

const { orderElement } = useOrderElement()
const { alignElementToCanvas } = useAlignElementToCanvas()

const { addHistorySnapshot } = useHistorySnapshot()

// 设置元素位置
const updateLeft = (value: number) => {
  const props = { left: value }
  slidesStore.updateElement({ id: handleElementId.value, props })
  addHistorySnapshot()
}
const updateTop = (value: number) => {
  const props = { top: value }
  slidesStore.updateElement({ id: handleElementId.value, props })
  addHistorySnapshot()
}

// 设置元素宽度、高度、旋转角度
// 对形状设置宽高时，需要检查是否需要更新形状路径
const updateShapePathData = (width: number, height: number) => {
  if (
    handleElement.value &&
    handleElement.value.type === 'shape' &&
    'pathFormula' in handleElement.value &&
    handleElement.value.pathFormula
  ) {
    const pathFormula = SHAPE_PATH_FORMULAS[handleElement.value.pathFormula]

    let path = ''
    if ('editable' in pathFormula && pathFormula.editable)
      path = pathFormula.formula(width, height, handleElement.value.keypoints!)
    else path = pathFormula.formula(width, height)

    return {
      viewBox: [width, height],
      path,
    }
  }
  return null
}

const updateWidth = (value: number) => {
  if (!handleElement.value) return
  if (handleElement.value.type === 'line' || isVerticalText.value) return

  let h = height.value

  if (fixedRatio.value) {
    const ratio = width.value / height.value
    h = value / ratio < minSize.value ? minSize.value : value / ratio
  }
  let props: Partial<PPTElement> = { width: value, height: h }

  const shapePathData = updateShapePathData(value, h)
  if (shapePathData) {
    props = {
      width: value,
      height: h,
      ...shapePathData,
    }
  }

  slidesStore.updateElement({ id: handleElementId.value, props })
  addHistorySnapshot()
}

const updateHeight = (value: number) => {
  if (!handleElement.value) return
  if (
    handleElement.value.type === 'line' ||
    handleElement.value.type === 'table' ||
    isHorizontalText.value
  )
    return

  let w = width.value

  if (fixedRatio.value) {
    const ratio = width.value / height.value
    w = value * ratio < minSize.value ? minSize.value : value * ratio
  }
  let props: Partial<PPTElement> = { width: w, height: value }

  const shapePathData = updateShapePathData(w, value)
  if (shapePathData) {
    props = {
      width: w,
      height: value,
      ...shapePathData,
    }
  }

  slidesStore.updateElement({ id: handleElementId.value, props })
  addHistorySnapshot()
}

const updateRotate = (value: number) => {
  const props = { rotate: value }
  slidesStore.updateElement({ id: handleElementId.value, props })
  addHistorySnapshot()
}

// 固定元素的宽高比
const updateFixedRatio = (value: boolean) => {
  const props = { fixedRatio: value }
  slidesStore.updateElement({ id: handleElementId.value, props })
  addHistorySnapshot()
}

// 将元素旋转45度（顺时针或逆时针）
const updateRotate45 = (command: '+' | '-') => {
  let _rotate = Math.floor(rotate.value / 45) * 45
  if (command === '+') _rotate = _rotate + 45
  else if (command === '-') _rotate = _rotate - 45

  if (_rotate < -180) _rotate = -180
  if (_rotate > 180) _rotate = 180

  const props = { rotate: _rotate }
  slidesStore.updateElement({ id: handleElementId.value, props })
  addHistorySnapshot()
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.title {
  margin-bottom: 10px;
}
.label {
  text-align: center;
}
.btn-icon {
  margin-right: 3px;
}
.icon-btn {
  cursor: pointer;

  &.active {
    color: $themeColor;
  }
}
.text-btn {
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #efefef;
    border-radius: $borderRadius;
  }
}
</style>
