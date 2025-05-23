<template>
  <div class="rich-text-base">
    <SelectGroup class="row">
      <Select
        style="width: 60%"
        :value="richTextAttrs.fontname"
        search
        search-label="搜索字体"
        :options="FONTS"
        @update:value="value => emitRichTextCommand('fontname', value as string)"
      >
        <template #icon>
          <IconFontSize />
        </template>
      </Select>
      <Select
        style="width: 40%"
        :value="richTextAttrs.fontsize"
        search
        search-label="搜索字号"
        :options="
          fontSizeOptions.map((item) => ({
            label: item,
            value: item,
          }))
        "
        @update:value="value => emitRichTextCommand('fontsize', value as string)"
      >
        <template #icon>
          <IconAddText />
        </template>
      </Select>
    </SelectGroup>

    <ButtonGroup class="row" passive>
      <Popover trigger="click" style="width: 30%">
        <template #content>
          <ColorPicker
            :model-value="richTextAttrs.color"
            @update:model-value="(value) => emitRichTextCommand('color', value)"
          />
        </template>
        <TextColorButton
          v-tooltip="'文字颜色'"
          first
          :color="richTextAttrs.color"
        >
          <IconText />
        </TextColorButton>
      </Popover>
      <Popover trigger="click" style="width: 30%">
        <template #content>
          <ColorPicker
            :model-value="richTextAttrs.backcolor"
            @update:model-value="
              (value) => emitRichTextCommand('backcolor', value)
            "
          />
        </template>
        <TextColorButton
          v-tooltip="'文字高亮'"
          :color="richTextAttrs.backcolor"
        >
          <IconHighLight />
        </TextColorButton>
      </Popover>
      <Button
        v-tooltip="'增大字号'"
        class="font-size-btn"
        style="width: 20%"
        @click="emitRichTextCommand('fontsize-add')"
        ><IconFontSize />+</Button
      >
      <Button
        v-tooltip="'减小字号'"
        last
        class="font-size-btn"
        style="width: 20%"
        @click="emitRichTextCommand('fontsize-reduce')"
        ><IconFontSize />-</Button
      >
    </ButtonGroup>

    <ButtonGroup class="row">
      <CheckboxButton
        v-tooltip="'加粗'"
        style="flex: 1"
        :checked="richTextAttrs.bold"
        @click="emitRichTextCommand('bold')"
        ><IconTextBold
      /></CheckboxButton>
      <CheckboxButton
        v-tooltip="'斜体'"
        style="flex: 1"
        :checked="richTextAttrs.em"
        @click="emitRichTextCommand('em')"
        ><IconTextItalic
      /></CheckboxButton>
      <CheckboxButton
        v-tooltip="'下划线'"
        style="flex: 1"
        :checked="richTextAttrs.underline"
        @click="emitRichTextCommand('underline')"
        ><IconTextUnderline
      /></CheckboxButton>
      <CheckboxButton
        v-tooltip="'删除线'"
        style="flex: 1"
        :checked="richTextAttrs.strikethrough"
        @click="emitRichTextCommand('strikethrough')"
        ><IconStrikethrough
      /></CheckboxButton>
    </ButtonGroup>

    <ButtonGroup class="row">
      <CheckboxButton
        v-tooltip="'上标'"
        style="flex: 1"
        :checked="richTextAttrs.superscript"
        @click="emitRichTextCommand('superscript')"
        >A²</CheckboxButton
      >
      <CheckboxButton
        v-tooltip="'下标'"
        style="flex: 1"
        :checked="richTextAttrs.subscript"
        @click="emitRichTextCommand('subscript')"
        >A₂</CheckboxButton
      >
      <CheckboxButton
        v-tooltip="'行内代码'"
        style="flex: 1"
        :checked="richTextAttrs.code"
        @click="emitRichTextCommand('code')"
        ><IconCode
      /></CheckboxButton>
      <CheckboxButton
        v-tooltip="'引用'"
        style="flex: 1"
        :checked="richTextAttrs.blockquote"
        @click="emitRichTextCommand('blockquote')"
        ><IconQuote
      /></CheckboxButton>
    </ButtonGroup>

    <ButtonGroup class="row" passive>
      <CheckboxButton
        v-tooltip="'清除格式'"
        first
        style="flex: 1"
        @click="emitRichTextCommand('clear')"
        ><IconFormat
      /></CheckboxButton>
      <CheckboxButton
        v-tooltip="'格式刷（双击连续使用）'"
        style="flex: 1"
        :checked="!!textFormatPainter"
        @click="toggleTextFormatPainter()"
        @dblclick="toggleTextFormatPainter(true)"
        ><IconFormatBrush
      /></CheckboxButton>
      <Popover
        v-model:value="linkPopoverVisible"
        placement="bottom-end"
        trigger="click"
        style="width: 33.33%"
      >
        <template #content>
          <div class="link-popover">
            <Input v-model:value="link" placeholder="请输入超链接" />
            <div class="btns">
              <Button
                size="small"
                :disabled="!richTextAttrs.link"
                style="margin-right: 5px"
                @click="removeLink()"
                >移除</Button
              >
              <Button size="small" type="primary" @click="updateLink(link)"
                >确认</Button
              >
            </div>
          </div>
        </template>
        <CheckboxButton
          v-tooltip="'超链接'"
          last
          style="width: 100%"
          :checked="!!richTextAttrs.link"
          @click="openLinkPopover()"
          ><IconLinkOne
        /></CheckboxButton>
      </Popover>
    </ButtonGroup>
    <Divider />

    <RadioGroup
      class="row"
      button-style="solid"
      :value="richTextAttrs.align"
      @update:value="(value) => emitRichTextCommand('align', value)"
    >
      <RadioButton v-tooltip="'左对齐'" value="left" style="flex: 1"
        ><IconAlignTextLeft
      /></RadioButton>
      <RadioButton v-tooltip="'居中'" value="center" style="flex: 1"
        ><IconAlignTextCenter
      /></RadioButton>
      <RadioButton v-tooltip="'右对齐'" value="right" style="flex: 1"
        ><IconAlignTextRight
      /></RadioButton>
      <RadioButton v-tooltip="'两端对齐'" value="justify" style="flex: 1"
        ><IconAlignTextBoth
      /></RadioButton>
    </RadioGroup>

    <div class="row" passive>
      <ButtonGroup style="flex: 1">
        <Button
          v-tooltip="'项目符号'"
          first
          :type="richTextAttrs.bulletList ? 'primary' : 'default'"
          style="flex: 1"
          @click="emitRichTextCommand('bulletList')"
          ><IconList
        /></Button>
        <Popover v-model:value="bulletListPanelVisible" trigger="click">
          <template #content>
            <div class="list-wrap">
              <ul
                v-for="item in bulletListStyleTypeOption"
                :key="item"
                class="list"
                :style="{ listStyleType: item }"
                @click="emitRichTextCommand('bulletList', item)"
              >
                <li v-for="key in 3" :key="key" class="list-item">
                  <span />
                </li>
              </ul>
            </div>
          </template>
          <Button last class="popover-btn"><IconDown /></Button>
        </Popover>
      </ButtonGroup>
      <div style="width: 10px" />
      <ButtonGroup style="flex: 1" passive>
        <Button
          v-tooltip="'编号'"
          first
          :type="richTextAttrs.orderedList ? 'primary' : 'default'"
          style="flex: 1"
          @click="emitRichTextCommand('orderedList')"
          ><IconOrderedList
        /></Button>
        <Popover v-model:value="orderedListPanelVisible" trigger="click">
          <template #content>
            <div class="list-wrap">
              <ul
                v-for="item in orderedListStyleTypeOption"
                :key="item"
                class="list"
                :style="{ listStyleType: item }"
                @click="emitRichTextCommand('orderedList', item)"
              >
                <li v-for="key in 3" :key="key" class="list-item">
                  <span />
                </li>
              </ul>
            </div>
          </template>
          <Button last class="popover-btn"><IconDown /></Button>
        </Popover>
      </ButtonGroup>
    </div>

    <div class="row">
      <ButtonGroup style="flex: 1" passive>
        <Button
          v-tooltip="'减小段落缩进'"
          first
          style="flex: 1"
          @click="emitRichTextCommand('indent', '-1')"
          ><IconIndentLeft
        /></Button>
        <Popover v-model:value="indentLeftPanelVisible" trigger="click">
          <template #content>
            <PopoverMenuItem @click="emitRichTextCommand('textIndent', '-1')"
              >减小首行缩进</PopoverMenuItem
            >
          </template>
          <Button last class="popover-btn"><IconDown /></Button>
        </Popover>
      </ButtonGroup>
      <div style="width: 10px" />
      <ButtonGroup style="flex: 1" passive>
        <Button
          v-tooltip="'增大段落缩进'"
          first
          style="flex: 1"
          @click="emitRichTextCommand('indent', '+1')"
          ><IconIndentRight
        /></Button>
        <Popover v-model:value="indentRightPanelVisible" trigger="click">
          <template #content>
            <PopoverMenuItem @click="emitRichTextCommand('textIndent', '+1')"
              >增大首行缩进</PopoverMenuItem
            >
          </template>
          <Button last class="popover-btn"><IconDown /></Button>
        </Popover>
      </ButtonGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import emitter, { EmitterEvents } from '@/utils/emitter'
