<template>
  <div v-if="disabled" class="select-wrap">
    <div ref="selectRef" class="select disabled">
      <div class="selector"><slot name="label" /></div>
      <div class="icon">
        <slot name="icon">
          <IconDown :size="14" />
        </slot>
      </div>
    </div>
  </div>
  <Popover
    v-else
    v-model:value="popoverVisible"
    class="select-wrap"
    trigger="click"
    placement="bottom"
    :content-style="{
      padding: 0,
      boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08)',
    }"
  >
    <template #content>
      <div
        class="options"
        :style="{ width: width + 2 + 'px' }"
        @click="popoverVisible = false"
      >
        <slot name="options" />
      </div>
    </template>
    <div ref="selectRef" class="select">
      <div class="selector"><slot name="label" /></div>
      <div class="icon">
        <slot name="icon">
          <IconDown :size="14" />
        </slot>
      </div>
    </div>
  </Popover>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Popover from './Popover.vue'

withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)

const popoverVisible = ref(false)
const selectRef = ref<HTMLElement>()
const width = ref(0)

const updateWidth = () => {
  if (!selectRef.value) return
  width.value = selectRef.value.clientWidth
}
const resizeObserver = new ResizeObserver(updateWidth)
onMounted(() => {
  if (!selectRef.value) return
  resizeObserver.observe(selectRef.value)
})
onUnmounted(() => {
  if (!selectRef.value) return
  resizeObserver.unobserve(selectRef.value)
})
</script>

<style lang="scss" scoped>
.select {
  width: 100%;
  height: 32px;
  padding-right: 32px;
  border-radius: $borderRadius;
  transition: border-color 0.25s;
  font-size: 13px;
  user-select: none;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  position: relative;
  cursor: pointer;

  &:not(.disabled):hover {
    border-color: $themeColor;
  }

  &.disabled {
    background-color: #f5f5f5;
    border-color: #dcdcdc;
    color: #b7b7b7;
    cursor: default;
  }

  .selector {
    min-width: 50px;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    @include ellipsis-oneline();
  }
}
.options {
  max-height: 260px;
  padding: 5px;
  overflow: auto;
  text-align: left;
  font-size: 13px;
  user-select: none;
}
.icon {
  width: 32px;
  height: 30px;
  color: #bfbfbf;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
