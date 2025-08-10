<template>
    <BaseLayout :loading>
        <template #header-actions>
            <v-btn
                text="На главную"
                variant="outlined"
                prepend-icon="mdi-chevron-left"
                @click="toHome"
            />
        </template>

        <v-container>
            <JoinRoomForm
                :room-id
                :pin
            />

            <RoomConfigInfo :room-config />

            <GoToAuthRoom :room-id />
        </v-container>
    </BaseLayout>

    <RoomPinGuardDialog
        v-model="enterRoomPinDialogVisible"
        persistent
        @pin="onPin"
    />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import RouteName from '@/router/route-name'
import type { UID } from '@/definitions/aliases'
import BaseLayout from '@/layouts/BaseLayout.vue'
import GoToAuthRoom from '@/views/join-room/components/GoToAuthRoom.vue'
import { onMounted, ref } from 'vue'
import { FetchError, type FetchErrorData, request } from '@/plugins/ofetch'
import { toast } from 'vue3-toastify'
import RoomPinGuardDialog from '@/components/dialogs/RoomPinGuardDialog.vue'
import JoinRoomForm from '@/views/join-room/components/JoinRoomForm.vue'
import type { RoomConfig } from '@/definitions/room'
import RoomConfigInfo from '@/views/join-room/components/RoomConfigInfo.vue'

const router = useRouter()

const { roomId, pin: initialPin } = defineProps<{
    roomId: UID
    pin?: string
}>()

const pin = ref(initialPin || '')

const loading = ref(true)

const enterRoomPinDialogVisible = ref(false)

const roomConfig = ref<RoomConfig>()

async function getRoomConfig() {
    const response = await request.get<{ config?: RoomConfig }, FetchErrorData>('room-config', {
        roomId,
        pin: pin.value || undefined,
    })

    if (response instanceof FetchError) {
        switch (response.statusCode) {
            case 404: {
                await router.push({ name: RouteName.Home })
                toast.error('Комната не найдена')
                return
            }
            case 403: { // Комната защищена pin-кодом
                enterRoomPinDialogVisible.value = true
                return
            }
            case 400: {
                if (response.data?.error?.message === 'Invalid pin') {
                    enterRoomPinDialogVisible.value = true
                    toast.error('Неверный pin-код')
                } else if (response.data?.error?.message === 'Invalid roomId') {
                    await router.push({ name: RouteName.Home })
                    toast.error('Неверный id комнаты')
                } else {
                    await router.push({ name: RouteName.Home })
                    toast.error('Неизвестная ошибка')
                }
                return
            }
            default: {
                await router.push({ name: RouteName.Home })
                toast.error('Неизвестная ошибка')
                return
            }
        }
    }

    roomConfig.value = response.config

    loading.value = false
}

onMounted(async () => {
    await getRoomConfig()
})

async function setPinToRoute(pin: string) {
    await router.replace({
        ...router.currentRoute.value,
        query: {
            ...router.currentRoute.value.query,
            pin,
        },
    })
}

async function onPin(newPin: string) {
    pin.value = newPin
    await setPinToRoute(newPin)

    await getRoomConfig()
}

function toHome() {
    router.push({ name: RouteName.Home })
}
</script>
