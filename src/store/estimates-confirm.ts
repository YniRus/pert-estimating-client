import { defineStore } from 'pinia'
import ws from '@/plugins/ws'
import { WSError } from '@/utils/ws-error'
import { useAuthUserEstimates } from '@/store/composables/use-auth-user-estimates'

export const useEstimatesConfirmStore = defineStore('estimates-confirm', () => {
    const {
        authUserEstimatesConfirmed,
        authUserHasUnconfirmedEstimates,
        setAuthUserEstimatesConfirmed,
    } = useAuthUserEstimates()

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
        authUserHasUnconfirmedEstimates,
        setConfirmed,
        onSetAuthUserEstimates,
    }
})
