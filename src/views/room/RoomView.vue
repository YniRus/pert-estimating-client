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

        <div class="room-view d-flex align-center flex-column">
            <EstimateVariantCards />

            <h1>This is an room page</h1>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import type { UID } from '@/definitions/aliases'
import type { Room } from '@/definitions/room'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import RouteName from '@/router/route-name'
import { useRouter } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import EstimateVariantCards from '@/views/room/components/EstimateVariantCards.vue'
import ws from '@/plugins/ws'
import { WSError } from '@/utils/ws-error'
import { wrap } from '@/utils/loading'
import { FetchError, request } from '@/plugins/ofetch'

const router = useRouter()

const props = defineProps<{
    roomId: UID
}>()

const room = ref<Room>()

const loading = ref(false)

onMounted(() => {
    wrap(loading, async () => {
        const response = await ws.emitWithAck('query:room', props.roomId)

        if (response instanceof WSError) {
            await router.push({ name: RouteName.Home })

            switch (response.code) {
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

        room.value = response
    })
})

const leaveLoading = ref(false)

function leaveRoom() {
    wrap(leaveLoading, async () => {
        const response = await request.post<null>('/logout')

        if (response instanceof FetchError) {
            toast.error('Неизвестная ошибка')
            return
        } else {
            await ws.disconnect()
            await router.push({ name: RouteName.Home })
            toast.success('Вы покинули комнату')
        }
    })
}
</script>
