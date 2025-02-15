<template>
    <div
        class="estimate-item d-flex align-center pa-2 rounded"
        :class="{
            'target': isTarget,
            'can-be-target': isCanBeTarget,
        }"
        @click="isCanBeTarget && emit('select')"
    >
        <template v-if="estimate">
            <template v-if="isVisibleEstimate(estimate)">
                <span class="estimate-item-value">
                    {{ estimate.value }}
                </span>

                <EstimateUnit :unit="estimate.unit" />
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
import EstimateUnit from '@/components/common/EstimateUnit.vue'

defineProps<{
    estimate?: Estimate
    isCanBeTarget?: boolean
    isTarget?: boolean
}>()

const emit = defineEmits<{
    select: []
}>()

function isVisibleEstimate(estimate: Estimate): estimate is VisibleEstimate {
    if (typeof estimate !== 'object') return false

    return 'value' in estimate && 'unit' in estimate
}

function isHiddenEstimate(estimate: Estimate) {
    return estimate === HIDDEN_ESTIMATE
}
</script>

<style scoped lang="scss">
.estimate-item {
    $bg-color: rgb(15 15 15);

    background-color: white;
    box-shadow: none;

    transition-timing-function: ease-in-out;
    transition-duration: 0.2s;
    transition-property: background-color, box-shadow;

    &.can-be-target {
        cursor: pointer;

        &:hover {
            background-color: rgb(var(--v-theme-primary), 0.1);
            box-shadow: 0 0 2px 0 rgb($bg-color, 0.1) inset;
        }
    }

    &.target,
    &.target:hover {
        background-color: rgb(var(--v-theme-primary), 0.2);
        box-shadow: 0 0 4px 0 rgb($bg-color, 0.2) inset;
    }

    &.can-be-target:active,
    &.target:active {
        background-color: rgb(var(--v-theme-primary), 0.3);
        box-shadow: 0 0 6px 0 rgb($bg-color, 0.3) inset;
    }
}
</style>
