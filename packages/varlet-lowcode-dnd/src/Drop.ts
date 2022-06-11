import { defineComponent, h, ref, VNode } from 'vue'
import type { PropType, Ref } from 'vue'

export type DropStatus = 'enter' | 'dropped' | 'none'

export default defineComponent({
  name: 'VarletLowDrop',

  props: {
    type: {
      type: String as PropType<DataTransfer['dropEffect']>,
      default: 'none',
    },
    dropStyle: {
      type: Object as PropType<CSSStyleDeclaration>,
      default: () => ({}),
    },
    defaultSlotRender: {
      type: Object as PropType<VNode>,
    },
  },

  emits: ['dragenter', 'dragover', 'dragleave', 'drop'],

  setup(props, ctx) {
    const { emit: emits } = ctx
    const { dropStyle, type, defaultSlotRender } = props
    const dropStatus: Ref<DropStatus> = ref('none')

    const onDragEnter = (e: DragEvent) => {
      if (e.target !== e.currentTarget) return
      dropStatus.value = 'enter'
      emits('dragenter', e)
    }

    const onDragLeave = (e: DragEvent) => {
      if (e.target !== e.currentTarget) return
      dropStatus.value = 'none'
      e.dataTransfer!.dropEffect = 'none'
      emits('dragleave', e)
    }

    const onDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.dataTransfer!.dropEffect = type
      emits('dragover', e)
    }

    const onDrop = (e: DragEvent) => {
      dropStatus.value = 'none'
      const data = e.dataTransfer!.getData('text/plain')
      emits('drop', data, e)
    }

    const defaultSlots = ctx.slots.default ? ctx.slots.default() : [defaultSlotRender || h('div', '可以拖拽到这里哟')]

    return () =>
      h(
        'div',
        {
          style: dropStyle,
          onDragLeave,
          onDragOver,
          onDragEnter,
          onDrop,
        },
        defaultSlots
      )
  },
})
