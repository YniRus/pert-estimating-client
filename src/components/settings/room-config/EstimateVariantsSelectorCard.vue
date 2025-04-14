<template>
    <div class="pa-3 variant-card text-caption d-flex align-center justify-center rounded">
        <v-icon
            v-if="isNonValueUnitEstimate(variant)"
            :icon="getNonValueUnitEstimateIcon(variant)"
            :size="getNonValueUnitEstimateIconSize(variant)"
        />

        <span v-else>{{ variant }}</span>
    </div>
</template>

<script setup lang="ts">
import { isNonValueUnitEstimate } from '@/utils/estimate/guards'
import { getNonValueUnitEstimateIcon } from '@/utils/estimate/ui'
import { type EstimateVariant, NonValueUnitEstimate } from '@/definitions/estimates'

const { variant } = defineProps<{
    variant: EstimateVariant
}>()

function getNonValueUnitEstimateIconSize(estimate: NonValueUnitEstimate) {
    switch (estimate) {
        case NonValueUnitEstimate.Chill: return 'small'
        case NonValueUnitEstimate.IDontKnow: return 'x-small'
    }
}
</script>

<style lang="scss" scoped>
.variant-card {
    width: 32px;
    height: 32px;
    background-color: #eee;
}
</style>
