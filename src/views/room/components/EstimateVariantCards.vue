<template>
    <v-btn-toggle
        v-if="canEstimate"
        :model-value="estimatesStore.unit"
        divided
        rounded="xl"
        density="compact"
        border="border"
        class="estimate-type-selector"
        :disabled="disabled"
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
            v-if="!disabled"
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
            :disabled="disabled"
            :can-estimate="canEstimate"
            @select="onSelectEstimate"
        />
    </div>
</template>

<script setup lang="ts">
import { EstimateUnit, type UserSetEstimate } from '@/definitions/estimates'
import { computed } from 'vue'
import { useEstimatesStore } from '@/store/estimates'
import { useEstimatesOrderStore } from '@/store/estimates-order'
import EstimateVariantCard from '@/views/room/components/EstimateVariantCard.vue'
import { toast } from 'vue3-toastify'
import { getEstimateUnitColor } from '@/utils/estimate/ui'
import { useRoomEstimateVariants } from '@/store/composables/use-room-estimate-variants'

defineProps<{
    disabled?: boolean
    canEstimate?: boolean
}>()

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

async function onSelectEstimate(userEstimate: UserSetEstimate) {
    const setEstimateError = await estimatesStore.setEstimate(userEstimate)
    setEstimateError && toast.error('Неизвестная ошибка')

    !setEstimateError && estimatesStore.setNextType(estimatesOrderStore.order)
}
</script>

<style lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as v-settings;
@use '@/styles/mixins';

.estimate-variant-cards {
    @include mixins.flex-center;

    flex-wrap: wrap;
    gap: map.get(v-settings.$spacers, 4);
    align-items: stretch;
}

.estimate-type-selector {
    .v-btn {
        border-inline-end-color: #e0e0e0 !important;
    }

    &:not(:has(.v-btn--disabled)) { /* stylelint-disable-line */
        .v-btn {
            transition-property: color, background-color;
        }
    }
}
</style>
