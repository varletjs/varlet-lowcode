import type {  Directive } from "vue"

type MouseMoveOption = {

}

function onDragOver(event: MouseEvent) {
  console.log("eeee", event)
 
  
}


function mounted() {
  // el: HTMLElement
  const list = Array.from(document.querySelectorAll(".drag-item"))
  // el._mousemove = 
  const nodeComputedStyles = list.map((node: Element) => {
    return node.getBoundingClientRect()
  })
  console.log("nodeComputedStyles", nodeComputedStyles);
  document.addEventListener('dragover', onDragOver, { passive: false })
}

function unmounted() {
  document.removeEventListener('dragover', onDragOver)
}

export type VarletMouseMoveProps = Directive<any, MouseMoveOption>

export default {
  mounted,
  unmounted,
} as VarletMouseMoveProps