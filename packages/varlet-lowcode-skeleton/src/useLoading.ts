import { onUnmounted, ref } from 'vue'
import { BuiltInEvents, eventsManager } from '@varlet/lowcode-core'

export function useLoading() {
  const loading = ref(1)

  const handleLoading = () => {
    loading.value++
  }
  const handleLoaded = () => {
    loading.value--
  }

  eventsManager.on(BuiltInEvents.LOADING, handleLoading)
  eventsManager.on(BuiltInEvents.LOADED, handleLoaded)

  onUnmounted(() => {
    eventsManager.off(BuiltInEvents.LOADING, handleLoading)
    eventsManager.off(BuiltInEvents.LOADED, handleLoaded)
  })

  return {
    loading,
  }
}
