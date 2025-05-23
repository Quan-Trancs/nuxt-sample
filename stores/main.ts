import { customAlphabet } from 'nanoid'
import { defineStore } from 'pinia'
import { ToolbarStates } from '@/types/toolbar'
import type {
  CreatingElement,
  ShapeFormatPainter,
  TextFormatPainter,
} from '@/types/edit'
import type { DialogForExportTypes } from '@/types/export'
import { type TextAttrs, defaultRichTextAttrs } from '@/utils/prosemirror/utils'

import { useSlidesStore } from './slides'

export interface MainState {
  activeElementIdList: string[]
  handleElementId: string
  activeGroupElementId: string
  hiddenElementIdList: string[]
  canvasPercentage: number
  canvasScale: number
  canvasDragged: boolean
  thumbnailsFocus: boolean
  editorAreaFocus: boolean
  disableHotkeys: boolean
  gridLineSize: number
  showRuler: boolean
  creatingElement: CreatingElement | null
  creatingCustomShape: boolean
  toolbarState: ToolbarStates
  clipingImageElementId: string
  isScaling: boolean
  richTextAttrs: TextAttrs
  selectedTableCells: string[]
  selectedSlidesIndex: number[]
  dialogForExport: DialogForExportTypes
  databaseId: string
  textFormatPainter: TextFormatPainter | null
  shapeFormatPainter: ShapeFormatPainter | null
  showSelectPanel: boolean
  showSearchPanel: boolean
  showNotesPanel: boolean
  showMarkupPanel: boolean
  showAIPPTDialog: boolean
}

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
)
export const databaseId = nanoid(10)

export const useMainStore = defineStore('main', {
  state: (): MainState => ({
    activeElementIdList: [], // IDs of selected elements, including handleElementId
    handleElementId: '', // ID of the element currently being operated on
    activeGroupElementId: '', // Within a group, the independently selected element ID
    hiddenElementIdList: [], // List of IDs of hidden elements
    canvasPercentage: 90, // Visible area percentage of the canvas
    canvasScale: 1, // Canvas zoom scale (based on slideStore.viewportSize pixels)
    canvasDragged: false, // Whether the canvas is being dragged
    thumbnailsFocus: false, // Whether the left-side navigation thumbnails are focused
    editorAreaFocus: false, // Whether the editing area is focused
    disableHotkeys: false, // Disable hotkeys
    gridLineSize: 0, // Grid size (0 means grid is not shown)
    showRuler: false, // Show ruler
    creatingElement: null, // Element being inserted that needs to be drawn (text, shape, line, etc.)
    creatingCustomShape: false, // Whether a custom polygon is being drawn
    toolbarState: ToolbarStates.SLIDE_DESIGN, // Right sidebar toolbar state
    clipingImageElementId: '', // ID of the image currently being cropped
    richTextAttrs: defaultRichTextAttrs, // Rich text formatting attributes
    selectedTableCells: [], // Selected table cells
    isScaling: false, // Whether an element is being scaled
    selectedSlidesIndex: [], // Indices of currently selected slides
    dialogForExport: '', // Export dialog state
    databaseId, // Unique identifier for the IndexedDB database of the app
    textFormatPainter: null, // Text format painter (copy/paste text styles)
    shapeFormatPainter: null, // Shape format painter (copy/paste shape styles)
    showSelectPanel: false, // Whether the selection panel is open
    showSearchPanel: false, // Whether the search and replace panel is open
    showNotesPanel: false, // Whether the notes panel is open
    showMarkupPanel: false, // Whether the annotation type panel is open
    showAIPPTDialog: false, // Whether the AI PPT creation dialog is open
  }),

  getters: {
    activeElementList(state) {
      const slidesStore = useSlidesStore()
      const currentSlide = slidesStore.currentSlide
      if (!currentSlide || !currentSlide.elements) return []
      return currentSlide.elements.filter((element) =>
        state.activeElementIdList.includes(element.id)
      )
    },

    handleElement(state) {
      const slidesStore = useSlidesStore()
      const currentSlide = slidesStore.currentSlide
      if (!currentSlide || !currentSlide.elements) return null
      return (
        currentSlide.elements.find(
          (element) => state.handleElementId === element.id
        ) || null
      )
    },
  },

  actions: {
    setActiveElementIdList(activeElementIdList: string[]) {
      if (activeElementIdList.length === 1)
        this.handleElementId = activeElementIdList[0]
      else this.handleElementId = ''

      this.activeElementIdList = activeElementIdList
    },

    setHandleElementId(handleElementId: string) {
      this.handleElementId = handleElementId
    },

    setActiveGroupElementId(activeGroupElementId: string) {
      this.activeGroupElementId = activeGroupElementId
    },

    setHiddenElementIdList(hiddenElementIdList: string[]) {
      this.hiddenElementIdList = hiddenElementIdList
    },

    setCanvasPercentage(percentage: number) {
      this.canvasPercentage = percentage
    },

    setCanvasScale(scale: number) {
      this.canvasScale = scale
    },

    setCanvasDragged(isDragged: boolean) {
      this.canvasDragged = isDragged
    },

    setThumbnailsFocus(isFocus: boolean) {
      this.thumbnailsFocus = isFocus
    },

    setEditorareaFocus(isFocus: boolean) {
      this.editorAreaFocus = isFocus
    },

    setDisableHotkeysState(disable: boolean) {
      this.disableHotkeys = disable
    },

    setGridLineSize(size: number) {
      this.gridLineSize = size
    },

    setRulerState(show: boolean) {
      this.showRuler = show
    },

    setCreatingElement(element: CreatingElement | null) {
      this.creatingElement = element
    },

    setCreatingCustomShapeState(state: boolean) {
      this.creatingCustomShape = state
    },

    setToolbarState(toolbarState: ToolbarStates) {
      this.toolbarState = toolbarState
    },

    setClipingImageElementId(elId: string) {
      this.clipingImageElementId = elId
    },

    setRichtextAttrs(attrs: TextAttrs) {
      this.richTextAttrs = attrs
    },

    setSelectedTableCells(cells: string[]) {
      this.selectedTableCells = cells
    },

    setScalingState(isScaling: boolean) {
      this.isScaling = isScaling
    },

    updateSelectedSlidesIndex(selectedSlidesIndex: number[]) {
      this.selectedSlidesIndex = selectedSlidesIndex
    },

    setDialogForExport(type: DialogForExportTypes) {
      this.dialogForExport = type
    },

    setTextFormatPainter(textFormatPainter: TextFormatPainter | null) {
      this.textFormatPainter = textFormatPainter
    },

    setShapeFormatPainter(shapeFormatPainter: ShapeFormatPainter | null) {
      this.shapeFormatPainter = shapeFormatPainter
    },

    setSelectPanelState(show: boolean) {
      this.showSelectPanel = show
    },

    setSearchPanelState(show: boolean) {
      this.showSearchPanel = show
    },

    setNotesPanelState(show: boolean) {
      this.showNotesPanel = show
    },

    setMarkupPanelState(show: boolean) {
      this.showMarkupPanel = show
    },

    setAIPPTDialogState(show: boolean) {
      this.showAIPPTDialog = show
    },
  },
})
