import { defineStore } from 'pinia'
import { computed } from 'vue'
import ws from '@/plugins/ws'
import { WSError } from '@/utils/ws-error'
import { isEmptyEstimates } from '@/utils/estimate/guards'
import { useAuthUserEstimates } from '@/store/composables/use-auth-user-estimates'

export const useEstimatesConfirmStore = defineStore('estimates-confirm', () => {
    const {
        authUserEstimates,
        authUserEstimatesConfirmed,
        setAuthUserEstimatesConfirmed,
    } = useAuthUserEstimates()

    const hasUnconfirmedEstimates = computed(() => {
        return !authUserEstimatesConfirmed.value && !isEmptyEstimates(authUserEstimates.value)
    })

    function onSetAuthUserEstimates() {
        if (authUserEstimatesConfirmed.value) {
            setConfirmed(false)
        }
    }

    async function setConfirmed(confirmed: boolean) {
        setAuthUserEstimatesConfirmed(confirmed)

        const response = await ws.emitWithAck('mutation:estimates-confirm', confirmed)
        if (response instanceof WSError) return response
    }

    return {
        hasUnconfirmedEstimates,
        setConfirmed,
        onSetAuthUserEstimates,
    }
})
