<template>
    <BaseLayout>
        <template #header-actions>
            <v-btn
                text="Создать комнату"
                variant="outlined"
                @click="createRoomDialog = true"
            />
        </template>

        <v-container>
            <EnterRoomForm />

            <GoToAuthRoom />
        </v-container>
    </BaseLayout>

    <CreateRoomDialog
        v-model="createRoomDialog"
        @created="onRoomCreated"
    />

    <CreatedRoomDialog
        v-model="createdRoomDialog"
        :access-url="createdRoomAccessUrl"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CreateRoomDialog from '@/views/home/components/CreateRoomDialog.vue'
import EnterRoomForm from '@/views/home/components/EnterRoomForm.vue'
import CreatedRoomDialog from '@/views/home/components/CreatedRoomDialog.vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import GoToAuthRoom from '@/views/join-room/components/GoToAuthRoom.vue'

const createRoomDialog = ref(false)

const createdRoomDialog = ref(false)
const createdRoomAccessUrl = ref('')

function onRoomCreated(accessUrl: string) {
    createdRoomAccessUrl.value = accessUrl
    createRoomDialog.value = false
    createdRoomDialog.value = true
}
</script>
