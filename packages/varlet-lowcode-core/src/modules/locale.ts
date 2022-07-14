import { ref, onUnmounted, computed } from 'vue'
import { removeItem } from '@varlet/shared'
import { get } from 'lodash-es'
import type { Ref, ComputedRef } from 'vue'

export interface Locale {
  t(path: string): string
}

export interface LocaleManager {
  use(language: string): void

  useLocale<T extends LocaleConfig>(config: T): Locale
}

export type LocaleConfig = Record<string, Record<string, any>>

export function createLocaleManager(): LocaleManager {
  const configs: Record<string, any>[] = []
  const currentLanguage: Ref<string> = ref('zh-CN')

  function useLocale<T extends LocaleConfig>(config: T) {
    if (!configs.includes(config)) {
      configs.push(config)
    }

    const pack: ComputedRef<Record<string, any>> = computed(() => config[currentLanguage.value])

    function t(path: string): string {
      return get(pack.value, path)
    }

    onUnmounted(() => {
      removeItem(configs, config)
    })

    return { t }
  }

  function use(language: string) {
    currentLanguage.value = language
  }

  return { use, useLocale }
}

export default createLocaleManager()
