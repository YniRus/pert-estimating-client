<template>
    <v-table class="estimates-table">
        <thead>
            <tr>
                <th class="name-column">
                    Name
                </th>
                <th class="estimate-column">
                    Min
                </th>
                <th class="estimate-column">
                    Probable
                </th>
                <th class="estimate-column">
                    Max
                </th>
                <th class="estimate-column">
                    PERT
                </th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="user in users"
                :key="user.id"
                :class="{ 'current-user': isAuthUser(user) }"
            >
                <td class="name-cell">
                    <div class="d-flex align-center justify-space-between">
                        <span class="user-name">{{ user.name }}</span>
                        <v-chip
                            v-if="isAuthUser(user)"
                            color="primary"
                            size="x-small"
                            variant="flat"
                        >
                            You
                        </v-chip>
                    </div>
                </td>
                <td>
                    <EstimateItem
                        :estimate="user.estimates?.[EstimateType.Min]"
                        :is-selectable="isAuthUser(user)"
                        :is-target="isAuthUser(user) && isTargetEstimateItem(EstimateType.Min)"
                        @select="setCurrentEstimateType(EstimateType.Min)"
                    />
                </td>
                <td>
                    <EstimateItem
                        :estimate="user.estimates?.[EstimateType.Probable]"
                        :is-selectable="isAuthUser(user)"
                        :is-target="isAuthUser(user) && isTargetEstimateItem(EstimateType.Probable)"
                        @select="setCurrentEstimateType(EstimateType.Probable)"
                    />
                </td>
                <td>
                    <EstimateItem
                        :estimate="user.estimates?.[EstimateType.Max]"
                        :is-selectable="isAuthUser(user)"
                        :is-target="isAuthUser(user) && isTargetEstimateItem(EstimateType.Max)"
                        @select="setCurrentEstimateType(EstimateType.Max)"
                    />
                </td>
                <td>
                    <div class="font-weight-medium">
                        <EstimateItem :estimate="calculatePERT(user.estimates)" />
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
import EstimateItem from '@/components/common/EstimateItem.vue'
import { EstimateType } from '@/definitions/estimates'
import { useEstimatesStore } from '@/store/estimates'

const authStore = useAuthStore()
const estimatesStore = useEstimatesStore()

defineProps<{
    users: User[]
}>()

function isAuthUser(user: User) {
    return user.id === authStore.data?.user.id
}

function isTargetEstimateItem(type: EstimateType) {
    return estimatesStore.type === type
}

function setCurrentEstimateType(type: EstimateType) {
    estimatesStore.setCurrentType(type)
}
</script>

<style scoped>
.estimates-table {
    table-layout: fixed;
    width: 100%;
    background: transparent !important;
}

.name-column {
    width: 200px;
}

.estimate-column {
    width: 120px;
}

.estimates-table th {
    height: 48px;

    font-size: 0.875rem;
    font-weight: 600;
    color: rgb(var(--v-theme-on-surface) 0.6);
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.estimates-table td {
    height: 48px;
    text-align: left;
    vertical-align: middle;
    border-bottom: 1px solid rgb(var(--v-border-color) 0.08);
}

.current-user {
    background-color: rgb(var(--v-theme-primary) 0.04);
}

.user-name {
    font-weight: 500;
    color: rgb(var(--v-theme-on-surface) 0.87);
}

:deep(.estimate-input) {
    width: 80px;
}

:deep(.v-field__input) {
    font-family: monospace;
}

:deep(.v-text-field) {
    margin: 0 !important;
    padding: 0 !important;
}

:deep(.v-table) {
    background: transparent !important;
    box-shadow: none !important;
}

:deep(.v-table__wrapper) {
    border-radius: 0;
}

:deep(.v-field--variant-underlined .v-field__outline::before) {
    border-color: rgb(var(--v-theme-primary) 0.2);
}

:deep(.v-field--variant-underlined .v-field__outline::after) {
    border-color: rgb(var(--v-theme-primary));
}
</style>
