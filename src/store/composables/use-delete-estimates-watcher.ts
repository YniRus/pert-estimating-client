import ws from '@/plugins/ws'
import { useEstimatesStore } from '@/store/estimates'
import { useLastEstimateTimerStore } from '@/store/last-estimate-timer'

enum UpdateRoomContext {
    UpdateEstimatesVisible = 'update-estimates-visible',
    DeleteEstimates = 'delete-estimates',
}

export function useDeleteEstimatesWatcher() {
    const estimatesStore = useEstimatesStore()
    const lastEstimateTimerStore = useLastEstimateTimerStore()

    function onRoom(_: unknown, context?: string) {
        if (context === UpdateRoomContext.DeleteEstimates) {
            onRoomDeleteEstimates()
        }
    }

    function onRoomDeleteEstimates() {
        estimatesStore.resetCurrentType()
        lastEstimateTimerStore.stop()
    }

    function watch() {
        ws.on('on:room', onRoom)
    }

    function unwatch() {
        ws.off('on:room', onRoom)
    }

    return {
        watch,
        unwatch,
        onRoomDeleteEstimates,
    }
}
