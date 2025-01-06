<template>
    <div class="users-total-estimate">
        <EstimateItem :estimate="avgEstimate" />
        <span class="text-h6">≈</span>
        <EstimateItem class="pl-1" :estimate="nearestPredefinedEstimate" />
    </div>
</template>

<script setup lang="ts">
import type { User } from '@/definitions/user'
import { computed } from 'vue'
import { type Estimate, EstimateUnit } from '@/definitions/estimates'
import { calculatePERT } from '@/utils/pert'
import EstimateItem from '@/components/common/EstimateItem.vue'
import { getEstimateValue } from '@/utils/estimate'

const { users } = defineProps<{
    users: User[]
}>()

const avgEstimate = computed<Estimate>(() => {
    const usersWithEstimates = users.filter((user) =>
        Object.values(user.estimates || {}).some((estimate?: Estimate) => estimate?.value),
    )

    const avgEstimateValue = usersWithEstimates.reduce((avgEstimateValue, user) => {
        const value = getEstimateValue(calculatePERT(user.estimates)) // TODO: Переписать с Generic value
        return avgEstimateValue + value
    }, 0)

    return {
        value: avgEstimateValue,
        unit: EstimateUnit.Hours, // TODO: Вычислять с учетом общего типа
    }
})

// TODO: Вычислять
const nearestPredefinedEstimate = computed<Estimate>(() => ({
    value: 0,
    unit: EstimateUnit.Days,
}))
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as v-settings;
@use '@/styles/mixins';

.users-total-estimate {
    @include mixins.flex-center(row);

    gap: map.get(v-settings.$spacers, 1);
}
</style>
