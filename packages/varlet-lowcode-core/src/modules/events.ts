export type Listener = (...args: any[]) => void

export interface ListenerDescriptor {
  listener: Listener
  event: string
  once: boolean
}

export interface EventsManager {
  on(event: string, listener: Listener): void

  once(event: string, listener: Listener): void

  off(event: string, listener: Listener): void

  emit(event: string, ...args: any[]): void
}

export function createEventsManager(): EventsManager {
  const listenerDescriptors: ListenerDescriptor[] = []

  function on(event: string, listener: Listener) {
    listenerDescriptors.push({
      event,
      listener,
      once: false,
    })
  }

  function once(event: string, listener: Listener) {
    listenerDescriptors.push({
      event,
      listener,
      once: true,
    })
  }

  function off(event: string, listener: Listener) {
    const listenerDescriptorIndex = listenerDescriptors.findIndex((listenerDescriptor) => {
      return listenerDescriptor.event === event && listenerDescriptor.listener === listener
    })

    if (listenerDescriptorIndex === -1) {
      return
    }

    listenerDescriptors.splice(listenerDescriptorIndex, 1)
  }

  function emit(event: string, ...args: any[]) {
    const onceListenerDescriptors: ListenerDescriptor[] = []

    listenerDescriptors.forEach((listenerDescriptor) => {
      if (listenerDescriptor.event === event) {
        listenerDescriptor.listener(...args)

        if (listenerDescriptor.once) {
          onceListenerDescriptors.push(listenerDescriptor)
        }
      }
    })

    onceListenerDescriptors.forEach((listenerDescriptor) => {
      off(listenerDescriptor.event, listenerDescriptor.listener)
    })
  }

  return {
    on,

    once,

    off,

    emit,
  }
}

export default createEventsManager()
