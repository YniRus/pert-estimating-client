<template>
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

function isAuthUser(user: User) {
    return user.id === authStore.data?.user.id
}

function getUserEstimate(userId: string) {
    return props.room.estimates?.[userId]
}
</script>
