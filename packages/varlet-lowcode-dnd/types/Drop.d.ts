import type { Directive, Plugin } from 'vue'
export interface DropOptions {
  dropStyle?: Partial<CSSStyleDeclaration>
  type?: DataTransfer['dropEffect']
}
declare const VarletLowCodeDrop: Directive & Plugin
export default VarletLowCodeDrop
