<template>
    <v-container class="users-estimates px-4 d-flex flex-column ga-5">
        <template v-for="(users, group) in groupedUsers" :key="group">
            <v-card
                v-if="users.length"
                elevation="2"
                rounded="lg"
            >
                <v-card-text class="pa-4">
                    <div class="d-flex flex-row justify-space-between">
                        <p
                            class="text-h4"
                            :class="{ 'text-uppercase': group !== UNASSIGNED }"
                        >
                            {{ group === UNASSIGNED ? 'Без роли' : group }}
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

const UNASSIGNED = 'unassigned'

const roomStore = useRoomStore()

const groupedUsers = computed(() => {
    const groups: Record<string, User[]> = {
        [UserRole.Dev]: [],
        [UserRole.QA]: [],
        [UNASSIGNED]: [],
    }

    roomStore.data!.users
        .forEach((user) => groups[user.role || UNASSIGNED].push(user))

    return groups
})
</script>

<style lang="scss" scoped>
.users-estimates {
    max-width: var(--content-max-width);
}
</style>
