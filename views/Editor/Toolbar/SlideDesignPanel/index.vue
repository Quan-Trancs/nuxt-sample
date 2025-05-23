<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div class="slide-design-panel">
    <div class="title">背景填充</div>
    <div class="row">
      <Select
        style="flex: 1"
        :value="background.type"
        :options="[
          { label: '纯色填充', value: 'solid' },
          { label: '图片填充', value: 'image' },
          { label: '渐变填充', value: 'gradient' },
        ]"
        @update:value="value => updateBackgroundType(value as 'gradient' | 'image' | 'solid')"
      />
      <div style="width: 10px" />

      <Popover
        v-if="background.type === 'solid'"
        trigger="click"
        style="flex: 1"
      >
        <template #content>
          <ColorPicker
            :model-value="background.color"
            @update:model-value="(color) => updateBackground({ color })"
          />
        </template>
        <ColorButton :color="background.color || '#fff'" />
      </Popover>

      <Select
        v-else-if="background.type === 'image'"
        style="flex: 1"
        :value="background.image?.size || 'cover'"
        :options="[
          { label: '缩放', value: 'contain' },
          { label: '拼贴', value: 'repeat' },
          { label: '缩放铺满', value: 'cover' },
        ]"
        @update:value="value => updateImageBackground({ size: value as SlideBackgroundImageSize })"
      />

      <Select
        v-else
        style="flex: 1"
        :value="background.gradient?.type || ''"
        :options="[
          { label: '线性渐变', value: 'linear' },
          { label: '径向渐变', value: 'radial' },
        ]"
        @update:value="value => updateGradientBackground({ type: value as GradientType })"
      />
    </div>

    <div v-if="background.type === 'image'" class="background-image-wrapper">
      <FileInput @change="(files) => uploadBackgroundImage(files)">
        <div class="background-image">
          <div
            class="content"
            :style="{ backgroundImage: `url(${background.image?.src})` }"
          >
            <IconPlus />
          </div>
        </div>
      </FileInput>
    </div>

    <div
      v-if="background.type === 'gradient'"
      class="background-gradient-wrapper"
    >
      <div class="row">
        <GradientBar
          :value="background.gradient?.colors || []"
          :index="currentGradientIndex"
          @update:value="(value) => updateGradientBackground({ colors: value })"
          @update:index="(index) => (currentGradientIndex = index)"
        />
      </div>
      <div class="row">
        <div style="width: 40%">当前色块：</div>
        <Popover trigger="click" style="width: 60%">
          <template #content>
            <ColorPicker
              :model-value="background.gradient!.colors[currentGradientIndex].color"
              @update:model-value="
                (value) => updateGradientBackgroundColors(value)
              "
            />
          </template>
          <ColorButton
            :color="background.gradient!.colors[currentGradientIndex].color"
          />
        </Popover>
      </div>
      <div v-if="background.gradient?.type === 'linear'" class="row">
        <div style="width: 40%">渐变角度：</div>
        <Slider
          :min="0"
          :max="360"
          :step="15"
          :value="background.gradient.rotate || 0"
          style="width: 60%"
          @update:value="value => updateGradientBackground({ rotate: value as number })"
        />
      </div>
    </div>

    <div class="row">
      <Button style="flex: 1" @click="applyBackgroundAllSlide()"
        >应用背景到全部</Button
      >
    </div>

    <Divider />

    <div class="row">
      <Select
        style="width: 100%"
        :value="viewportRatio"
        :options="[
          { label: '宽屏 16 : 9', value: 0.5625 },
          { label: '宽屏 16 : 10', value: 0.625 },
          { label: '标准 4 : 3', value: 0.75 },
          { label: '纸张 A3 / A4', value: 0.70710678 },
          { label: '竖向 A3 / A4', value: 1.41421356 },
        ]"
        @update:value="value => updateViewportRatio(value as number)"
      />
    </div>

    <div class="row">
      <div class="canvas-size">
        画布尺寸：{{ viewportSize }} ×
        {{ toFixed(viewportSize * viewportRatio) }}
      </div>
    </div>

    <Divider />

    <div class="title">
      <span>全局主题</span>
      <span
        class="more"
        @click="moreThemeConfigsVisible = !moreThemeConfigsVisible"
      >
        <span class="text">更多</span>
        <IconDown v-if="moreThemeConfigsVisible" />
        <IconRight v-else />
      </span>
    </div>
    <div class="row">
      <div style="width: 40%">字体：</div>
      <Select
        style="width: 60%"
        :value="theme.fontName"
        search
        search-label="搜索字体"
        :options="FONTS"
        @update:value="value => updateTheme({ fontName: value as string })"
      />
    </div>
    <div class="row">
      <div style="width: 40%">字体颜色：</div>
      <Popover trigger="click" style="width: 60%">
        <template #content>
          <ColorPicker
            :model-value="theme.fontColor"
            @update:model-value="(value) => updateTheme({ fontColor: value })"
          />
        </template>
        <ColorButton :color="theme.fontColor" />
      </Popover>
    </div>
    <div class="row">
      <div style="width: 40%">背景颜色：</div>
      <Popover trigger="click" style="width: 60%">
        <template #content>
          <ColorPicker
            :model-value="theme.backgroundColor"
            @update:model-value="
              (value) => updateTheme({ backgroundColor: value })
            "
          />
        </template>
        <ColorButton :color="theme.backgroundColor" />
      </Popover>
    </div>
    <div class="row">
      <div style="width: 40%">主题色：</div>
      <ColorListButton
        style="width: 60%"
        :colors="theme.themeColors"
        @click="themeColorsSettingVisible = true"
      />
    </div>

    <template v-if="moreThemeConfigsVisible">
      <div class="row">
        <div style="width: 40%">边框样式：</div>
        <SelectCustom style="width: 60%">
          <template #options>
            <div
              v-for="item in lineStyleOptions"
              :key="item"
              class="option"
              @click="
                updateTheme({ outline: { ...theme.outline, style: item } })
              "
            >
              <SVGLine :type="item" />
            </div>
          </template>
          <template #label>
            <SVGLine :type="theme.outline.style" />
          </template>
        </SelectCustom>
      </div>
      <div class="row">
        <div style="width: 40%">边框颜色：</div>
        <Popover trigger="click" style="width: 60%">
          <template #content>
            <ColorPicker
              :model-value="theme.outline.color"
              @update:model-value="
                (value) =>
                  updateTheme({ outline: { ...theme.outline, color: value } })
              "
            />
          </template>
          <ColorButton :color="theme.outline.color || '#000'" />
        </Popover>
      </div>
      <div class="row">
        <div style="width: 40%">边框粗细：</div>
        <NumberInput
          :value="theme.outline.width || 0"
          style="width: 60%"
          @update:value="
            (value) =>
              updateTheme({ outline: { ...theme.outline, width: value } })
          "
        />
      </div>
      <div class="row" style="height: 30px">
        <div style="width: 40%">水平阴影：</div>
        <Slider
          style="width: 60%"
          :min="-10"
          :max="10"
          :step="1"
          :value="theme.shadow.h"
          @update:value="value => updateTheme({ shadow: { ...theme.shadow, h: value as number } })"
        />
      </div>
      <div class="row" style="height: 30px">
        <div style="width: 40%">垂直阴影：</div>
        <Slider
          style="width: 60%"
          :min="-10"
          :max="10"
          :step="1"
          :value="theme.shadow.v"
          @update:value="value => updateTheme({ shadow: { ...theme.shadow, v: value as number } })"
        />
      </div>
      <div class="row" style="height: 30px">
        <div style="width: 40%">模糊距离：</div>
        <Slider
          style="width: 60%"
          :min="1"
          :max="20"
          :step="1"
          :value="theme.shadow.blur"
          @update:value="value => updateTheme({ shadow: { ...theme.shadow, blur: value as number } })"
        />
      </div>
      <div class="row">
        <div style="width: 40%">阴影颜色：</div>
        <Popover trigger="click" style="width: 60%">
          <template #content>
            <ColorPicker
              :model-value="theme.shadow.color"
              @update:model-value="
                (value) =>
                  updateTheme({ shadow: { ...theme.shadow, color: value } })
              "
            />
          </template>
          <ColorButton :color="theme.shadow.color" />
        </Popover>
      </div>
    </template>

    <div class="row">
      <Button
        style="flex: 1"
        @click="applyThemeToAllSlides(moreThemeConfigsVisible)"
        >应用主题到全部</Button
      >
    </div>

    <div class="row">
      <Button style="flex: 1" @click="themeStylesExtractVisible = true"
        >从幻灯片提取主题</Button
      >
    </div>

    <Divider />

    <div class="title">预置主题</div>
    <div class="theme-list">
      <div
        v-for="(item, index) in PRESET_THEMES"
        :key="index"
        class="theme-item"
        :style="{
          backgroundColor: item.background,
          fontFamily: item.fontname,
        }"
      >
        <div class="theme-item-content">
          <div class="text" :style="{ color: item.fontColor }">文字 Aa</div>
          <div class="colors">
            <div
              v-for="(color, index) in item.colors"
              :key="index"
              class="color-block"
              :style="{ backgroundColor: color }"
            />
          </div>

          <div class="btns">
            <Button type="primary" size="small" @click="applyPresetTheme(item)"
              >设置</Button
            >
            <Button
              type="primary"
              size="small"
              style="margin-top: 3px"
              @click="applyPresetTheme(item, true)"
              >设置并应用</Button
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <Modal
    v-model:visible="themeStylesExtractVisible"
    :width="320"
    @closed="themeStylesExtractVisible = false"
  >
    <ThemeStylesExtract @close="themeStylesExtractVisible = false" />
  </Modal>

  <Modal
    v-model:visible="themeColorsSettingVisible"
    :width="310"
    @closed="themeColorsSettingVisible = false"
  >
    <ThemeColorsSetting @close="themeColorsSettingVisible = false" />
  </Modal>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import type {
  Gradient,
  GradientType,
  SlideBackground,
  SlideBackgroundType,
  SlideTheme,
  SlideBackgroundImage,
  SlideBackgroundImageSize,
  LineStyleType,
} from '@/types/slides'
import { PRESET_THEMES } from '@/configs/theme'
import { FONTS } from '@/configs/font'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useSlideTheme from '@/hooks/useSlideTheme'
import { getImageDataURL } from '@/utils/image'

