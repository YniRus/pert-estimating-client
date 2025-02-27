import type { Ref } from 'vue'
import type { Promised } from '@/definitions/utility'

export async function wrap<T = void>(loading: Ref<boolean>, callback: () => Promised<T>) {
    loading.value = true
    try {
        return await callback()
    } finally {
        loading.value = false
    }
}
