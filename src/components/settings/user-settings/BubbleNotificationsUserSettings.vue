<template>
    <v-label class="mb-2">
        Уведомления об оценках

        <v-icon
            v-tooltip="{
                text: 'Включите/выключите всплывающие уведомления каждый раз когда кто-то в комнате выставляет оценку.',
                contentClass: 'text-center',
                maxWidth: 300,
            }"
            class="ma-1"
            icon="mdi-information-outline"
            size="x-small"
            color="grey"
        />
    </v-label>

    <div class="d-flex align-center">
        <v-switch
            :model-value="userEstimatesNotificationStore.isEnabled"
            color="primary"
            hide-details
            :label="userEstimatesNotificationStore.isEnabled ? 'Включены' : 'Отключены'"
            @update:model-value="onToggle(!!$event)"
        />
    </div>
</template>

<script setup lang="ts">
import { useUserEstimatesNotificationStore } from '@/store/user-estimates-notification'

const userEstimatesNotificationStore = useUserEstimatesNotificationStore()

function onToggle(value: boolean) {
    userEstimatesNotificationStore.setEnabled(value)
}
</script>

<style lang="scss" scoped>
.v-switch {
    :deep(.v-selection-control) {
        min-height: 30px;
    }
}
</style>
