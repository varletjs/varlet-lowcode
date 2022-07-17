import { defineComponent, reactive, Teleport, ref, nextTick } from 'vue'
import { eventsManager } from '@varlet/lowcode-core'
import './popover.less'

interface styleType {
  position: any
  zIndex: any
  top: any
  left: any
  padding: any
  maxWidth: any
  maxHeight: any
  opacity: any
}
export default defineComponent({
  setup(props, { slots }) {
    const isShow = ref(false)
    const classNameAfter = ref('')
    const popoverStyle: styleType = reactive({
      position: 'absolute',
      zIndex: '9999',
      top: '0',
      left: '0',
      padding: '0',
      maxWidth: '400px',
      maxHeight: '400px',
      opacity: 0,
    })

    const getDomLocation = async (e: any) => {
      e.stopPropagation()
      isShow.value = !isShow.value
      await nextTick()
      if (isShow.value) {
        const { x, y, width, height } = e.target.getBoundingClientRect()
        const domWidth = document.getElementById('low-code-popover')?.offsetWidth || 0
        const domHeight = document.getElementById('low-code-popover')?.offsetHeight || 0

        popoverStyle.left = x - domWidth + width / 2 + 'px'
        popoverStyle.top = y + 12 + height + 'px'
        classNameAfter.value = 'varlet-low-code-popover-top-right'

        await nextTick()
        const { top, bottom, left, right } = document.getElementById('low-code-popover')?.getBoundingClientRect() || {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }
        const bodyHeight = document.body.clientHeight
        const bodyWidth = document.body.clientWidth
        if (bottom > bodyHeight) {
          popoverStyle.top = y - domHeight - 12 + 'px'
          classNameAfter.value = 'varlet-low-code-popover-bottom-right'
        }
        if (left < 0) {
          popoverStyle.left = x + width / 2 + 'px'
          classNameAfter.value = 'varlet-low-code-popover-top-left'
        }
        if (right < bodyWidth) {
          // alert()
        }

        popoverStyle.opacity = 100
        document.body?.addEventListener('click', clickFn)
        eventsManager.once('designer-iframe-click', clickFn)
      } else {
        clickFn()
      }
    }

    const clickFn = () => {
      popoverStyle.opacity = 0
      isShow.value = false
      document.body?.removeEventListener('click', clickFn)
    }

    return () => {
      return (
        <div class="varlet-low-code-popover">
          <div onClick={getDomLocation}>{slots.default ? slots.default() : <div>点击</div>}</div>

          {/* 这是具名插槽 */}
          <Teleport to="body">
            <div>
              {isShow.value ? (
                <div
                  class={`varlet-low-code-popover__content ${classNameAfter.value}`}
                  id="low-code-popover"
                  style={popoverStyle}
                >
                  {slots.content ? slots.content() : null}
                </div>
              ) : null}
            </div>
          </Teleport>
        </div>
      )
    }
  },
})
