<template>
    <BaseLayout :loading>
        <template #header-actions>
            <v-btn
                class="mr-5"
                text="Покинуть комнату"
                :ripple="false"
                variant="text"
                :loading="leaveLoading"
                @click="leaveRoom"
            />
        </template>

        <div
            v-if="roomStore.data"
            class="room-view d-flex align-center flex-column"
        >
            <EstimateVariantCards />

            <RoomActions class="mb-5" />

            <UsersEstimates class="py-0 mb-5" />
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import type { UID } from '@/definitions/aliases'
import { onMounted, onUnmounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import RouteName from '@/router/route-name'
import { useRouter } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import EstimateVariantCards from '@/views/room/components/EstimateVariantCards.vue'
import ws from '@/plugins/ws'
import { wrap } from '@/utils/loading'
import { FetchError, request } from '@/plugins/ofetch'
import UsersEstimates from '@/views/room/components/UsersEstimates.vue'
import { useAuthStore } from '@/store/auth'
import { useRoomStore } from '@/store/room'
import { authUserRoomEstimates } from '@/store/composables/auth-user-room-estimates'
import RoomActions from '@/views/room/components/RoomActions.vue'
import { useConfirm } from 'vuetify-use-dialog'

const router = useRouter()
const authStore = useAuthStore()
const roomStore = useRoomStore()

const { watchEstimatesOn, watchEstimatesOff } = authUserRoomEstimates()
const confirm = useConfirm()

const props = defineProps<{
    roomId: UID
}>()

const loading = ref(false)

onMounted(() => {
    wrap(loading, async () => {
        const roomError = await roomStore.init(props.roomId)

        if (roomError) {
            await router.push({ name: RouteName.Home })

            switch (roomError.code) {
                case 400: {
                    toast.error('Ошибка запроса')
                    return
                }
                case 401: {
                    toast.error('Вы не авторизованы')
                    return
                }
                case 403: {
                    toast.error('Доступ запрещён')
                    return
                }
                case 404: {
                    toast.error('Комната не найдена')
                    return
                }
                default: {
                    toast.error('Неизвестная ошибка')
                    return
                }
            }
        }

        const authError = await authStore.auth()

        if (authError) {
            await router.push({ name: RouteName.Home })
            toast.error('Ошибка авторизации')
        }
    })

    roomStore.wsOn()
    watchEstimatesOn()
})

onUnmounted(() => {
    roomStore.wsOff()
    watchEstimatesOff()
})

const leaveLoading = ref(false)

async function leaveRoom() {
    const isConfirmed = await confirm({ content: 'Вы уверены что хотите покинуть комнату?' })
    if (!isConfirmed) return

    await wrap(leaveLoading, async () => {
        const response = await request.post<null>('/logout')

        if (response instanceof FetchError) {
            toast.error('Неизвестная ошибка')
            return
        } else {
            await ws.disconnect()
            await router.push({ name: RouteName.Home })
            authStore.$reset()
            toast.success('Вы покинули комнату')
        }
    })
}
</script>
