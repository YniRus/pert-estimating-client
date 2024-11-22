<template>
    <v-btn-toggle
        v-model="type"
        divided
        rounded="xl"
        density="compact"
        border="border"
        class="estimate-type-selector ma-5"
        base-color="default"
        mandatory
    >
        <v-btn
            v-for="estimateType of EstimateType"
            :key="`type-${estimateType}`"
            class="font-weight-bold"
            :color="getEstimateTypeButtonColor(estimateType)"
            :value="estimateType"
        >
            {{ estimateType }}
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
        >
            <v-card-text class="text-center pa-0 text-h4">
                {{ variant }}
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { EstimateType } from '@/definitions/estimate'
import { computed, ref } from 'vue'

const baseVariants = [0, 1, 2, 3, 5, 8, 13, 20]

const type = ref(EstimateType.Hours)

const tooltipText = computed(() => {
    let tooltipText = 'Выбрана оценка в '
    switch (type.value) {
        case EstimateType.Hours: return tooltipText += 'часах'
        case EstimateType.Days: return tooltipText += 'днях'
        case EstimateType.Weeks: return tooltipText += 'неделях'
        case EstimateType.Months: return tooltipText += 'месяцах'
        default: return ''
    }
})

function getEstimateTypeButtonColor(type: EstimateType) {
    switch (type) {
        case EstimateType.Hours: return 'primary'
        case EstimateType.Days: return 'success'
        case EstimateType.Weeks: return 'purple'
        case EstimateType.Months: return 'red'
    }
}
</script>

<style lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as v-settings;
@use '@/styles/mixins';

.estimate-variant-cards {
    @include mixins.flex-center;

    flex-wrap: wrap;
    gap: map.get(v-settings.$spacers, 5);
    max-width: 800px;
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
