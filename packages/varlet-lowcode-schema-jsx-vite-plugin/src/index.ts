import type { Plugin } from 'vite'
import { transform } from './transform'

function createVarletLowCodeJsxVitePlugin(): Plugin {
  return {
    name: 'varlet-lowcode-jsx-vite-plugin',
    enforce: 'pre',
    transform(source, id) {
      if (!/\.schema\.(t|j)sx$/.test(id)) {
        return
      }

      try {
        return transform(source)
      } catch (e: any) {
        this.error(e)
        return ''
      }
    },
  }
}

export default createVarletLowCodeJsxVitePlugin
