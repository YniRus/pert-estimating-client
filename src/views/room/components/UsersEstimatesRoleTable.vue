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
                        <span class="text-truncate font-weight-bold">
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
                        :is-can-be-target="isAuthUser(user)"
                        :is-target="isAuthUser(user) && isTargetEstimateItem(key)"
                        @select="setCurrentEstimateType(key)"
                    />

                    <EstimateItem
                        v-else-if="key === 'pert'"
                        class="estimate-table-column"
                        :estimate="calculatePERT(user.estimates)"
                    />
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup lang="ts">
import { type User } from '@/definitions/user'
import { calculatePERT } from '@/utils/pert'
import { useAuthStore } from '@/store/auth'
import EstimateItem from '@/components/common/EstimateItem.vue'
import { EstimateType } from '@/definitions/estimates'
import { useEstimatesStore } from '@/store/estimates'

const authStore = useAuthStore()
const estimatesStore = useEstimatesStore()

defineProps<{
    users: User[]
}>()

const columns = {
    name: 'Имя',
    [EstimateType.Min]: EstimateType.Min,
    [EstimateType.Probable]: EstimateType.Probable,
    [EstimateType.Max]: EstimateType.Max,
    pert: 'PERT',
}

function isAuthUser(user: User) {
    return user.id === authStore.data?.user.id
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
