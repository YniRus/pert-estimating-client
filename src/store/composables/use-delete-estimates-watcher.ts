import ws from '@/plugins/ws'
import { useEstimatesStore } from '@/store/estimates'

enum UpdateRoomContext {
    UpdateEstimatesVisible = 'update-estimates-visible',
    DeleteEstimates = 'delete-estimates',
}

export function useDeleteEstimatesWatcher() {
    const estimatesStore = useEstimatesStore()

    function onRoom(_: unknown, context?: string) {
        if (context === UpdateRoomContext.DeleteEstimates) {
            estimatesStore.resetCurrentType()
        }
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
    }
}
