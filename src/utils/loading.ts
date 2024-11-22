import type { Ref } from 'vue'

export async function wrap(loading: Ref<boolean>, callback: () => void | Promise<void>) {
    loading.value = true
    try {
        await callback()
    } finally {
        loading.value = false
    }
}