import ThemeStylesExtract from './ThemeStylesExtract.vue'
import ThemeColorsSetting from './ThemeColorsSetting.vue'
import SVGLine from '../common/SVGLine.vue'
import ColorButton from '@/components/ColorButton.vue'
import ColorListButton from '@/components/ColorListButton.vue'
import FileInput from '@/components/FileInput.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Divider from '~/components/Divider.vue'
import Slider from '@/components/Slider.vue'
import Button from '~/components/Button.vue'
import Select from '~/components/Select.vue'
import Popover from '~/components/Popover.vue'
import SelectCustom from '@/components/SelectCustom.vue'
import NumberInput from '@/components/NumberInput.vue'
import Modal from '~/components/Modal.vue'
import GradientBar from '@/components/GradientBar.vue'

const slidesStore = useSlidesStore()
const { slides, currentSlide, slideIndex, viewportRatio, viewportSize, theme } =
  storeToRefs(slidesStore)

const moreThemeConfigsVisible = ref(false)
const themeStylesExtractVisible = ref(false)
const themeColorsSettingVisible = ref(false)
const currentGradientIndex = ref(0)
const lineStyleOptions = ref<LineStyleType[]>(['solid', 'dashed', 'dotted'])

const background = computed(() => {
  if (!currentSlide.value.background) {
    return {
      type: 'solid',
      value: '#fff',
    } as SlideBackground
  }
  return currentSlide.value.background
})

