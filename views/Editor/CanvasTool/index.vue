<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="canvas-tool">
    <div class="left-handler">
      <IconBack v-tooltip="'撤销（Ctrl + Z）'" class="handler-item" :class="{ 'disable': !canUndo }" @click="undo()" />
      <IconNext v-tooltip="'重做（Ctrl + Y）'" class="handler-item" :class="{ 'disable': !canRedo }" @click="redo()" />
      <div class="more">
        <Divider type="vertical" style="height: 20px;" />
        <Popover v-model:value="moreVisible" class="more-icon" trigger="click" :offset="10">
          <template #content>
            <PopoverMenuItem center @click="toggleNotesPanel(); moreVisible = false">批注面板</PopoverMenuItem>
            <PopoverMenuItem center @click="toggleSelectPanel(); moreVisible = false">选择窗格</PopoverMenuItem>
            <PopoverMenuItem center @click="toggleSraechPanel(); moreVisible = false">查找替换</PopoverMenuItem>
          </template>
          <IconMore class="handler-item" />
        </Popover>
        <IconComment v-tooltip="'批注面板'" class="handler-item" :class="{ 'active': showNotesPanel }" @click="toggleNotesPanel()" />
        <IconMoveOne v-tooltip="'选择窗格'" class="handler-item" :class="{ 'active': showSelectPanel }" @click="toggleSelectPanel()" />
        <IconSearch v-tooltip="'查找/替换（Ctrl + F）'" class="handler-item" :class="{ 'active': showSearchPanel }" @click="toggleSraechPanel()" />
      </div>
    </div>

    <div class="add-element-handler">
      <div v-tooltip="'插入文字'" class="handler-item group-btn">
        <IconFontSize class="icon" :class="{ 'active': creatingElement?.type === 'text' }" @click="drawText()" />
        
        <Popover v-model:value="textTypeSelectVisible" trigger="click" style="height: 100%;" :offset="10">
          <template #content>
            <PopoverMenuItem center @click="() => { drawText(); textTypeSelectVisible = false }"><IconTextRotationNone /> 横向文本框</PopoverMenuItem>
            <PopoverMenuItem center @click="() => { drawText(true); textTypeSelectVisible = false }"><IconTextRotationDown /> 竖向文本框</PopoverMenuItem>
          </template>
          <IconDown class="arrow" />
        </Popover>
      </div>
      <div v-tooltip="'插入形状'" class="handler-item group-btn" :offset="10">
        <Popover v-model:value="shapePoolVisible" trigger="click" style="height: 100%;" :offset="10">
          <template #content>
            <ShapePool @select="shape => drawShape(shape)" />
          </template>
          <IconGraphicDesign class="icon" :class="{ 'active': creatingCustomShape || creatingElement?.type === 'shape' }" />
        </Popover>
        
        <Popover v-model:value="shapeMenuVisible" trigger="click" style="height: 100%;" :offset="10">
          <template #content>
            <PopoverMenuItem center @click="() => { drawCustomShape(); shapeMenuVisible = false }">自由绘制</PopoverMenuItem>
          </template>
          <IconDown class="arrow" />
        </Popover>
      </div>
      <FileInput @change="files => insertImageElement(files)">
        <IconPicture v-tooltip="'插入图片'" class="handler-item" />
      </FileInput>
      <Popover v-model:value="linePoolVisible" trigger="click" :offset="10">
        <template #content>
          <LinePool @select="line => drawLine(line)" />
        </template>
        <IconConnection v-tooltip="'插入线条'" class="handler-item" :class="{ 'active': creatingElement?.type === 'line' }" />
      </Popover>
      <Popover v-model:value="chartPoolVisible" trigger="click" :offset="10">
        <template #content>
          <ChartPool @select="chart => { createChartElement(chart); chartPoolVisible = false }" />
        </template>
        <IconChartProportion v-tooltip="'插入图表'" class="handler-item" />
      </Popover>
      <Popover v-model:value="tableGeneratorVisible" trigger="click" :offset="10">
        <template #content>
          <TableGenerator
            @close="tableGeneratorVisible = false"
            @insert="({ row, col }) => { createTableElement(row, col); tableGeneratorVisible = false }"
          />
        </template>
        <IconInsertTable v-tooltip="'插入表格'" class="handler-item" />
      </Popover>
      <IconFormula v-tooltip="'插入公式'" class="handler-item" @click="latexEditorVisible = true" />
      <Popover v-model:value="mediaInputVisible" trigger="click" :offset="10">
        <template #content>
          <MediaInput 
            @close="mediaInputVisible = false"
            @insert-video="src => { createVideoElement(src); mediaInputVisible = false }"
            @insert-audio="src => { createAudioElement(src); mediaInputVisible = false }"
          />
        </template>
        <IconVideoTwo v-tooltip="'插入音视频'" class="handler-item" />
      </Popover>
    </div>

    <div class="right-handler">
      <IconMinus v-tooltip="'画布缩小（Ctrl + -）'" class="handler-item viewport-size" @click="scaleCanvas('-')" />
      <Popover v-model:value="canvasScaleVisible" trigger="click">
        <template #content>
          <PopoverMenuItem
            v-for="item in canvasScalePresetList"
            :key="item" 
            center 
            @click="applyCanvasPresetScale(item)"
          >{{item}}%</PopoverMenuItem>
          <PopoverMenuItem center @click="resetCanvas(); canvasScaleVisible = false">适应屏幕</PopoverMenuItem>
        </template>
        <span class="text">{{canvasScalePercentage}}</span>
      </Popover>
      <IconPlus v-tooltip="'画布放大（Ctrl + =）'" class="handler-item viewport-size" @click="scaleCanvas('+')" />
      <IconFullScreen v-tooltip="'适应屏幕（Ctrl + 0）'" class="handler-item viewport-size-adaptation" @click="resetCanvas()" />
    </div>

    <Modal
      v-model:visible="latexEditorVisible" 
      :width="880"
    >
      <LaTeXEditor 
        @close="latexEditorVisible = false"
        @update="data => { createLatexElement(data); latexEditorVisible = false }"
      />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { getImageDataURL } from '@/utils/image'
