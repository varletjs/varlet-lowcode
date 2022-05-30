export type Listener = (...args: any[]) => void

export interface ListenerDescriptor {
  listener: Listener
  event: string
  once: boolean
}

const listenerDescriptors: ListenerDescriptor[] = []

export function on(event: string, listener: Listener) {
  listenerDescriptors.push({
    event,
    listener,
    once: false,
  })
}

export function once(event: string, listener: Listener) {
  listenerDescriptors.push({
    event,
    listener,
    once: true,
  })
}

export function off(event: string, listener: Listener) {
  const listenerDescriptorIndex = listenerDescriptors.findIndex((listenerDescriptor) => {
    return listenerDescriptor.event === event && listenerDescriptor.listener === listener
  })

  if (listenerDescriptorIndex === -1) {
    return
  }

  listenerDescriptors.splice(listenerDescriptorIndex, 1)
}

export function emit(event: string, ...args: any[]) {
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

export interface Events {
  on(event: string, listener: Listener): void

  once(event: string, listener: Listener): void

  off(event: string, listener: Listener): void

  emit(event: string, ...args: any[]): void
}

export const events: Events = {
  on,

  once,

  off,

  emit,
}

export default events
