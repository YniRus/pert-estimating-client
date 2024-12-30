<template>
    <v-container class="user-estimates px-4">
        <template v-for="(users, role) in groupedUsers" :key="role">
            <div v-if="users.length" class="estimate-section mb-12">
                <v-card
                    class="estimates-card"
                    elevation="2"
                    rounded="lg"
                >
                    <v-card-text class="pa-4">
                        <h2 class="role-title text-uppercase">
                            {{ role === 'unassigned' ? 'Unassigned' : role }}
                        </h2>

                        <UsersEstimatesRoleTable
                            :room="room"
                            :users="users"
                            @estimate-change="handleEstimateChange"
                            @save="saveEstimates"
                        />
                    </v-card-text>
                </v-card>
            </div>
        </template>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { type User, UserRole } from '@/definitions/user'
import type { Room } from '@/definitions/room'
import UsersEstimatesRoleTable from '@/views/room/components/UsersEstimatesRoleTable.vue'

interface Props {
    room: Room
}

const props = defineProps<Props>()
const showSaveButton = ref(false)

const groupedUsers = computed(() => {
    const groups: Record<string, User[]> = {
        [UserRole.Dev]: [],
        [UserRole.QA]: [],
        unassigned: [],
    }

    props.room.users.forEach((user) => groups[!user.role ? 'unassigned' : user.role].push(user))

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
.user-estimates {
    max-width: var(--content-max-width);
}

.estimate-section {
    position: relative;
}

.role-title {
    position: absolute;
    z-index: 1;
    top: -1.5rem;
    left: -1rem;

    font-size: 2rem;
    font-weight: 700;
    color: rgb(var(--v-theme-on-surface) 0.87);
    letter-spacing: 0.05em;
}

.estimates-card {
    margin-top: 2rem;
    border: 1px solid rgb(var(--v-border-color) 0.1);
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
