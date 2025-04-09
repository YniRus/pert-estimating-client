<template>
    <v-btn-toggle
        :model-value="estimatesStore.unit"
        divided
        rounded="xl"
        density="compact"
        border="border"
        class="estimate-type-selector"
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
        <EstimateVariantCard
            v-for="variant of estimateVariants"
            :key="`variant-${variant}`"
            :variant="variant"
            @select="onSelectEstimate"
        />
    </div>
</template>

<script setup lang="ts">
import { EstimateUnit, type UserEstimate } from '@/definitions/estimates'
import { computed } from 'vue'
import { useEstimatesStore } from '@/store/estimates'
import { useEstimatesOrderStore } from '@/store/estimates-order'
import EstimateVariantCard from '@/views/room/components/EstimateVariantCard.vue'
import { toast } from 'vue3-toastify'
import { getEstimateUnitColor } from '@/utils/estimate/ui'
import { useRoomEstimateVariants } from '@/store/composables/use-room-estimate-variants'

const { estimateVariants } = useRoomEstimateVariants()
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

async function onSelectEstimate(estimate: UserEstimate) {
    const setEstimateError = await estimatesStore.setEstimate(estimate)
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
    gap: map.get(v-settings.$spacers, 4);
    align-items: stretch;
}

.estimate-type-selector {
    .v-btn {
        transition-property: color, background-color;
    }
}
</style>
