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
                :estimate="nearestPredefinedEstimate"
                :is-hidden="isHidden"
                is-can-copy
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import type { User } from '@/definitions/user'
import { computed } from 'vue'
import { type Estimate, type ValueUnitEstimate } from '@/definitions/estimates'
import { calculatePERT } from '@/utils/pert'
import EstimateItem from '@/components/common/EstimateItem.vue'
import {
    convertEstimateToBestUnit,
    getNearestBaseEstimate,
    isValueUnitEstimate,
    minimalEstimateUnit,
} from '@/utils/estimate'
import { useRoomStore } from '@/store/room'

const { users } = defineProps<{
    users: User[]
}>()

const roomStore = useRoomStore()

const isHidden = computed(() => !roomStore.data?.estimatesVisible)

const avgEstimate = computed<ValueUnitEstimate>(() => {
    const usersWithEstimates = users
        .filter((user) => Object.values(user.estimates || {}).some(isValueUnitEstimate))

    const sumEstimateValue = usersWithEstimates.reduce((sumEstimateValue, user) => {
        const value = calculatePERT(user.estimates, minimalEstimateUnit).value
        return sumEstimateValue + value
    }, 0)

    return convertEstimateToBestUnit({
        value: (sumEstimateValue / usersWithEstimates.length) || 0,
        unit: minimalEstimateUnit,
    })
})

const nearestPredefinedEstimate = computed<Estimate>(() => {
    return getNearestBaseEstimate(avgEstimate.value)
})
</script>
