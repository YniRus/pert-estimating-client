import { useAuthStore } from '@/store/auth'
import { useRoomStore } from '@/store/room'
import { useEstimatesStore } from '@/store/estimates'
import { computed, ref, watch, type WatchHandle } from 'vue'

export function authUserRoomEstimates() {
    const authStore = useAuthStore()
    const roomStore = useRoomStore()
    const estimatesStore = useEstimatesStore()

    const roomAuthUserIndex = computed(() => {
        if (!roomStore.data || !authStore.data) return -1
        return roomStore.data.users.findIndex((user) => user.id === authStore.data!.user.id)
    })

    const watchHandle = ref<WatchHandle>()

    function watchEstimatesOn() {
        watchHandle.value = watch(estimatesStore.estimates, () => {
            if (roomAuthUserIndex.value > -1) {
                roomStore.data!.users[roomAuthUserIndex.value].estimates = { ...estimatesStore.estimates }
            }
        })
    }

    function watchEstimatesOff() {
        watchHandle.value?.stop()
    }

    return {
        watchEstimatesOn,
        watchEstimatesOff,
    }
}
