<template>
    <v-menu
        v-model="menuOpen"
        :close-on-content-click="false"
        location="bottom"
    >
        <template #activator="{ props }">
            <v-sheet
                v-bind="props"
                class="border-sm px-4 py-3 rounded-lg d-flex flex-column cursor-pointer"
            >
                <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-subtitle-2">
                        {{ selectedSet.name }}
                    </span>

                    <v-icon
                        :icon="menuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                        size="small"
                    />
                </div>

                <EstimateVariantsSelectorCards :variants="selectedSet.variants" />
            </v-sheet>
        </template>

        <v-card width="368">
            <v-list class="pa-0">
                <v-list-item
                    v-for="set in estimateVariantsSets"
                    :key="set.key"
                    :active="selectedSet.key === set.key"
                    class="py-2"
                    @click="onChangeSet(set.variants)"
                >
                    <v-list-item-title class="text-subtitle-2  mb-2">
                        {{ set.name }}
                    </v-list-item-title>

                    <EstimateVariantsSelectorCards :variants="set.variants" />
                </v-list-item>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import EstimateVariantsSelectorCards from '@/components/settings/room-config/EstimateVariantsSelectorCards.vue'
import { type EstimateVariant, NonValueUnitEstimate } from '@/definitions/estimates'
import {
    CustomEstimateValuesKey,
    type EstimateValuesKey,
    predefinedEstimateValues,
    PredefinedEstimateValuesKey,
} from '@/utils/estimate/values'

interface EstimateVariantSet {
    name: string
    key: EstimateValuesKey
    variants: EstimateVariant[]
}

const { variants } = defineProps<{
    variants?: EstimateVariant[]
}>()

const emit = defineEmits<{
    change: [EstimateVariant[]]
}>()

const menuOpen = ref(false)

const estimateVariantsSets = ref<EstimateVariantSet[]>([
    {
        name: 'Модифицированный Фибоначчи',
        key: PredefinedEstimateValuesKey.ModifiedFibonacci,
        variants: [
            ...Object.values(NonValueUnitEstimate),
            ...predefinedEstimateValues[PredefinedEstimateValuesKey.ModifiedFibonacci],
        ],
    },
    {
        name: 'Четная вероятность',
        key: PredefinedEstimateValuesKey.EvenProbabilities,
        variants: [
            ...Object.values(NonValueUnitEstimate),
            ...predefinedEstimateValues[PredefinedEstimateValuesKey.EvenProbabilities],
        ],
    },
    {
        name: 'Четные целые',
        key: PredefinedEstimateValuesKey.EvenIntegers,
        variants: [
            ...Object.values(NonValueUnitEstimate),
            ...predefinedEstimateValues[PredefinedEstimateValuesKey.EvenIntegers],
        ],
    },
])

const selectedSet = computed<EstimateVariantSet>(() => {
    if (!variants) return estimateVariantsSets.value[0]

    const matchedSet = estimateVariantsSets.value.find((set) => {
        return set.variants.every((variant) => variants.includes(variant))
    })

    if (matchedSet) return matchedSet

    return {
        name: 'Собственный набор',
        key: CustomEstimateValuesKey,
        variants,
    }
})

function onChangeSet(variants: EstimateVariant[]) {
    emit('change', variants)
    menuOpen.value = false
}
</script>
