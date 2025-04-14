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

        <v-card
            width="368"
            max-height="385"
            class="overflow-y-auto"
        >
            <v-list class="pa-0">
                <v-list-item
                    v-for="set in estimateVariantsSets"
                    :key="set.id"
                    :active="selectedSet.id === set.id"
                    class="py-2"
                    @click="onChangeSet(set.id)"
                >
                    <v-list-item-title class="text-subtitle-2 mb-2 d-flex justify-space-between align-center">
                        <span class="text-truncate">
                            {{ set.name }}
                        </span>

                        <div>
                            <v-btn
                                size="x-small"
                                color="primary"
                                variant="text"
                                class="ml-2"
                                density="comfortable"
                                :icon="isPredefinedVariantsSet(set) ? 'mdi-content-copy' : 'mdi-pencil'"
                                @click.stop="openCustomEstimateVariantsSetDialog(set)"
                            />

                            <v-btn
                                v-if="!isPredefinedVariantsSet(set)"
                                size="x-small"
                                color="error"
                                variant="text"
                                class="ml-2"
                                density="comfortable"
                                icon="mdi-delete-outline"
                                @click.stop="removeCustomEstimateVariantsSet(set)"
                            />
                        </div>
                    </v-list-item-title>

                    <EstimateVariantsSelectorCards :variants="set.variants" />
                </v-list-item>
            </v-list>

            <v-card-actions>
                <v-btn
                    block
                    variant="outlined"
                    prepend-icon="mdi-plus"
                    @click="openCustomEstimateVariantsSetDialog()"
                >
                    Новый набор
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>

    <CustomEstimateVariantsSetDialog
        v-model="customEstimateVariantsSetDialogOpen"
        :initial-set="customVariantsSetToEdit"
        @submit="onCustomVariantsSetSubmit"
    />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import EstimateVariantsSelectorCards from '@/components/settings/room-config/EstimateVariantsSelectorCards.vue'
import CustomEstimateVariantsSetDialog from '@/components/settings/room-config/CustomEstimateVariantsSetDialog.vue'
import type { EstimateVariantsSet, EstimateVariantsSetId } from '@/definitions/estimate-variants-sets'
import { randomUUID } from '@/utils/crypto'
import { useEstimateVariantsSetsStore } from '@/store/estimate-variants-sets'
import { PredefinedEstimateValuesKey } from '@/utils/estimate/values'
import { useConfirm } from '@/composables/use-confirm'

const { selectedSetId } = defineProps<{
    selectedSetId?: EstimateVariantsSetId
}>()

const emit = defineEmits<{
    change: [EstimateVariantsSetId]
}>()

const estimateVariantsSetsStore = useEstimateVariantsSetsStore()

const menuOpen = ref(false)

const customEstimateVariantsSetDialogOpen = ref(false)
const customVariantsSetToEdit = ref<EstimateVariantsSet>(getEmptyCustomEstimateVariantsSet())

function onCustomVariantsSetSubmit(set: EstimateVariantsSet) {
    estimateVariantsSetsStore.applyCustomVariantsSet(set)
    onChangeSet(set.id)
}

function getEmptyCustomEstimateVariantsSet(): EstimateVariantsSet {
    return {
        name: 'Новый набор',
        id: randomUUID(),
        variants: [],
    }
}

const estimateVariantsSets = computed(() => estimateVariantsSetsStore.sets)

const selectedSet = computed<EstimateVariantsSet>(() => {
    const selectedExistedSet = estimateVariantsSetsStore.sets.find((set) => set.id === selectedSetId)
    return selectedExistedSet || estimateVariantsSetsStore.sets[0]
})

function isPredefinedVariantsSet(set: EstimateVariantsSet) {
    return Object.values(PredefinedEstimateValuesKey).includes(set.id as PredefinedEstimateValuesKey)
}

function onChangeSet(setId: EstimateVariantsSetId) {
    emit('change', setId)
    menuOpen.value = false
}

function openCustomEstimateVariantsSetDialog(variantsSet?: EstimateVariantsSet) {
    if (!variantsSet) {
        variantsSet = getEmptyCustomEstimateVariantsSet()
    } else if (isPredefinedVariantsSet(variantsSet)) {
        variantsSet = {
            id: randomUUID(),
            name: variantsSet.name + ` (копия)`,
            variants: [...variantsSet.variants],
        }
    }

    customVariantsSetToEdit.value = variantsSet
    customEstimateVariantsSetDialogOpen.value = true
}

const { confirm } = useConfirm()

async function removeCustomEstimateVariantsSet(variantsSet: EstimateVariantsSet) {
    if (!await confirm({
        text: `Вы уверены, что хотите удалить набор "${variantsSet.name}"?`,
    })) return

    estimateVariantsSetsStore.removeCustomVariantsSet(variantsSet.id)
}
</script>
