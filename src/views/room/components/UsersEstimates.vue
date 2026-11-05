<template>
    <v-container class="users-estimates d-flex flex-column pa-0 ga-5">
        <template v-for="(users, group) in roomGroupedUsersWhoCanEstimates" :key="group">
            <v-card
                v-if="users.length"
                elevation="2"
                rounded="lg"
            >
                <v-card-text class="pa-0 py-4">
                    <div class="d-flex flex-row flex-wrap align-center px-4 ga-2">
                        <p class="text-h4">
                            {{ getGroupTitle(group) }}
                        </p>

                        <p class="text-subtitle-2 ml-4 text-grey">
                            {{ getGroupUsersEstimatesCountText(users) }}
                        </p>

                        <div class="d-flex flex-wrap align-center ga-2 ml-auto">
                            <UsersEstimatesAgreement v-if="roomStore.data?.estimatesVisible" :users />
                            <UsersTotalEstimate :users />
                        </div>
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
import UsersEstimatesAgreement from '@/views/room/components/UsersEstimatesAgreement.vue'
import { useRoomStore } from '@/store/room'
import { getRoleGroupTitle } from '@/utils/role'
import { isEmptyEstimates } from '@/utils/estimate/guards'
import { useRoomGroupedUsers } from '@/store/composables/use-room-grouped-users'

const UNASSIGNED = 'unassigned'

type Group = UserRole | typeof UNASSIGNED

const { roomGroupedUsersWhoCanEstimates, hasUsersWhoCanEstimates } = useRoomGroupedUsers()
const roomStore = useRoomStore()

function getGroupTitle(group: Group) {
    if (group === UNASSIGNED) return getRoleGroupTitle('')
    return getRoleGroupTitle(group)
}

function getGroupUsersEstimatesCountText(users: User[]) {
    const usersWithEstimates = users.reduce((count, user) => count + +(!isEmptyEstimates(user.estimates.estimates)), 0)
    return `${usersWithEstimates} из ${users.length}`
}
</script>
