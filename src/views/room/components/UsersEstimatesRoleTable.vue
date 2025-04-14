<template>
    <v-table class="w-100">
        <thead>
            <tr>
                <th
                    v-for="(title, key) in columns"
                    :key="`header-${key}`"
                    class="text-uppercase"
                >
                    {{ title }}
                </th>
            </tr>
        </thead>

        <tbody>
            <tr
                v-for="user in users"
                :key="user.id"
                :class="{ 'current-user': isAuthUser(user) }"
            >
                <td v-for="(_, key) in columns" :key>
                    <div
                        v-if="key === 'name'"
                        class="estimate-table-column name d-flex align-center justify-space-between"
                    >
                        <span
                            class="text-truncate"
                            :class="{ 'font-weight-bold': isAuthUser(user) }"
                        >
                            {{ user.name }}
                        </span>

                        <v-chip
                            v-if="isAuthUser(user)"
                            class="ml-2 flex-shrink-0"
                            color="primary"
                            size="x-small"
                            variant="flat"
                        >
                            You
                        </v-chip>
                    </div>

                    <EstimateItem
                        v-else-if="isEstimateTypeColumn(key)"
                        class="estimate-table-column"
                        :estimate="user.estimates?.[key]"
                        :closest-estimate="getClosestEstimate(key, user.estimates)"
                        :is-can-be-target="isAuthUser(user)"
                        :is-target="isAuthUser(user) && isTargetEstimateItem(key)"
                        :is-hidden="!isAuthUser(user) && !isEstimatesVisible"
                        @select="setCurrentEstimateType(key)"
                    />

                    <div v-else-if="key === 'pert'">
                        <EstimateItem
                            class="estimate-table-column"
                            :estimate="!isEmptyLikeEstimates(user.estimates) ? calculatePERT(user.estimates) : undefined"
                            :is-hidden="!isAuthUser(user) && !isEstimatesVisible"
                            is-can-copy
                        />
                    </div>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup lang="ts">
import { type User } from '@/definitions/user'
import { calculatePERT } from '@/utils/pert'
import { useAuthStore } from '@/store/auth'
import EstimateItem from '@/components/estimate/EstimateItem.vue'
import { type Estimates, EstimateType, type ValueUnitEstimate } from '@/definitions/estimates'
import { useEstimatesStore } from '@/store/estimates'
import { useRoomStore } from '@/store/room'
import { computed } from 'vue'
import { getBestValueUnitEstimateOfType, minimalEstimateUnit } from '@/utils/estimate/estimate'
import { isEmptyLikeEstimates } from '@/utils/estimate/guards'

const { isAuthUser } = useAuthStore()
const estimatesStore = useEstimatesStore()
const roomStore = useRoomStore()

const props = defineProps<{
    users: User[]
}>()

interface UserWithPERT extends User {
    PERT: ValueUnitEstimate
}

const columns = {
    name: 'Имя',
    [EstimateType.Min]: EstimateType.Min,
    [EstimateType.Probable]: EstimateType.Probable,
    [EstimateType.Max]: EstimateType.Max,
    pert: 'PERT',
}

const users = computed(() => {
    if (!isEstimatesVisible.value) return props.users

    return (props.users)
        .map((user) => {
            (user as UserWithPERT).PERT = calculatePERT(user.estimates, minimalEstimateUnit)
            return user as UserWithPERT
        })
        .sort((a, b) => a.PERT.value - b.PERT.value)
})

const isEstimatesVisible = computed(() => roomStore.data?.estimatesVisible)

function getClosestEstimate(type: EstimateType, estimates?: Estimates) {
    if (estimates?.[type]) return
    return getBestValueUnitEstimateOfType(type, estimates)
}

function isTargetEstimateItem(type: EstimateType) {
    return estimatesStore.type === type
}

function isEstimateTypeColumn(column: keyof typeof columns): column is EstimateType {
    return Object.values(EstimateType).includes(column as EstimateType)
}

function setCurrentEstimateType(type: EstimateType) {
    estimatesStore.setCurrentType(type)
}
</script>

<style scoped lang="scss">
.estimate-table-column {
    width: 80px;

    &.name {
        width: 180px;
    }
}
</style>
