import { reactive } from 'vue'

function createStore() {
  const store = reactive<Record<string, any>>({})

  return {
    set(key: string, value: any) {
      store[key] = value
    },

    get(key: string) {
      return store[key]
    },

    delete(key: string) {
      Reflect.deleteProperty(store, key)
    },

    getStore() {
      return store
    },
  }
}

export default createStore()
