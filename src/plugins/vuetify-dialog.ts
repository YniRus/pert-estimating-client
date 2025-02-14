import VuetifyUseDialog, { type useConfirm } from 'vuetify-use-dialog'

export type ConfirmDialogOptions = Parameters<ReturnType<typeof useConfirm>>[0]

export const vuetifyDialog = VuetifyUseDialog
export const vuetifyDialogGlobalOptions: ConfirmDialogOptions = {
    title: 'Подтвердите действие',
    confirmationText: 'Подтвердить',
    cancellationText: 'Отмена',
    cardTitleProps: {
        // @ts-expect-error eslint-disable-line @typescript-eslint/ban-ts-comment
        class: 'my-2',
    },
    dialogProps: {
        maxWidth: 400,
    },
    confirmationButtonProps: {
        variant: 'outlined',
    },
}
