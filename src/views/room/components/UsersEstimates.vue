<template>
    <v-container class="users-estimates d-flex flex-column pa-0 ga-5">
        <template v-for="(users, group) in groupedUsers" :key="group">
            <v-card
                v-if="users.length"
                elevation="2"
                rounded="lg"
            >
                <v-card-text class="pa-4">
                    <div class="d-flex flex-row justify-space-between">
                        <p class="text-h4">
                            {{ getGroupTitle(group) }}
                        </p>

                        <UsersTotalEstimate :users />
                    </div>

                    <UsersEstimatesRoleTable :users="users" />
                </v-card-text>
            </v-card>
        </template>
    </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type User, UserRole } from '@/definitions/user'
import UsersEstimatesRoleTable from '@/views/room/components/UsersEstimatesRoleTable.vue'
import UsersTotalEstimate from '@/views/room/components/UsersTotalEstimate.vue'
import { useRoomStore } from '@/store/room'
import { useAuthStore } from '@/store/auth'
import { getRoleTitle } from '@/utils/role'

const UNASSIGNED = 'unassigned'

type Group = UserRole | typeof UNASSIGNED

const roomStore = useRoomStore()
const authStore = useAuthStore()

const authUserGroup = computed(() => {
    return authStore.data?.user.role || UNASSIGNED
})

const groupsOrder = computed<Group[]>(() => {
    return Array.from(new Set([authUserGroup.value, ...Object.values(UserRole), UNASSIGNED]))
})

const groupedUsers = computed(() => {
    const groupedUsers = groupsOrder.value.reduce((groups, group) => {
        return { ...groups, [group]: [] }
    }, {} as Record<Group, User[]>)

    roomStore.data!.users.forEach((user) => {
        authStore.isAuthUser(user)
            ? groupedUsers[user.role || UNASSIGNED].unshift(user)
            : groupedUsers[user.role || UNASSIGNED].push(user)
    })

    return groupedUsers
})

function getGroupTitle(group: Group) {
    if (group === UNASSIGNED) return getRoleTitle('')
    return getRoleTitle(group)
}
</script>
