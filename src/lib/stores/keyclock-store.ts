import { writable, type Invalidator, type Subscriber, type Unsubscriber, type Updater } from "svelte/store";
import { useSharedStore } from "./shared-stored";

export interface KEYCLOAK_TYPE {
    set: (this: void, value: string | null) => void
    update: (this: void, updater: Updater<string | null>) => void
    subscribe: (this: void, run: Subscriber<string | null>, invalidate?: Invalidator<string | null> | undefined) => Unsubscriber
    setAuthenticated: (value: boolean) => void
    setProfile: (value: any) => void

}
export const KC_STORE_KEY = 'keycloak-key-store'

export const keyclockStore = (value: string) => {
    const { set, update, subscribe } = writable<string | null>(value)
    return {
        set,
        update,
        subscribe,
        setAuthenticated: (value: any) => update((current: any) => ({ ...current, authenticated: value })),
        setProfile: (value: any) => update((current: any) => ({ ...current, ...value })),
    }
}

export const useKeycloakStore = () => useSharedStore<KEYCLOAK_TYPE, any>(KC_STORE_KEY, keyclockStore, {});