import { FONTS } from '@/configs/font'
import useTextFormatPainter from '@/hooks/useTextFormatPainter'
import message from '@/utils/message'

import TextColorButton from '@/components/TextColorButton.vue'
import CheckboxButton from '@/components/CheckboxButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Input from '~/components/Input.vue'
import Button from '~/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import Select from '~/components/Select.vue'
import SelectGroup from '@/components/SelectGroup.vue'
import Divider from '~/components/Divider.vue'
import Popover from '~/components/Popover.vue'
import RadioButton from '@/components/RadioButton.vue'
import RadioGroup from '@/components/RadioGroup.vue'
import PopoverMenuItem from '@/components/PopoverMenuItem.vue'

const { richTextAttrs, textFormatPainter } = storeToRefs(useMainStore())

const { toggleTextFormatPainter } = useTextFormatPainter()

const fontSizeOptions = [
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '28px',
  '32px',
  '36px',
  '40px',
  '44px',
  '48px',
  '54px',
  '60px',
  '66px',
  '72px',
  '76px',
  '80px',
  '88px',
  '96px',
  '104px',
  '112px',
  '120px',
]

const emitRichTextCommand = (command: string, value?: string) => {
  emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { action: { command, value } })
}

const bulletListPanelVisible = ref(false)
const orderedListPanelVisible = ref(false)
const indentLeftPanelVisible = ref(false)
const indentRightPanelVisible = ref(false)

