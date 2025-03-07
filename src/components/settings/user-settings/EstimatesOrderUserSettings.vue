<template>
    <v-label class="mb-2">
        Автопереключение

        <v-icon
            v-tooltip="{
                text: 'Настройте порядок автопереключения типа оценки, а так же выключите некоторые типы, если не хотите автопереключения на них. Как минимум один тип всегда включен.',
                contentClass: 'text-center',
                maxWidth: 300,
            }"
            class="ma-1"
            icon="mdi-information-outline"
            size="x-small"
            color="grey"
        />
    </v-label>

    <draggable
        class="v-btn-group v-btn-group--divided d-flex rounded-xl border-sm"
        @sort="onChangeSort"
    >
        <v-btn
            v-for="(estimateType, index) in estimatesOrderStore.data"
            :key="estimateType.type"
            :text="estimateType.type"
            variant="text"
            :rounded="false"
            class="flex-grow-1"
            :class="{ 'disabled': estimateType.disabled }"
            :ripple="false"
            :data-test-id="`estimate-type-${estimateType.type}`"
            @click="setDisabled(index, !estimateType.disabled)"
        />
    </draggable>
</template>

<script setup lang="ts">
import { useEstimatesOrderStore } from '@/store/estimates-order'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { swap } from '@/utils/utils'
import { toRaw } from 'vue'

const estimatesOrderStore = useEstimatesOrderStore()

function onChangeSort({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) {
    const newOrder = swap(toRaw(estimatesOrderStore.data), oldIndex, newIndex)

    estimatesOrderStore.updateOrderData(newOrder)
}

function setDisabled(index: number, disabled: boolean) {
    if (estimatesOrderStore.order.length === 1 && disabled) return

    const newOrder = structuredClone(toRaw(estimatesOrderStore.data))
    newOrder[index].disabled = disabled

    estimatesOrderStore.updateOrderData(newOrder)
}
</script>

<style lang="scss" scoped>
.v-btn-group {
    .v-btn {
        &.disabled {
            :deep(.v-btn__content) { /* stylelint-disable-line selector-class-pattern */
                opacity: 0.26;
            }

            &:hover {
                :deep(.v-btn__overlay) { /* stylelint-disable-line selector-class-pattern */
                    opacity: 0.02;
                }
            }
        }

        &.sortable-drag {
            background: unset;
            border: none;

            :deep(.v-btn__overlay) { /* stylelint-disable-line selector-class-pattern */
                background: transparent;
            }
        }
    }
}
</style>
