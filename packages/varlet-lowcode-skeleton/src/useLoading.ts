import { onUnmounted, ref } from 'vue'
import { eventsManager } from '@varlet/lowcode-core'

export function useLoading() {
  const loading = ref(0)

  const handleLoading = () => {
    loading.value++
  }

  const handleLoaded = () => {
    loading.value--
  }

  eventsManager.on('skeleton-loading', handleLoading)
  eventsManager.on('skeleton-loaded', handleLoaded)

  onUnmounted(() => {
    eventsManager.off('skeleton-loading', handleLoading)
    eventsManager.off('skeleton-loaded', handleLoaded)
  })

  return {
    loading,
  }
}
