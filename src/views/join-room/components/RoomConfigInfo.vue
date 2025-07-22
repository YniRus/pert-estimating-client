<template>
    <v-sheet
        class="mt-8"
        width="100%"
        max-width="var(--dialog-max-width)"
    >
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-title>
                    Информация о комнате
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                    <div>
                        <p class="text-subtitle-1 mb-2">
                            Шкала оценки
                        </p>

                        <EstimateVariantsSelectorCards :variants="estimateVariantsToShow" />
                    </div>

                    <template v-if="roomConfig?.withConfirmEstimates">
                        <v-divider class="my-4" />

                        <div class="d-flex align-center ga-2">
                            <v-icon
                                icon="mdi-information-outline"
                                color="primary"
                            />
                            <span class="text-subtitle-1">С подтверждением оценки</span>
                        </div>
                    </template>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-sheet>
</template>

<script setup lang="ts">
import type { RoomConfig } from '@/definitions/room'
import EstimateVariantsSelectorCards from '@/components/settings/room-config/EstimateVariantsSelectorCards.vue'
import { computed } from 'vue'
import { defaultEstimateVariants } from '@/utils/estimate/values'

const { roomConfig } = defineProps<{
    roomConfig?: RoomConfig
}>()

const estimateVariantsToShow = computed(() => {
    return roomConfig?.estimateVariants || defaultEstimateVariants
})
</script>