const bulletListStyleTypeOption = ref(['disc', 'circle', 'square'])
const orderedListStyleTypeOption = ref([
  'decimal',
  'lower-roman',
  'upper-roman',
  'lower-alpha',
  'upper-alpha',
  'lower-greek',
])

const link = ref('')
const linkPopoverVisible = ref(false)

watch(richTextAttrs, () => (linkPopoverVisible.value = false))

const openLinkPopover = () => {
  link.value = richTextAttrs.value.link
}
const updateLink = (link?: string) => {
  const linkRegExp =
    /^(https?):\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/
  if (!link || !linkRegExp.test(link))
    return message.error('不是正确的网页链接地址')

  emitRichTextCommand('link', link)
  linkPopoverVisible.value = false
}

const removeLink = () => {
  emitRichTextCommand('link')
  linkPopoverVisible.value = false
}
</script>

<style lang="scss" scoped>
.rich-text-base {
  user-select: none;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.font-size-btn {
  padding: 0;
}
.link-popover {
  width: 240px;

  .btns {
    margin-top: 10px;
    text-align: right;
  }
}
.list-wrap {
  width: 176px;
  color: #666;
  padding: 8px;
  margin: -12px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
.list {
  background-color: $lightGray;
  padding: 4px 4px 4px 20px;
  cursor: pointer;

  &:not(:nth-child(3n)) {
    margin-right: 8px;
  }

  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6) {
    margin-top: 8px;
  }

  &:hover {
    color: $themeColor;

    span {
      background-color: $themeColor;
    }
  }
}
.list-item {
  width: 24px;
  height: 12px;
  position: relative;
  font-size: 12px;
  top: -3px;

  span {
    width: 100%;
    height: 2px;
    display: inline-block;
    position: absolute;
    top: 8px;
    background-color: #666;
  }
}
.popover-btn {
  padding: 0 3px;
}
</style>
