<template>
    <div class="d-flex flex-row align-center ga-1">
        <v-icon
            v-if="isHidden"
            icon="mdi-eye-off-outline"
            class="text-grey mr-4"
        />

        <template v-else>
            <EstimateItem
                class="pr-0"
                :estimate="avgEstimate"
                is-can-copy
            />

            <v-icon icon="mdi-approximately-equal" />

            <EstimateItem
                class="pl-1"
                :estimate="nearestPredefinedValueEstimate"
                :is-hidden="isHidden"
                is-can-copy
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import type { User } from '@/definitions/user'
import { computed } from 'vue'
import { type ValueUnitEstimate } from '@/definitions/estimates'
import { calculateAvgPERT } from '@/utils/pert'
import EstimateItem from '@/components/estimate/EstimateItem.vue'
import {
    convertEstimateToBestUnit,
    minimalEstimateUnit,
} from '@/utils/estimate/estimate'
import { useRoomStore } from '@/store/room'
import { getNearestBaseValueEstimate } from '@/utils/estimate/nearest'
import { useRoomEstimateVariants } from '@/store/composables/use-room-estimate-variants'
import { getMinimalNonZeroValue } from '@/utils/estimate/values'

const { users } = defineProps<{
    users: User[]
}>()

const roomStore = useRoomStore()
const { estimateValues } = useRoomEstimateVariants()

const isHidden = computed(() => !roomStore.data?.estimatesVisible)

const avgEstimate = computed<ValueUnitEstimate>(() => {
    const usersEstimates = users.map((user) => user.estimates.estimates)
    const avgEstimate = calculateAvgPERT(usersEstimates, minimalEstimateUnit)
    const avgEstimateInBestUnit = convertEstimateToBestUnit(avgEstimate, getMinimalNonZeroValue(estimateValues.value))

    avgEstimateInBestUnit.value = +avgEstimateInBestUnit.value.toFixed(2)

    return avgEstimateInBestUnit
})

const nearestPredefinedValueEstimate = computed<ValueUnitEstimate>(() => {
    return getNearestBaseValueEstimate(avgEstimate.value, estimateValues.value)
})
</script>
