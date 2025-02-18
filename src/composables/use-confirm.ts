import ConfirmDialog, { type ConfirmDialogProps } from '@/components/common/ConfirmDialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'

export function useConfirm() {
    // @ts-expect-error eslint-disable-line @typescript-eslint/ban-ts-comment
    const confirmDialog = createConfirmDialog(ConfirmDialog)

    async function confirm(props?: ConfirmDialogProps) {
        return !(await confirmDialog.reveal(props)).isCanceled
    }

    return {
        confirm,
    }
}
