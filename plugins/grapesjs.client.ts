// plugins/grapesjs.client.ts
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import 'grapesjs-preset-webpage'
import 'grapesjs-blocks-basic'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      grapesjs,
    },
  }
})
