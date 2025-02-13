<template>
    <v-container class="users-estimates px-4 py-0 my-5 d-flex flex-column ga-5">
        <template v-for="(users, role) in groupedUsers" :key="role">
            <v-card
                v-if="users.length"
                class="users-group-estimates"
                elevation="2"
                rounded="lg"
            >
                <v-card-text class="pa-4">
                    <div class="d-flex flex-row justify-space-between">
                        <p class="text-h4 text-uppercase">
                            {{ role === 'unassigned' ? 'Unassigned' : role }}
                        </p>

                        <UsersTotalEstimate :users />
                    </div>

                    <UsersEstimatesRoleTable
                        :users="users"
                        @estimate-change="handleEstimateChange"
                        @save="saveEstimates"
                    />
                </v-card-text>
            </v-card>
        </template>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { type User, UserRole } from '@/definitions/user'
import UsersEstimatesRoleTable from '@/views/room/components/UsersEstimatesRoleTable.vue'
import UsersTotalEstimate from '@/views/room/components/UsersTotalEstimate.vue'
import { useRoomStore } from '@/store/room'

const roomStore = useRoomStore()

const showSaveButton = ref(false)

const groupedUsers = computed(() => {
    const groups: Record<string, User[]> = {
        [UserRole.Dev]: [],
        [UserRole.QA]: [],
        unassigned: [],
    }

    roomStore.data!.users.forEach((user) => groups[!user.role ? 'unassigned' : user.role].push(user))

    return groups
})

const handleEstimateChange = () => {
    showSaveButton.value = true
}

const saveEstimates = () => {
    showSaveButton.value = false
    // Here you would typically emit an event to save the changes
}
</script>

<style lang="scss" scoped>
@use '@/styles/mixins';

.users-estimates {
    @include mixins.flex(column);

    max-width: var(--content-max-width);
}

kbd {
    padding: 2px 6px;

    font-family: monospace;
    font-size: 0.75rem;

    background-color: rgb(var(--v-theme-surface) 0.9);
    border: 1px solid rgb(var(--v-border-color) 0.12);
    border-radius: 4px;
    box-shadow: 0 1px 1px rgb(0 0 0 / 10%);
}

.save-button {
    position: absolute;
    right: 0;
    bottom: -4rem;
}
</style>
