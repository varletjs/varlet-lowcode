<script setup lang="ts">
import { onUnmounted, ref, defineProps, watch } from 'vue'
import { Button as VarButton, Icon as VarIcon, Menu as VarMenu, Cell as VarCell, Ripple as vRipple } from '@varlet/ui'
import { eventsManager, localeManager } from '@varlet/lowcode-core'
import { DesignerEvents } from '@varlet/lowcode-designer'
import '@varlet/ui/es/button/style/index.js'
import '@varlet/ui/es/icon/style/index.js'
import '@varlet/ui/es/menu/style/index.js'
import '@varlet/ui/es/cell/style/index.js'
import type { Ref, PropType } from 'vue'
import type { Language } from './types'

const defaultLocale = 'zh-CN'

const { languages } = defineProps({
  languages: {
    type: Array as PropType<Language[]>,
    default: () => [
      {
        label: '中文',
        value: 'zh-CN',
      },
      {
        label: 'English',
        value: 'en-US',
      },
    ],
  },
})

const showMenu: Ref<boolean> = ref(false)
const locale: Ref<string> = ref(getCurrentLocale())

function closeMenu() {
  showMenu.value = false
}

function getCurrentLocale() {
  const query = new URLSearchParams(window.location.search)

  return query.get('locale') ?? defaultLocale
}

function handlePopState() {
  locale.value = getCurrentLocale()
}

function handleLanguageClick(value: string) {
  const { origin, pathname, search } = window.location

  const query = new URLSearchParams(search)
  query.set('locale', value)
  locale.value = value

  window.history.pushState(null, '', `${origin}${pathname}?${query.toString()}`)

  closeMenu()
}

watch(
  () => locale.value,
  (newLocale) => {
    localeManager.use(newLocale)
  },
  { immediate: true }
)

eventsManager.on(DesignerEvents.IFRAME_CLICK, closeMenu)
window.addEventListener('popstate', handlePopState)

onUnmounted(() => {
  eventsManager.off(DesignerEvents.IFRAME_CLICK, closeMenu)
  window.removeEventListener('popstate', handlePopState)
})
</script>

<template>
  <div class="varlet-low-code-locale-switcher">
    <var-menu v-model:show="showMenu" :offset-x="-40" :offset-y="34">
      <var-button text size="small" @click="showMenu = true">
        <var-icon name="translate" color="#666" :size="24" />
      </var-button>

      <template #menu>
        <div class="varlet-low-code-locale-switcher__language-list">
          <var-cell
            class="varlet-low-code-locale-switcher__language"
            :class="[locale === l.value ? 'varlet-low-code-locale-switcher--active' : null]"
            v-ripple
            v-for="l in languages"
            :key="l.value"
            @click="handleLanguageClick(l.value)"
          >
            {{ l.label }}
          </var-cell>
        </div>
      </template>
    </var-menu>
  </div>
</template>

<style lang="less">
.varlet-low-code-locale-switcher {
  padding-top: 3px;

  &__language-list {
    background: #fff;
  }

  &__language {
    width: 120px;
    transition: background-color 0.2s;

    &:hover {
      background: #edf5ff;
      color: #3a7afd;
      cursor: pointer;
    }
  }

  &--active {
    background: #edf5ff;
    color: #3a7afd;
  }
}
</style>
