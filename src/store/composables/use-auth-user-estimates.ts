import { useAuthStore } from '@/store/auth'
import { useRoomStore } from '@/store/room'
import { useEstimatesStore } from '@/store/estimates'
import { computed, ref, watch, type WatchHandle } from 'vue'
import type { Estimates } from '@/definitions/estimates'

export function useAuthUserEstimates() {
    const authStore = useAuthStore()
    const roomStore = useRoomStore()
    const estimatesStore = useEstimatesStore()

    const roomAuthUserIndex = computed(() => {
        if (!roomStore.data || !authStore.data) return -1
        return roomStore.data.users.findIndex((user) => user.id === authStore.data!.user.id)
    })

    const roomAuthUserEstimates = computed<Estimates>(() => {
        if (!roomStore.data || !authStore.data || roomAuthUserIndex.value === -1) return {}
        return roomStore.data.users[roomAuthUserIndex.value].estimates || {}
    })

    const watchEstimatesHandle = ref<WatchHandle>()
    const watchAuthUserEstimatesHandle = ref<WatchHandle>()

    function watchEstimatesOn() {
        watchEstimatesHandle.value = watch(estimatesStore.estimates, () => {
            if (roomAuthUserIndex.value > -1) {
                roomStore.data!.users[roomAuthUserIndex.value].estimates = { ...estimatesStore.estimates }
            }
        })

        watchAuthUserEstimatesHandle.value = watch(roomAuthUserEstimates, () => {
            estimatesStore.estimates = roomAuthUserEstimates.value
        }, { immediate: true })
    }

    function watchEstimatesOff() {
        watchEstimatesHandle.value?.stop()
        watchAuthUserEstimatesHandle.value?.stop()
    }

    return {
        watchEstimatesOn,
        watchEstimatesOff,
    }
}
