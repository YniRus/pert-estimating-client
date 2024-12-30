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
                    <div>
                        {{ getUserEstimate(user.id)?.min || '-' }}
                    </div>
                </td>
                <td>
                    <div>
                        {{ getUserEstimate(user.id)?.probable || '-' }}
                    </div>
                </td>
                <td>
                    <div>
                        {{ getUserEstimate(user.id)?.max || '-' }}
                    </div>
                </td>
                <td>
                    <div class="font-weight-medium">
                        {{ calculatePERT(getUserEstimate(user.id)) }}
                    </div>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup lang="ts">
import { type User } from '@/definitions/user'
import { calculatePERT } from '@/utils/pert'
import type { Room } from '@/definitions/room'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

const props = defineProps<{
    room: Room
    users: User[]
}>()

const emit = defineEmits<{
    'estimate-change': []
    'save': []
}>()

function isAuthUser(user: User) {
    return user.id === authStore.data?.user.id
}

function getUserEstimate(userId: string) {
    return props.room.estimates?.[userId]
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
