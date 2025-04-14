import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { NonValueUnitEstimate } from '@/definitions/estimates'
import { predefinedEstimateValues, PredefinedEstimateValuesKey } from '@/utils/estimate/values'
import type { EstimateVariantsSet } from '@/definitions/estimate-variants-sets'
import type { UID } from '@/definitions/aliases'
import {
    getStoredCustomEstimateVariantsSetsIfValid,
    removeEstimateVariantsSetFromStorage,
    setEstimateVariantsSetToStorage,
} from '@/utils/estimate-variants-sets'

export const useEstimateVariantsSetsStore = defineStore('estimate-variants-sets', () => {
    const predefinedSets: EstimateVariantsSet[] = [
        {
            id: PredefinedEstimateValuesKey.ModifiedFibonacci,
            name: 'Модифицированный Фибоначчи',
            variants: [
                ...Object.values(NonValueUnitEstimate),
                ...predefinedEstimateValues[PredefinedEstimateValuesKey.ModifiedFibonacci],
            ],
        },
        {
            id: PredefinedEstimateValuesKey.EvenProbabilities,
            name: 'Четная вероятность',
            variants: [
                ...Object.values(NonValueUnitEstimate),
                ...predefinedEstimateValues[PredefinedEstimateValuesKey.EvenProbabilities],
            ],
        },
        {
            id: PredefinedEstimateValuesKey.EvenIntegers,
            name: 'Четные целые',
            variants: [
                ...Object.values(NonValueUnitEstimate),
                ...predefinedEstimateValues[PredefinedEstimateValuesKey.EvenIntegers],
            ],
        },
    ]

    const customSets = ref<EstimateVariantsSet[]>(getCustomSets())

    function getCustomSets() {
        return getStoredCustomEstimateVariantsSetsIfValid() || []
    }

    function applyCustomVariantsSet(customSet: EstimateVariantsSet) {
        const existedSet = customSets.value.find((set) => set.id === customSet.id)

        if (existedSet) {
            existedSet.name = customSet.name
            existedSet.variants = customSet.variants
        } else {
            customSets.value.push(customSet)
        }

        setEstimateVariantsSetToStorage(customSet)
    }

    function removeCustomVariantsSet(customSetId: UID) {
        customSets.value = customSets.value.filter((set) => set.id !== customSetId)
        removeEstimateVariantsSetFromStorage(customSetId)
    }

    const sets = computed(() => [...predefinedSets, ...customSets.value])

    function $reset() {
        customSets.value = []
    }

    return {
        $reset,
        applyCustomVariantsSet,
        removeCustomVariantsSet,
        sets,
    }
})
