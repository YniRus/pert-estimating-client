<template>
    <v-label
        class="mb-2"
        :class="{
            'text-disabled': !userEstimatesNotificationStore.isEnabled
        }"
    >
        Таймер последней оценки

        <v-icon
            v-tooltip="{
                text: 'Настройте таймер, который будет отражать время с последней оценки. По истечению указанного времени таймер перейдет в режим ожидания.',
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
            :model-value="userEstimatesNotificationStore.isTimerEnabled"
            color="primary"
            hide-details
            :label="userEstimatesNotificationStore.isTimerEnabled ? 'Отсчитывать до' : 'Выключен'"
            :disabled="!userEstimatesNotificationStore.isEnabled"
            @update:model-value="onToggle(!!$event)"
        />

        <v-slide-x-reverse-transition mode="out-in">
            <v-select
                v-if="userEstimatesNotificationStore.isTimerEnabled"
                :model-value="userEstimatesNotificationStore.timerTimeout"
                :disabled="!userEstimatesNotificationStore.isEnabled"
                :items="timeoutItems"
                density="compact"
                hide-details
                max-width="136px"
                variant="outlined"
                class="ml-auto"
                @update:model-value="onTimerChange"
            >
                <template #selection="{ item }">
                    {{ item.raw.value }} сек.
                </template>
            </v-select>
        </v-slide-x-reverse-transition>
    </div>
</template>

<script setup lang="ts">
import { useUserEstimatesNotificationStore } from '@/store/user-estimates-notification'

const userEstimatesNotificationStore = useUserEstimatesNotificationStore()

const timeoutItems = [5, 10, 15, 20, 30, 45, 60].map((timeout) => ({
    title: `${timeout} секунд`,
    value: timeout,
}))

function onToggle(value: boolean) {
    userEstimatesNotificationStore.setTimerEnabled(value)
}

function onTimerChange(value: number) {
    userEstimatesNotificationStore.setTimerTimeout(value)
}
</script>

<style lang="scss" scoped>
.v-switch {
    :deep(.v-selection-control) {
        min-height: 30px;
    }
}
</style>
