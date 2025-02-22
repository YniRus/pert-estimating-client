<template>
    <BaseLayout>
        <template #header-actions>
            <v-btn
                text="На главную"
                variant="outlined"
                prepend-icon="mdi-chevron-left"
                @click="toHome"
            />
        </template>

        <v-container>
            <EnterRoomForm :initial-data="{ roomId, pin }" />

            <GoToAuthRoom :room-id="roomId" />
        </v-container>
    </BaseLayout>
</template>

<script setup lang="ts">
import EnterRoomForm from '@/views/home/components/EnterRoomForm.vue'
import { useRouter } from 'vue-router'
import RouteName from '@/router/route-name'
import type { UID } from '@/definitions/aliases'
import BaseLayout from '@/layouts/BaseLayout.vue'
import GoToAuthRoom from '@/views/join-room/components/GoToAuthRoom.vue'

const router = useRouter()

const { roomId, pin } = defineProps<{
    roomId: UID
    pin?: string
}>()

function toHome() {
    router.push({ name: RouteName.Home })
}
</script>
