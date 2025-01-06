<template>
    <div
        class="estimate-item d-flex align-items-center"
        :class="{ 'target': isTarget }"
    >
        <template v-if="estimate">
            <span class="estimate-item-value">
                {{ estimate.value }}
            </span>

            <v-badge
                :content="estimate.unit.toUpperCase()"
                :color="getEstimateUnitColor(estimate.unit)"
                inline
            />
        </template>

        <span
            v-else
            class="text-grey-lighten-2"
        >
            —
        </span>
    </div>
</template>

<script setup lang="ts">
import type { Estimate } from '@/definitions/estimates'
import { getEstimateUnitColor } from '@/utils/estimate'

defineProps<{
    estimate?: Estimate
    isTarget?: boolean
}>()
</script>

<style scoped lang="scss">
.estimate-item {
    .v-badge :deep(.v-badge__badge) {
        opacity: calc(1 - var(--v-activated-opacity) * var(--v-theme-overlay-multiplier))
    }

    &.target {
        background-color: red;
    }
}
</style>
