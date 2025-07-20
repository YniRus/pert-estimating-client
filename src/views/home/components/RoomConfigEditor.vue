<template>
    <v-container class="room-config-editor">
        <v-row>
            <v-col>
                <p class="text-subtitle-1 pl-2 mb-2">
                    Шкала оценки
                </p>

                <EstimateVariantsSelector
                    :selected-set-id="estimateVariantsSetId"
                    @change="estimateVariantsSetId = $event"
                />
            </v-col>
        </v-row>

        <v-row class="mt-0">
            <v-col>
                <v-expansion-panels static :elevation="0">
                    <v-expansion-panel>
                        <v-expansion-panel-title class="pa-2 text-subtitle-1">
                            Дополнительные параметры
                        </v-expansion-panel-title>

                        <v-expansion-panel-text class="px-2">
                            <v-checkbox
                                v-model="withConfirmEstimates"
                                density="compact"
                                hint="Легко отслеживайте готовность оценок в комнате, включив их подтверждение"
                                persistent-hint
                            >
                                <template #label="{ props }">
                                    <label
                                        class="pl-1 text-subtitle-2 text-black cursor-pointer"
                                        v-bind="props"
                                    >
                                        С подтверждением оценки
                                    </label>
                                </template>
                            </v-checkbox>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import EstimateVariantsSelector from '@/components/settings/room-config/EstimateVariantsSelector.vue'
import { useEstimateVariantsSetsStore } from '@/store/estimate-variants-sets'
import { computed, ref, watch } from 'vue'
import type { EstimateVariantsSetId } from '@/definitions/estimate-variants-sets'
import type { RoomConfig } from '@/definitions/room'
import { PredefinedEstimateValuesKey } from '@/utils/estimate/values'

const config = defineModel<RoomConfig>()

const estimateVariantsSetsStore = useEstimateVariantsSetsStore()

const estimateVariantsSetId = ref<EstimateVariantsSetId>(PredefinedEstimateValuesKey.ModifiedFibonacci)

const estimateVariants = computed(() => {
    if (!estimateVariantsSetId.value) return
    return estimateVariantsSetsStore.sets.find((set) => set.id === estimateVariantsSetId.value)
})

const withConfirmEstimates = ref(false)

watch([estimateVariantsSetId, withConfirmEstimates], () => {
    config.value = {
        estimateVariants: estimateVariants.value?.variants,
        withConfirmEstimates: withConfirmEstimates.value,
    }
}, { immediate: true })
</script>

<style scoped lang="scss">
.room-config-editor {
    :deep(.v-expansion-panel-text__wrapper) {
        padding: unset;
    }
}
</style>
