<template>
    <v-menu
        v-model="menu"
        :close-on-content-click="false"
        location="bottom start"
        offset="20"
    >
        <template #activator="{ props }">
            <v-badge
                :content="roomStore.data?.users.length || ''"
                :offset-x="4"
                :offset-y="6"
                color="grey-lighten-2"
            >
                <v-btn
                    icon="mdi-account"
                    size="small"
                    v-bind="props"
                />
            </v-badge>
        </template>

        <v-card width="352" class="pa-4">
            <v-label class="mb-2">
                Состав комнаты
            </v-label>

            <v-list class="pa-0">
                <template v-for="(users, group, index) in roomGroupedUsers" :key="group">
                    <template v-if="users.length">
                        <v-divider v-if="index > 0" />

                        <v-list-subheader :title="getGroupTitle(group) + ' (' + users.length + ')'" />
                    </template>

                    <v-list-item
                        v-for="user in users"
                        :key="user.id"
                        :title="user.name"
                        density="compact"
                    >
                        <template
                            v-if="authStore.isAuthUser(user)"
                            #append
                        >
                            <v-chip
                                color="primary"
                                size="x-small"
                                variant="flat"
                            >
                                You
                            </v-chip>
                        </template>
                    </v-list-item>
                </template>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRoomStore } from '@/store/room'
import { type RoomUserGroup, UNASSIGNED_GROUP, useRoomGroupedUsers } from '@/store/composables/use-room-grouped-users'
import { getRoleTitleMultiply } from '@/utils/role'

const authStore = useAuthStore()
const roomStore = useRoomStore()

const menu = ref(false)

const { roomGroupedUsers } = useRoomGroupedUsers()

function getGroupTitle(group: RoomUserGroup) {
    if (group === UNASSIGNED_GROUP) return getRoleTitleMultiply('')
    return getRoleTitleMultiply(group)
}
</script>
