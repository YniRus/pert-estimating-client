<template>
    <BaseLayout>
        <template #header-actions>
            <v-btn
                class="mr-5"
                text="Создать комнату"
                variant="outlined"
                @click="createRoomDialog = true"
            />
        </template>

        <v-container class="d-flex justify-center mt-5">
            <EnterRoomForm
                :loading
                @login="login"
            />
        </v-container>
    </BaseLayout>

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
import { useRouter } from 'vue-router'
import RouteName from '@/router/route-name'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { wrap } from '@/utils/loading'

const router = useRouter()

const loading = ref(false)

const createRoomDialog = ref(false)

const createdRoomDialog = ref(false)
const createdRoomAccessUrl = ref('')

function onRoomCreated(accessUrl: string) {
    createdRoomAccessUrl.value = accessUrl
    createRoomDialog.value = false
    createdRoomDialog.value = true
}

const enterRoomFormData = ref<EnterRoomFormData | null>(null)
const enterRoomPinDialog = ref(false)

async function onLoginWithPin(pin: string) {
    if (!enterRoomFormData.value) return

    login({ ...enterRoomFormData.value, pin })
}

function login({ roomId, role, name, pin }: EnterRoomFormData) {
    enterRoomFormData.value = { roomId, role, name, pin }

    wrap(loading, async () => {
        let response = await request.post<null>('/login', {
            roomId,
            name,
            role: role || '',
            pin,
        })

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
            await router.push({ name: RouteName.Room, params: { roomId } })
        }
    })
}
</script>
