import type { App, Directive, DirectiveBinding, Plugin } from "vue"

type MouseOverOption = {

}

function onMouseOver(event: MouseEvent) {
  console.log("eeee", event);
  
}


function mounted( props: DirectiveBinding<MouseOverOption>) {
  console.log("ppp", props);
  
  document.addEventListener('drop', onMouseOver, { passive: false })
}

function unmounted() {
  document.removeEventListener('drop', onMouseOver)
}

export type VarletMouseMoveProps = Directive<any, MouseOverOption> & Plugin

export default {
  mounted,
  unmounted,
  install(app: App) {
    app.directive('drop', this)
  },
} as VarletMouseMoveProps