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
                    <v-list-item-title class="text-subtitle-2 mb-2 d-flex justify-space-between align-center">
                        {{ set.name }}

                        <v-btn
                            size="x-small"
                            color="primary"
                            variant="text"
                            class="ml-2"
                            :prepend-icon="set.key === CustomEstimateValuesKey ? 'mdi-cog' : 'mdi-pencil'"
                            :text="set.key === CustomEstimateValuesKey ? 'Настроить' : 'В свой набор'"
                            @click.stop="openCustomEstimateVariantsSetDialog(set.variants)"
                        />
                    </v-list-item-title>

                    <EstimateVariantsSelectorCards :variants="set.variants" />
                </v-list-item>
            </v-list>

            <v-card-actions v-if="!hasCustomVariantsSet">
                <v-btn
                    block
                    variant="outlined"
                    prepend-icon="mdi-plus"
                    @click="openCustomEstimateVariantsSetDialog([])"
                >
                    Добавить свой набор
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>

    <CustomEstimateVariantsSetDialog
        v-model="customEstimateVariantsSetDialogOpen"
        :initial-variants="currentCustomVariantsSet"
        @submit="onCustomVariantsSetSubmit"
    />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import EstimateVariantsSelectorCards from '@/components/settings/room-config/EstimateVariantsSelectorCards.vue'
import CustomEstimateVariantsSetDialog from '@/components/settings/room-config/CustomEstimateVariantsSetDialog.vue'
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

const customEstimateVariantsSetDialogOpen = ref(false)
const currentCustomVariantsSet = ref<EstimateVariant[]>([])
const customVariantsSet = ref<EstimateVariant[]>([])

const hasCustomVariantsSet = computed(() => {
    return customVariantsSet.value.length
})

function onCustomVariantsSetSubmit(variants: EstimateVariant[]) {
    customVariantsSet.value = variants
    onChangeSet(variants)
}

function getCustomEstimateVariantsSet(variants: EstimateVariant[]): EstimateVariantSet {
    return {
        name: 'Свой набор',
        key: CustomEstimateValuesKey,
        variants,
    }
}

const estimateVariantsSets = computed(() => {
    const sets: EstimateVariantSet[] = [
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
    ]

    if (customVariantsSet.value.length) {
        sets.push(getCustomEstimateVariantsSet(customVariantsSet.value))
    }

    return sets
})

const selectedSet = computed<EstimateVariantSet>(() => {
    if (!variants) return estimateVariantsSets.value[0]

    const matchedSet = estimateVariantsSets.value.find((set) => {
        return set.variants.every((variant) => variants.includes(variant))
    })

    if (matchedSet) return matchedSet

    return getCustomEstimateVariantsSet(variants)
})

watch(() => selectedSet.value.key, () => {
    if (!customVariantsSet.value.length && selectedSet.value.key === CustomEstimateValuesKey) {
        customVariantsSet.value = [...selectedSet.value.variants]
    }
}, { immediate: true })

function onChangeSet(variants: EstimateVariant[]) {
    emit('change', variants)
    menuOpen.value = false
}

function openCustomEstimateVariantsSetDialog(setVariants: EstimateVariant[]) {
    currentCustomVariantsSet.value = [...setVariants]
    customEstimateVariantsSetDialogOpen.value = true
}
</script>
