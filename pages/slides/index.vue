<template>
  <div>
    <template v-if="slides.length">
      <Screen v-if="screening" />
      <Editor v-else-if="_isPC" />
      <Mobile v-else />
    </template>
    <FullscreenSpin
      v-else
      tip="数据初始化中，请稍等 ..."
      loading
      :mask="false"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from '@/configs/storage'
import { deleteDiscardedDB } from '@/utils/database'
import { isPC } from '@/utils/common'
import type { Slide } from '@/types/slides'
import message from '@/utils/message'
import api from '@/services'

import Editor from '@/views/Editor/index.vue'
import Screen from '@/views/Screen/index.vue'
import Mobile from '@/views/Mobile/index.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'

const _isPC = isPC()

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const snapshotStore = useSnapshotStore()
const { databaseId } = storeToRefs(mainStore)
const { slides } = storeToRefs(slidesStore)
const { screening } = storeToRefs(useScreenStore())

if (import.meta.env.MODE !== 'development') {
  window.onbeforeunload = () => false
}

onMounted(async () => {
  if (location.hostname === 'localhost') {
    message.error(
      '本地开发请访问 http://127.0.0.1:5173，否则不保证数据可靠性',
      { duration: 0, closable: true }
    )
    api.getMockData('slides').then((slides: Slide[]) => {
      slidesStore.setSlides(slides)
    })
  } else {
    api.getFileData('slides').then((slides: Slide[]) => {
      slidesStore.setSlides(slides)
    })
  }

  await deleteDiscardedDB()
  snapshotStore.initSnapshotDatabase()
})

// 应用注销时向 localStorage 中记录下本次 indexedDB 的数据库ID，用于之后清除数据库
window.addEventListener('unload', () => {
  const discardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB)
  const discardedDBList: string[] = discardedDB ? JSON.parse(discardedDB) : []

  discardedDBList.push(databaseId.value)

  const newDiscardedDB = JSON.stringify(discardedDBList)
  localStorage.setItem(LOCALSTORAGE_KEY_DISCARDED_DB, newDiscardedDB)
})
</script>

<style lang="scss" scoped></style>

<style lang="scss">
#app {
  height: 100%;
}
</style>
