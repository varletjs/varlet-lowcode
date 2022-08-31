export type Listener = (...args: any[]) => void

export interface ListenerDescriptor {
  listener: Listener
  event: string
  once: boolean
  task?(): void
}

export interface EventsManager {
  on(event: string, listener: Listener): void

  once(event: string, listener: Listener): void

  off(event: string, listener: Listener): void

  emit(event: string, ...args: any[]): void
}

export function createEventsManager(): EventsManager {
  const listenerDescriptors: ListenerDescriptor[] = []
  let listenerDescriptorQueue: ListenerDescriptor[] = []

  function has(event: string, listener: Listener) {
    return listenerDescriptors.some((listenerDescriptor) => {
      return listenerDescriptor.listener === listener && listenerDescriptor.event === event
    })
  }

  function on(event: string, listener: Listener) {
    if (has(event, listener)) {
      return
    }

    listenerDescriptors.push({
      event,
      listener,
      once: false,
    })
  }

  function once(event: string, listener: Listener) {
    if (has(event, listener)) {
      return
    }

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
    listenerDescriptorQueue = listenerDescriptorQueue.filter((listenerDescriptor) => listenerDescriptor.event !== event)

    listenerDescriptors.forEach((listenerDescriptor) => {
      if (listenerDescriptor.event === event) {
        listenerDescriptorQueue.push({
          ...listenerDescriptor,
          task: () => {
            listenerDescriptor.listener(...args)
          },
        })
      }
    })

    flushQueue()
  }

  function flushQueue() {
    while (listenerDescriptorQueue.length > 0) {
      const listenerDescriptor = listenerDescriptorQueue.shift()!

      if (listenerDescriptor.once) {
        off(listenerDescriptor.event, listenerDescriptor.listener)
      }

      listenerDescriptor.task!()
    }
  }

  return {
    on,

    once,

    off,

    emit,
  }
}

export default createEventsManager()
