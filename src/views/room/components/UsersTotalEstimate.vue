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

const { users } = defineProps<{
    users: User[]
}>()

const roomStore = useRoomStore()

const isHidden = computed(() => !roomStore.data?.estimatesVisible)

const avgEstimate = computed<ValueUnitEstimate>(() => {
    const avgEstimate = calculateAvgPERT(users, minimalEstimateUnit)
    return convertEstimateToBestUnit(avgEstimate)
})

const nearestPredefinedValueEstimate = computed<ValueUnitEstimate>(() => {
    return getNearestBaseValueEstimate(avgEstimate.value)
})
</script>