const { addHistorySnapshot } = useHistorySnapshot()
const { applyPresetTheme, applyThemeToAllSlides } = useSlideTheme()

watch(slideIndex, () => {
  currentGradientIndex.value = 0
})

// 设置背景模式：纯色、图片、渐变色
const updateBackgroundType = (type: SlideBackgroundType) => {
  if (type === 'solid') {
    const newBackground: SlideBackground = {
      ...background.value,
      type: 'solid',
      color: background.value.color || '#fff',
    }
    slidesStore.updateSlide({ background: newBackground })
  } else if (type === 'image') {
    const newBackground: SlideBackground = {
      ...background.value,
      type: 'image',
      image: background.value.image || {
        src: '',
        size: 'cover',
      },
    }
    slidesStore.updateSlide({ background: newBackground })
  } else {
    const newBackground: SlideBackground = {
      ...background.value,
      type: 'gradient',
      gradient: background.value.gradient || {
        type: 'linear',
        colors: [
          { pos: 0, color: '#fff' },
          { pos: 100, color: '#fff' },
        ],
        rotate: 0,
      },
    }
    currentGradientIndex.value = 0
    slidesStore.updateSlide({ background: newBackground })
  }
  addHistorySnapshot()
}

// 设置背景
const updateBackground = (props: Partial<SlideBackground>) => {
  slidesStore.updateSlide({ background: { ...background.value, ...props } })
  addHistorySnapshot()
}

