<template>
    <v-toolbar>
        <v-toolbar-title>PERT Estimating</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn
            class="mr-5"
            text="Создать комнату"
            variant="outlined"
            @click="createRoomDialog = true"
        />
    </v-toolbar>

    <v-container class="d-flex justify-center mt-5">
        <EnterRoomForm
            :loading
            @login="login"
        />
    </v-container>

    <EnterRoomPinDialog
        v-model="enterRoomPinDialog"
        @login="onLoginWithPin"
    />

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
import EnterRoomForm, { type EnterRoomFormData } from '@/views/home/components/EnterRoomForm.vue'
import { FetchError, request } from '@/plugins/ofetch'
import CreatedRoomDialog from '@/views/home/components/CreatedRoomDialog.vue'
import EnterRoomPinDialog from '@/views/home/components/EnterRoomPinDialog.vue'
import { toast } from 'vue3-toastify'

const loading = ref(false)

const createRoomDialog = ref(false)

const createdRoomDialog = ref(false)
const createdRoomAccessUrl = ref("")

function onRoomCreated(accessUrl: string) {
    createdRoomAccessUrl.value = accessUrl
    createRoomDialog.value = false
    createdRoomDialog.value = true
}

const enterRoomFormData = ref<EnterRoomFormData | null>(null)
const enterRoomPinDialog = ref(false)

async function onLoginWithPin(pin: string) {
    if (!enterRoomFormData.value) return

    await login({ ...enterRoomFormData.value, pin })
}

async function login({ roomId, role, name, pin }: EnterRoomFormData) {
    enterRoomFormData.value = { roomId, role, name, pin }

    let response = await request.post<{a: string}>("/login", {
        roomId,
        name,
        role: role || "",
        pin,
    }, { loading })

    if (response instanceof FetchError) {
        switch (response.statusCode) {
            case 404: {
                toast.error('Комната не найдена')
                break
            }
            case 403: { // Комната защищена pin-кодом
                enterRoomPinDialog.value = true
                break
            }
            case 400: {
                enterRoomPinDialog.value = true
                toast.error('Неверный pin-код')
                break
            }
            default: {
                toast.error('Неизвестная ошибка')
            }
        }
    } else {
        // TODO: Переход в комнату
    }
}
</script>