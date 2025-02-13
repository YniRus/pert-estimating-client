<template>
    <div
        class="estimate-item d-flex align-center pa-2 rounded"
        :class="{
            'target': isTarget,
            'cursor-pointer': isSelectable,
        }"
        @click="emit('select')"
    >
        <template v-if="estimate">
            <template v-if="isVisibleEstimate(estimate)">
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
                v-if="isHiddenEstimate(estimate)"
                class="estimate-item-value"
            >
                {{ HIDDEN_ESTIMATE }}
            </span>
        </template>

        <span
            v-else
            :class="[ isTarget ? 'text-grey-darken-1' : 'text-grey-lighten-2' ]"
        >
            —
        </span>
    </div>
</template>

<script setup lang="ts">
import { type Estimate, HIDDEN_ESTIMATE, type VisibleEstimate } from '@/definitions/estimates'
import { getEstimateUnitColor } from '@/utils/estimate'

const props = defineProps<{
    estimate?: Estimate
    isSelectable?: boolean
    isTarget?: boolean
}>()

const emit = defineEmits<{
    select: []
}>()

function isVisibleEstimate(estimate: Estimate): estimate is VisibleEstimate {
    if (typeof props.estimate !== 'object') return false

    return 'value' in props.estimate && 'unit' in props.estimate
}

function isHiddenEstimate(estimate: Estimate) {
    return estimate === HIDDEN_ESTIMATE
}
</script>

<style scoped lang="scss">
.estimate-item {
    background-color: white;
    box-shadow: none;

    transition-timing-function: ease-in-out;
    transition-duration: 0.2s;
    transition-property: background-color, box-shadow;

    .v-badge :deep(.v-badge__badge) { /* stylelint-disable-line selector-class-pattern */
        opacity: calc(1 - var(--v-activated-opacity) * var(--v-theme-overlay-multiplier));
    }

    &.target {
        background-color: rgb(var(--v-theme-primary), 0.2);
        box-shadow: 0 0 4px 0 rgb(15 15 15 / 30%) inset;
    }
}
</style>
