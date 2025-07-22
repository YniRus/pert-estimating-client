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
                class="position-relative"
                :class="{ 'current-user': isAuthUser(user) }"
            >
                <td v-for="(_, key) in columns" :key>
                    <div
                        v-if="key === 'name'"
                        class="estimate-table-column name d-flex align-center justify-space-between"
                    >
                        <EstimateConfirmStatus
                            v-if="withConfirmEstimates"
                            :user-estimates="user.estimates"
                        />

                        <span
                            v-tooltip="{ text: user.name, openDelay: 500, maxWidth: 300 }"
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
                        :estimate="user.estimates.estimates?.[key]"
                        :closest-estimate="getClosestEstimate(key, user.estimates.estimates)"
                        :is-can-be-target="isAuthUser(user)"
                        :is-target="isAuthUser(user) && isTargetEstimateItem(key)"
                        :is-hidden="!isAuthUser(user) && !isEstimatesVisible"
                        @select="setCurrentEstimateType(key)"
                    />

                    <div v-else-if="key === 'pert'">
                        <EstimateItem
                            class="estimate-table-column"
                            :estimate="!isEmptyLikeEstimates(user.estimates.estimates) ? calculatePERT(user.estimates.estimates) : undefined"
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
import EstimateConfirmStatus from '@/views/room/components/EstimateConfirmStatus.vue'
import { useRoomConfig } from '@/store/composables/use-room-config'

const { isAuthUser } = useAuthStore()
const roomStore = useRoomStore()
const estimatesStore = useEstimatesStore()
const { withConfirmEstimates } = useRoomConfig()

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
            (user as UserWithPERT).PERT = calculatePERT(user.estimates.estimates, minimalEstimateUnit)
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
@use 'sass:map';
@use 'vuetify/settings' as v-settings;

.estimate-table-column {
    width: 80px;

    &.name {
        width: 180px;
    }
}

.v-table {
    :deep(.v-table__wrapper) { /* stylelint-disable-line */
        padding: 0 map.get(v-settings.$spacers, 4);
    }
}
</style>
