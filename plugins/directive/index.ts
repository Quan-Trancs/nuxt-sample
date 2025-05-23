import Contextmenu from './contextmenu'
import ClickOutside from './clickOutside'
import Tooltip from './tooltip'

export default defineNuxtPlugin((nuxtApp) => {
  const app = nuxtApp.vueApp
  app.directive('contextmenu', Contextmenu)
  app.directive('click-outside', ClickOutside)
  app.directive('tooltip', Tooltip)
})
