<template>
    <v-btn-toggle
        :model-value="estimatesStore.unit"
        divided
        rounded="xl"
        density="compact"
        border="border"
        class="estimate-type-selector ma-5"
        base-color="default"
        mandatory
        @update:model-value="estimatesStore.setUnit"
    >
        <v-btn
            v-for="estimateUnit of EstimateUnit"
            :key="`type-${estimateUnit}`"
            class="font-weight-bold"
            :color="getEstimateUnitColor(estimateUnit)"
            :value="estimateUnit"
        >
            {{ estimateUnit }}
        </v-btn>

        <v-tooltip
            activator="parent"
            location="bottom"
        >
            {{ tooltipText }}
        </v-tooltip>
    </v-btn-toggle>

    <div class="estimate-variant-cards w-100">
        <v-card
            v-for="variant of baseVariants"
            :key="`variant-${variant}`"
            hover
            class="estimate-variant-card px-1 py-12"
            @click="onSelectEstimate(variant)"
        >
            <v-card-text class="text-center pa-0 text-h4">
                {{ variant }}
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { EstimateUnit } from '@/definitions/estimates'
import { computed } from 'vue'
import { getEstimateUnitColor } from '@/utils/estimate'
import { useEstimatesStore } from '@/store/estimates'
import { useEstimatesOrderStore } from '@/store/estimates-order'

const estimatesStore = useEstimatesStore()
const estimatesOrderStore = useEstimatesOrderStore()

const baseVariants = [0, 1, 2, 3, 5, 8, 13, 20]

const tooltipText = computed(() => {
    let tooltipText = 'Выбрана оценка в '
    switch (estimatesStore.unit) {
        case EstimateUnit.Hours: return tooltipText += 'часах'
        case EstimateUnit.Days: return tooltipText += 'днях'
        case EstimateUnit.Weeks: return tooltipText += 'неделях'
        case EstimateUnit.Months: return tooltipText += 'месяцах'
        default: return ''
    }
})

function onSelectEstimate(value: number) {
    estimatesStore.setEstimate(value)
    estimatesStore.setNextType(estimatesOrderStore.order)
}
</script>

<style lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as v-settings;
@use '@/styles/mixins';

@import '@/styles/variables';

.estimate-variant-cards {
    @include mixins.flex-center;

    flex-wrap: wrap;
    gap: map.get(v-settings.$spacers, 5);
    max-width: var(--content-max-width);
    padding: 0 map.get(v-settings.$spacers, 5);

    .estimate-variant-card {
        display: flex;
        min-width: 100px;
        max-width: 50%;
    }
}

.estimate-type-selector {
    max-width: 300px;

    .v-btn {
        transition-property: color, background-color;
    }
}
</style>
