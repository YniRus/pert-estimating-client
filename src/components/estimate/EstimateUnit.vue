<template>
    <v-badge
        :content="unit.toUpperCase()"
        :color="getEstimateUnitColor(unit)"
        inline
    />
</template>

<script setup lang="ts">
import { EstimateUnit } from '@/definitions/estimates'
import { getEstimateUnitColor } from '@/utils/estimate/ui'

defineProps<{
    unit: EstimateUnit
}>()
</script>

<style scoped lang="scss">
.v-badge :deep(.v-badge__wrapper) { /* stylelint-disable-line selector-class-pattern */
    width: 24px;
    margin: 0;
}

.v-badge :deep(.v-badge__badge) { /* stylelint-disable-line selector-class-pattern */
    width: 100%;
    opacity: calc(1 - var(--v-activated-opacity) * var(--v-theme-overlay-multiplier));
}
</style>
