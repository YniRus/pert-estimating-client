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

    <div class="estimate-variant-cards w-100 mb-5">
        <EstimateVariantCard
            v-for="variant of baseEstimateValues"
            :key="`variant-${variant}`"
            :value="variant"
            :unit="estimatesStore.unit"
            @select="onSelectEstimate"
        />
    </div>
</template>

<script setup lang="ts">
import { EstimateUnit } from '@/definitions/estimates'
import { computed } from 'vue'
import { baseEstimateValues, getEstimateUnitColor } from '@/utils/estimate'
import { useEstimatesStore } from '@/store/estimates'
import { useEstimatesOrderStore } from '@/store/estimates-order'
import EstimateVariantCard from '@/views/room/components/EstimateVariantCard.vue'
import { toast } from 'vue3-toastify'

const estimatesStore = useEstimatesStore()
const estimatesOrderStore = useEstimatesOrderStore()

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

async function onSelectEstimate(value: number, customUnit?: EstimateUnit) {
    const setEstimateError = await estimatesStore.setEstimate(value, customUnit)
    setEstimateError && toast.error('Неизвестная ошибка')

    !setEstimateError && estimatesStore.setNextType(estimatesOrderStore.order)
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
