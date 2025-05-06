<template>
    <v-chip
        class="justify-center"
        :class="{ 'disabled': disabled }"
        :color="timerStore.isRunning ? 'primary' : 'default'"
        variant="outlined"
        rounded
    >
        <v-scroll-y-transition leave-absolute>
            <div v-if="timerStore.isRunning" class="d-flex align-center justify-center">
                <v-icon icon="mdi-timer-outline" class="mr-1" />

                <span>:</span>

                <div class="timer-container">
                    <span v-if="isShowLeadingZero">0</span>
                    <span :key="timerStore.seconds">{{ timerStore.seconds }}</span>
                </div>
            </div>

            <SleepingCatAnimation v-else />
        </v-scroll-y-transition>
    </v-chip>
</template>

<script setup lang="ts">
import { useLastEstimateTimerStore } from '@/store/last-estimate-timer'
import SleepingCatAnimation from '@/components/estimate/timer/SleepingCatAnimation.vue'
import { computed } from 'vue'

defineProps<{
    disabled?: boolean
}>()

const timerStore = useLastEstimateTimerStore()

const isShowLeadingZero = computed(() => timerStore.seconds < 10)
</script>

<style lang="scss" scoped>
.v-chip {
    width: 80px;

    .timer-container {
        width: 18px;
    }

    &.disabled {
        pointer-events: none;
        filter: opacity(var(--v-disabled-opacity));
    }
}
</style>
