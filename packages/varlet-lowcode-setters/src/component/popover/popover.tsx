import { defineComponent, reactive, Teleport, ref, nextTick } from 'vue'
import { eventsManager } from '@varlet/lowcode-core'
import './popover.less'

export default defineComponent({
  setup(props, { slots }) {
    const isShow = ref(false)
    const classNameAfter = ref('')
    const popoverStyle = reactive({
      position: 'absolute',
      zIndex: '9999',
      top: '0',
      left: '0',
      padding: '0',
      maxWidth: '400px',
      maxHeight: '400px',
      minWidth: '50px',
      minHeight: '100px',
      opacity: 0,
    })

    const getDomLocation = async (e: any) => {
      e.stopPropagation()
      isShow.value = !isShow.value
      await nextTick()
      if (isShow.value) {
        const { x, y, width, height } = e.target.getBoundingClientRect()
        const domWidth = document.getElementById('lowCode-popover')?.offsetWidth || 0
        const domHeight = document.getElementById('lowCode-popover')?.offsetHeight || 0
        console.log(y, domHeight)
        popoverStyle.left = x - domWidth + width / 2 + 'px'
        popoverStyle.top = y - domHeight - 12 + 'px'
        classNameAfter.value = 'varlet-lowCode-popover-bottom-right'

        await nextTick()
        const { top, bottom, left, right } = document.getElementById('lowCode-popover')?.getBoundingClientRect() || {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }
        if (top < 0) {
          popoverStyle.left = x - domWidth + width / 2 + 'px'
          popoverStyle.top = y + 12 + height + 'px'
          classNameAfter.value = 'varlet-lowCode-popover-top-right'
          console.log(bottom, left, right)
        }

        popoverStyle.opacity = 100
        document.body?.addEventListener('click', clickFn)
        eventsManager.on('designer-iframe-click', clickFn)
      } else {
        clickFn()
      }
    }

    const clickFn = () => {
      isShow.value = false
      document.body?.removeEventListener('click', clickFn)
      eventsManager.off('designer-iframe-click', clickFn)
    }

    return () => {
      return (
        <div class="varlet-lowCode-popover">
          <div onClick={getDomLocation}>{slots.default ? slots.default() : <div>点击</div>}</div>

          {/* 这是具名插槽 */}
          <Teleport to="body">
            <div>
              {isShow.value ? (
                <div
                  class={`varlet-lowCode-popover-content ${classNameAfter.value}`}
                  id="lowCode-popover"
                  style={popoverStyle}
                  onClick={(e) => e.stopPropagation()}
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
