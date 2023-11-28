import { writable, type Invalidator, type Subscriber, type Unsubscriber, type Updater } from "svelte/store";
import { useSharedStore } from "./shared-stored";

interface JOKER_TYPE {
    set: (this: void, value: string | null) => void
    update: (this: void, updater: Updater<string | null>) => void
    subscribe: (this: void, run: Subscriber<string | null>, invalidate?: Invalidator<string | null> | undefined) => Unsubscriber
    setJoker: (value: string) => void

}
export const JOKER_STORE_KEY = 'joker-store'

export const jokerStore = (value: string) => {
    const { set, update, subscribe } = writable<string | null>(value)
    return {
        set,
        update,
        subscribe,
        setJoker: (value = 'joker') => set(value)
    }
}

export const useJokerStore = () => useSharedStore<JOKER_TYPE, any>(JOKER_STORE_KEY, jokerStore, 'harley');
