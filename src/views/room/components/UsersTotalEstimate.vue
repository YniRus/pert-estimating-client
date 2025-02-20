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
import { calculateAvgPERT } from '@/utils/pert'
import EstimateItem from '@/components/estimate/EstimateItem.vue'
import {
    convertEstimateToBestUnit,
    getNearestBaseEstimate,
    minimalEstimateUnit,
} from '@/utils/estimate'
import { useRoomStore } from '@/store/room'

const { users } = defineProps<{
    users: User[]
}>()

const roomStore = useRoomStore()

const isHidden = computed(() => !roomStore.data?.estimatesVisible)

const avgEstimate = computed<ValueUnitEstimate>(() => {
    const avgEstimate = calculateAvgPERT(users, minimalEstimateUnit)
    return convertEstimateToBestUnit(avgEstimate)
})

const nearestPredefinedEstimate = computed<Estimate>(() => {
    return getNearestBaseEstimate(avgEstimate.value)
})
</script>
