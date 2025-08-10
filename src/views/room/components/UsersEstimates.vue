<template>
    <v-container class="users-estimates d-flex flex-column pa-0 ga-5">
        <template v-for="(users, group) in roomGroupedUsersWhoCanEstimates" :key="group">
            <v-card
                v-if="users.length"
                elevation="2"
                rounded="lg"
            >
                <v-card-text class="pa-0 py-4">
                    <div class="d-flex flex-row align-center px-4">
                        <p class="text-h4">
                            {{ getGroupTitle(group) }}
                        </p>

                        <p class="text-subtitle-2 ml-4 text-grey">
                            {{ getGroupUsersEstimatesCountText(users) }}
                        </p>

                        <UsersTotalEstimate class="ml-auto" :users />
                    </div>

                    <UsersEstimatesRoleTable :users="users" />
                </v-card-text>
            </v-card>
        </template>

        <template v-if="!hasUsersWhoCanEstimates">
            <v-sheet class="text-center pa-4">
                <p class="text-grey">
                    Пока никого нет :(
                </p>
            </v-sheet>
        </template>
    </v-container>
</template>

<script setup lang="ts">
import { type User, UserRole } from '@/definitions/user'
import UsersEstimatesRoleTable from '@/views/room/components/UsersEstimatesRoleTable.vue'
import UsersTotalEstimate from '@/views/room/components/UsersTotalEstimate.vue'
import { getRoleGroupTitle } from '@/utils/role'
import { isEmptyEstimates } from '@/utils/estimate/guards'
import { useRoomGroupedUsers } from '@/store/composables/use-room-grouped-users'

const UNASSIGNED = 'unassigned'

type Group = UserRole | typeof UNASSIGNED

const { roomGroupedUsersWhoCanEstimates, hasUsersWhoCanEstimates } = useRoomGroupedUsers()

function getGroupTitle(group: Group) {
    if (group === UNASSIGNED) return getRoleGroupTitle('')
    return getRoleGroupTitle(group)
}

function getGroupUsersEstimatesCountText(users: User[]) {
    const usersWithEstimates = users.reduce((count, user) => count + +(!isEmptyEstimates(user.estimates.estimates)), 0)
    return `${usersWithEstimates} из ${users.length}`
}
</script>
