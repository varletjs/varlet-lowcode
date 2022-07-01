import { defineComponent, reactive, Teleport, ref } from 'vue'
import './popover.less'

export default defineComponent({
  setup(props, { slots }) {
    const isShow = ref(false)
    const popoverStyle = reactive({
      position: 'absolute',
      zIndex: '9999',
      top: '200px',
      left: '200px',
      padding: '0',
      transformOrigin: 'right bottom',
      maxWidth: '400px',
      maxHeight: '400px',
      minWidth: '50px',
      minHeight: '100px',
      opacity: 0,
    })

    const getDomLocation = (e: any) => {
      isShow.value = !isShow.value
      setTimeout(() => {
        const { clientX } = e
        const { clientY } = e
        // const { top, bottom, left, right } = document.getElementById('lowCode-popover')?.getBoundingClientRect() || { top: 0, bottom: 0, left: 0, right: 0 }
        const domWidth = document.getElementById('lowCode-popover')?.offsetWidth || 0
        const domHeight = document.getElementById('lowCode-popover')?.offsetHeight || 0
        popoverStyle.left = clientX - domWidth + 'px'
        popoverStyle.top = clientY - domHeight + 'px'
        popoverStyle.opacity = 100
        console.log(document.getElementById('lowCode-popover')?.getBoundingClientRect(), '213456')
        // if (top > 0)
      }, 100)
    }

    return () => {
      return (
        <div class="varlet-lowCode-popover">
          <div onClick={getDomLocation}>{slots.default ? slots.default() : <div>点击</div>}</div>

          {/* 这是具名插槽 */}
          <Teleport to="body">
            <div>
              {isShow.value ? (
                <div class="varlet-lowCode-popover-content" id="lowCode-popover" style={popoverStyle}>
                  {slots.chaoren ? slots.chaoren() : null}
                </div>
              ) : null}
            </div>
          </Teleport>
        </div>
      )
    }
  },
})
