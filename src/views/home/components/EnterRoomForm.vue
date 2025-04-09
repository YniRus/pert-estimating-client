<template>
    <v-sheet
        class="pa-3"
        elevation="8"
        rounded="lg"
        width="100%"
        max-width="var(--dialog-max-width)"
    >
        <v-form
            ref="form"
            @submit.prevent="submit"
        >
            <v-container>
                <p class="text-h5 mb-5">
                    Войти в комнату
                </p>

                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="roomId"
                            :rules="roomIdValidationRules"
                            label="Room ID"
                            variant="outlined"
                        />
                    </v-col>
                </v-row>

                <v-btn
                    :loading="loading"
                    class="mt-2"
                    text="К авторизации"
                    append-icon="mdi-chevron-right"
                    type="submit"
                    variant="outlined"
                    block
                />
            </v-container>
        </v-form>
    </v-sheet>

    <RoomPinGuardDialog
        v-model="enterRoomPinDialog"
        @pin="onEnterWithPin"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { wrap } from '@/utils/loading'
import { FetchError, request } from '@/plugins/ofetch'
import { toast } from 'vue3-toastify'
import RouteName from '@/router/route-name'
import { useRouter } from 'vue-router'
import RoomPinGuardDialog from '@/components/dialogs/RoomPinGuardDialog.vue'

export type EnterRoomFormData = {
    roomId: string
    pin?: string
}

const router = useRouter()

const form = ref<VForm | null>(null)

const roomId = ref('')

const roomIdValidationRules = ref([
    (value: string) => value ? true : 'Введите ID комнаты',
])

async function submit() {
    const { valid } = await form.value!.validate()
    if (!valid) return

    await enterRoom(getEnterRoomFormData())
}

function getEnterRoomFormData(pin?: string): EnterRoomFormData {
    return {
        roomId: roomId.value,
        pin,
    }
}

const loading = ref(false)

const enterRoomPinDialog = ref(false)

async function onEnterWithPin(pin: string) {
    await enterRoom(getEnterRoomFormData(pin))
}

// TODO: Унифицировать обработку ошибок, сделать универсальнее
async function enterRoom(data: EnterRoomFormData) {
    await wrap(loading, async () => {
        let response = await request.get<null>('/is-room-access-available', data)

        if (response instanceof FetchError) {
            switch (response.statusCode) {
                case 404: {
                    toast.error('Комната не найдена')
                    return
                }
                case 403: { // Комната защищена pin-кодом
                    enterRoomPinDialog.value = true
                    return
                }
                case 400: {
                    if (response.statusMessage === 'Invalid pin') {
                        enterRoomPinDialog.value = true
                        toast.error('Неверный pin-код')
                    } else if (response.statusMessage === 'Invalid roomId') {
                        toast.error('Неверный id комнаты')
                    } else {
                        toast.error('Неизвестная ошибка')
                    }
                    return
                }
                default: {
                    toast.error('Неизвестная ошибка')
                    return
                }
            }
        }

        await router.push({
            name: RouteName.JoinRoom,
            params: { roomId: data.roomId },
            query: { pin: data.pin },
        })
    })
}
</script>
