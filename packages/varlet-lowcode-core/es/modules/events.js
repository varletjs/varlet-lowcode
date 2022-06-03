export function createEventManager() {
  const listenerDescriptors = []
  function on(event, listener) {
    listenerDescriptors.push({
      event,
      listener,
      once: false,
    })
  }
  function once(event, listener) {
    listenerDescriptors.push({
      event,
      listener,
      once: true,
    })
  }
  function off(event, listener) {
    const listenerDescriptorIndex = listenerDescriptors.findIndex((listenerDescriptor) => {
      return listenerDescriptor.event === event && listenerDescriptor.listener === listener
    })
    if (listenerDescriptorIndex === -1) {
      return
    }
    listenerDescriptors.splice(listenerDescriptorIndex, 1)
  }
  function emit(event, ...args) {
    const onceListenerDescriptors = []
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
export default createEventManager()
