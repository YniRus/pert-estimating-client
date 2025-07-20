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

                    <v-divider class="my-4" />

                    <div
                        v-if="roomConfig?.withConfirmEstimates"
                        class="d-flex align-center ga-2"
                    >
                        <v-icon
                            icon="mdi-information-outline"
                            color="primary"
                        />
                        <span class="text-subtitle-1">С подтверждением оценки</span>
                    </div>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-sheet>
</template>

<script setup lang="ts">
import type { RoomConfig } from '@/definitions/room'
import EstimateVariantsSelectorCards from '@/components/settings/room-config/EstimateVariantsSelectorCards.vue'
import { computed } from 'vue'
import { useRoomEstimateVariants } from '@/store/composables/use-room-estimate-variants'

const { roomConfig } = defineProps<{
    roomConfig?: RoomConfig
}>()

const { defaultEstimateVariants } = useRoomEstimateVariants()

const estimateVariantsToShow = computed(() => {
    return roomConfig?.estimateVariants || defaultEstimateVariants
})
</script>
