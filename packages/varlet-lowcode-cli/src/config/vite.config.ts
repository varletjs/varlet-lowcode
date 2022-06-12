import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import { injectHtml } from 'vite-plugin-html'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import {
  PLAYGROUND_DIR,
  PLAYGROUND_OUTPUT_PATH,
  PLAYGROUND_PUBLIC_PATH,
  PLUGIN_JS_ENTRY,
  PLUGIN_OUTPUT_FORMATS,
  PLUGIN_OUTPUT_PATH,
  PLUGIN_TS_ENTRY,
  USER_PLAYGROUND_DIR,
  VITE_RESOLVE_EXTENSIONS,
} from '../shared/constant'
import { InlineConfig, PluginOption } from 'vite'
import { get } from 'lodash'
import { resolve } from 'path'
import { pathExistsSync, readFileSync, removeSync, writeFileSync } from 'fs-extra'

export const camelize = (s: string): string => s.replace(/-(\w)/g, (_: any, p: string) => p.toUpperCase())

export function bigCamelize(str: string): string {
  return camelize(str).replace(str.charAt(0), str.charAt(0).toUpperCase())
}

export function getEntry() {
  if (pathExistsSync(PLUGIN_TS_ENTRY)) {
    return PLUGIN_TS_ENTRY
  }

  if (pathExistsSync(PLUGIN_JS_ENTRY)) {
    return PLUGIN_JS_ENTRY
  }
}

export function getRoot() {
  if (pathExistsSync(resolve(USER_PLAYGROUND_DIR, 'index.html'))) {
    return USER_PLAYGROUND_DIR
  }

  return PLAYGROUND_DIR
}

const commonPlugins = [vue(), jsx()]

export function getDevConfig(varletLowCodeConfig: Record<string, any>): InlineConfig {
  const host = get(varletLowCodeConfig, 'host')

  return {
    root: getRoot(),
    resolve: {
      extensions: VITE_RESOLVE_EXTENSIONS,
      alias: {
        '@plugin': getEntry()!,
      },
    },
    server: {
      port: get(varletLowCodeConfig, 'port'),
      host: host === 'localhost' ? '0.0.0.0' : host,
    },
    publicDir: PLAYGROUND_PUBLIC_PATH,
    plugins: [
      ...commonPlugins,
      injectHtml({
        data: get(varletLowCodeConfig, 'playground', {}),
      }),
      viteExternalsPlugin({ vue: 'Vue' }),
    ],
  }
}

export function getBuildConfig(varletLowCodeConfig: Record<string, any>): InlineConfig {
  const devConfig = getDevConfig(varletLowCodeConfig)

  return {
    ...devConfig,
    base: './',
    build: {
      outDir: PLAYGROUND_OUTPUT_PATH,
      brotliSize: false,
      emptyOutDir: true,
      cssTarget: 'chrome61',
      rollupOptions: {
        input: {
          main: resolve(getRoot(), 'index.html'),
        },
      },
    },
  }
}

function inlineCSS(name: string): PluginOption {
  return {
    name: 'varlet-low-code-inline-css-vite-plugin',
    apply: 'build',
    closeBundle() {
      const cssFile = resolve(PLUGIN_OUTPUT_PATH, 'style.css')
      if (!pathExistsSync(cssFile)) {
        return
      }

      const cssCode = readFileSync(cssFile, 'utf-8')
      const injectCode = `;(function(){var style=document.createElement('style');style.type='text/css';\
style.rel='stylesheet';style.appendChild(document.createTextNode(\`${cssCode.replace(/\\/g, '\\\\')}\`));\
var head=document.querySelector('head');head.appendChild(style)})();`

      PLUGIN_OUTPUT_FORMATS.forEach((format) => {
        const fileName = `${name}.${format}.js`
        const jsFile = resolve(PLUGIN_OUTPUT_PATH, fileName)
        const jsCode = readFileSync(jsFile, 'utf-8')
        writeFileSync(jsFile, `${injectCode}${jsCode}`)
      })

      removeSync(cssFile)
    },
  }
}

export function getLibConfig(varletLowCodeConfig: Record<string, any>): InlineConfig {
  const name = get(varletLowCodeConfig, 'name')

  return {
    build: {
      emptyOutDir: true,
      outDir: PLUGIN_OUTPUT_PATH,
      lib: {
        name: bigCamelize(name),
        formats: PLUGIN_OUTPUT_FORMATS,
        fileName: (format) => `${name}.${format}.js`,
        entry: getEntry()!,
      },
      rollupOptions: {
        external: ['vue', '@varlet/lowcode-core'],
        output: {
          exports: 'named',
          globals: {
            vue: 'Vue',
            '@varlet/lowcode-core': 'VarletLowcodeCore',
          },
        },
      },
    },
    plugins: [...commonPlugins, inlineCSS(name)],
  }
}
