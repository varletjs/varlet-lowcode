export declare type Listener = (...args: any[]) => void
export interface ListenerDescriptor {
  listener: Listener
  event: string
  once: boolean
}
export interface EventManager {
  on(event: string, listener: Listener): void
  once(event: string, listener: Listener): void
  off(event: string, listener: Listener): void
  emit(event: string, ...args: any[]): void
}
export declare function createEventManager(): EventManager
declare const _default: EventManager
export default _default