import type { ShapePoolItem } from '@/configs/shapes'
import type { LinePoolItem } from '@/configs/lines'
import useScaleCanvas from '@/hooks/useScaleCanvas'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useCreateElement from '@/hooks/useCreateElement'

import ShapePool from './ShapePool.vue'
import LinePool from './LinePool.vue'
import ChartPool from './ChartPool.vue'
import TableGenerator from './TableGenerator.vue'
import MediaInput from './MediaInput.vue'
import LaTeXEditor from '@/components/LaTeXEditor/index.vue'
import FileInput from '@/components/FileInput.vue'
import Modal from '@/components/Modal.vue'
import Divider from '@/components/Divider.vue'
import Popover from '@/components/Popover.vue'
import PopoverMenuItem from '@/components/PopoverMenuItem.vue'

const mainStore = useMainStore()
const { creatingElement, creatingCustomShape, showSelectPanel, showSearchPanel, showNotesPanel } = storeToRefs(mainStore)
const { canUndo, canRedo } = storeToRefs(useSnapshotStore())

const { redo, undo } = useHistorySnapshot()

const {
  scaleCanvas,
  setCanvasScalePercentage,
  resetCanvas,
  canvasScalePercentage,
} = useScaleCanvas()

const canvasScalePresetList = [200, 150, 125, 100, 75, 50]
const canvasScaleVisible = ref(false)

const applyCanvasPresetScale = (value: number) => {
  setCanvasScalePercentage(value)
  canvasScaleVisible.value = false
}

const {
  createImageElement,
  createChartElement,
  createTableElement,
  createLatexElement,
  createVideoElement,
  createAudioElement,
} = useCreateElement()

const insertImageElement = (files: FileList) => {
  const imageFile = files[0]
  if (!imageFile) return
  getImageDataURL(imageFile).then(dataURL => createImageElement(dataURL))
}

const shapePoolVisible = ref(false)
const linePoolVisible = ref(false)
const chartPoolVisible = ref(false)
const tableGeneratorVisible = ref(false)
const mediaInputVisible = ref(false)
const latexEditorVisible = ref(false)
const textTypeSelectVisible = ref(false)
const shapeMenuVisible = ref(false)
const moreVisible = ref(false)

// 绘制文字范围
const drawText = (vertical = false) => {
  mainStore.setCreatingElement({
    type: 'text',
    vertical,
  })
}

// 绘制形状范围
const drawShape = (shape: ShapePoolItem) => {
  mainStore.setCreatingElement({
    type: 'shape',
    data: shape,
  })
  shapePoolVisible.value = false
}
// 绘制自定义任意多边形
const drawCustomShape = () => {
  mainStore.setCreatingCustomShapeState(true)
  shapePoolVisible.value = false
}

// 绘制线条路径
const drawLine = (line: LinePoolItem) => {
  mainStore.setCreatingElement({
    type: 'line',
    data: line,
  })
  linePoolVisible.value = false
}

// 打开选择面板
const toggleSelectPanel = () => {
  mainStore.setSelectPanelState(!showSelectPanel.value)
}

// 打开搜索替换面板
const toggleSraechPanel = () => {
  mainStore.setSearchPanelState(!showSearchPanel.value)
}

// 打开批注面板
const toggleNotesPanel = () => {
  mainStore.setNotesPanelState(!showNotesPanel.value)
}
</script>

<style lang="scss" scoped>
.canvas-tool {
  position: relative;
  border-bottom: 1px solid $borderColor;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 13px;
  user-select: none;
}
.left-handler, .more {
  display: flex;
  align-items: center;
}
.more-icon {
  display: none;
}
.add-element-handler {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;

  .handler-item {
    width: 32px;

    &:not(.group-btn):hover {
      background-color: #f1f1f1;
    }

    &.active {
      color: $themeColor;
    }

    &.group-btn {
      width: auto;
      margin-right: 5px;

      &:hover {
        background-color: #f3f3f3;
      }

      .icon, .arrow {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .icon {
        width: 26px;
        padding: 0 2px;

        &:hover {
          background-color: #e9e9e9;
        }
        &.active {
          color: $themeColor;
        }
      }
      .arrow {
        font-size: 12px;

        &:hover {
          background-color: #e9e9e9;
        }
      }
    }
  }
}
.handler-item {
  height: 30px;
  font-size: 14px;
  margin: 0 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: $borderRadius;
  overflow: hidden;
  cursor: pointer;

  &.disable {
    opacity: .5;
  }
}
.left-handler, .right-handler {
  .handler-item {
    padding: 0 8px;

    &.active,
    &:not(.disable):hover {
      background-color: #f1f1f1;
    }
  }
}
.right-handler {
  display: flex;
  align-items: center;

  .text {
    display: inline-block;
    width: 40px;
    text-align: center;
    cursor: pointer;
  }

  .viewport-size {
    font-size: 13px;
  }
}

@media screen and (width <= 1200px) {
  .right-handler .text {
    display: none;
  }
  .more > .handler-item {
    display: none;
  }
  .more-icon {
    display: block;
  }
}
@media screen and (width <= 1000px) {
  .left-handler, .right-handler {
    display: none;
  }
}
</style>