// 设置渐变背景
const updateGradientBackground = (props: Partial<Gradient>) => {
  updateBackground({ gradient: { ...background.value.gradient!, ...props } })
}
const updateGradientBackgroundColors = (color: string) => {
  const colors = background.value.gradient!.colors.map((item, index) => {
    if (index === currentGradientIndex.value) return { ...item, color }
    return item
  })
  updateGradientBackground({ colors })
}

// 设置图片背景
const updateImageBackground = (props: Partial<SlideBackgroundImage>) => {
  updateBackground({ image: { ...background.value.image!, ...props } })
}

// 上传背景图片
const uploadBackgroundImage = (files: FileList) => {
  const imageFile = files[0]
  if (!imageFile) return
  getImageDataURL(imageFile).then((dataURL) =>
    updateImageBackground({ src: dataURL })
  )
}

// 应用当前页背景到全部页面
const applyBackgroundAllSlide = () => {
  const newSlides = slides.value.map((slide) => {
    return {
      ...slide,
      background: currentSlide.value.background,
    }
  })
  slidesStore.setSlides(newSlides)
  addHistorySnapshot()
}

// 设置主题
const updateTheme = (themeProps: Partial<SlideTheme>) => {
  slidesStore.setTheme(themeProps)
}

// 设置画布尺寸（宽高比例）
const updateViewportRatio = (value: number) => {
  slidesStore.setViewportRatio(value)
}

const toFixed = (num: number) => {
  if (num % 1 !== 0) {
    return parseFloat(num.toFixed(1))
  }
  return Math.floor(num)
}
</script>

<style lang="scss" scoped>
.slide-design-panel {
  user-select: none;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  .more {
    cursor: pointer;

    .text {
      font-size: 12px;
      margin-right: 3px;
    }
  }
}
.background-image-wrapper {
  margin-bottom: 10px;
}
.background-image {
  height: 0;
  padding-bottom: 56.25%;
  border: 1px dashed $borderColor;
  border-radius: $borderRadius;
  position: relative;
  transition: all $transitionDelay;

  &:hover {
    border-color: $themeColor;
    color: $themeColor;
  }

  .content {
    @include absolute-0();

    display: flex;
    justify-content: center;
    align-items: center;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
  }
}
.canvas-size {
  width: 100%;
  color: #888;
  font-size: 12px;
  text-align: center;
}

.theme-list {
  @include flex-grid-layout();
}
.theme-item {
  @include flex-grid-layout-children(2, 48%);

  padding-bottom: 27%;
  border-radius: $borderRadius;
  position: relative;
  cursor: pointer;

  .theme-item-content {
    @include absolute-0();

    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 8px;
    border: 1px solid $borderColor;
    border-radius: $borderRadius;
  }

  .text {
    font-size: 15px;
  }
  .colors {
    display: flex;
    margin-top: 6px;
  }
  .color-block {
    width: 12px;
    height: 12px;
    margin-right: 2px;
  }

  &:hover .btns {
    opacity: 1;
  }

  .btns {
    @include absolute-0();

    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;
    background-color: rgba($color: #000, $alpha: 0.25);
    opacity: 0;
    transition: opacity $transitionDelay;
  }
}
.option {
  height: 32px;
  padding: 0 5px;
  border-radius: $borderRadius;

  &:not(.selected):hover {
    background-color: rgba($color: $themeColor, $alpha: 0.05);
    cursor: pointer;
  }

  &.selected {
    color: $themeColor;
    font-weight: 700;
  }
}
</style>
