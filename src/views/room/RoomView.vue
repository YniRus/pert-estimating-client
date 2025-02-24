<template>
    <BaseLayout :loading>
        <template #header-actions>
            <v-btn
                v-tooltip="{
                    text: 'Поделиться ссылкой для подключения к комнате',
                    contentClass: 'text-center',
                    maxWidth: 200,
                }"
                class="mr-3"
                size="small"
                icon="mdi-share-variant"
                :loading="shareLoading"
                @click="shareRoomAccessUrl"
            />

            <v-btn
                text="Покинуть комнату"
                variant="outlined"
                prepend-icon="mdi-chevron-left"
                :loading="leaveLoading"
                @click="leaveRoom"
            />
        </template>

        <v-container
            v-if="roomStore.data"
            class="ga-5"
        >
            <EstimateVariantCards />

            <RoomActions />

            <UsersEstimates class="py-0" />
        </v-container>
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
import { useAuthUserEstimates } from '@/store/composables/use-auth-user-estimates'
import RoomActions from '@/views/room/components/RoomActions.vue'
import { useConfirm } from '@/composables/use-confirm'
import { useAuthErrorsWatcher } from '@/store/composables/use-auth-errors-watcher'
import { useServerPing } from '@/store/composables/use-server-ping'

const router = useRouter()
const authStore = useAuthStore()
const roomStore = useRoomStore()

const { watchEstimatesOn, watchEstimatesOff } = useAuthUserEstimates()
const authErrorsWatcher = useAuthErrorsWatcher()
const { isServerPingEnabled, pingOn, pingOff } = useServerPing()
const { confirm } = useConfirm()

const props = defineProps<{
    roomId: UID
}>()

const loading = ref(false)

onMounted(async () => {
    await wrap(loading, async () => {
        const authError = await authStore.auth()

        if (authError) {
            await router.push({ name: RouteName.Home })
            await onError(authError.statusCode)
            return
        }

        const roomError = await roomStore.init(props.roomId)

        if (roomError) {
            await router.push({ name: RouteName.Home })
            await onError(roomError.code)
            return
        }
    })

    roomStore.wsOn()
    watchEstimatesOn()
    authErrorsWatcher.watch()
    isServerPingEnabled && pingOn()
})

onUnmounted(() => {
    roomStore.wsOff()
    watchEstimatesOff()
    authErrorsWatcher.unwatch()
    isServerPingEnabled && pingOff()
})

async function onError(errorCode?: number) {
    switch (errorCode) {
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
            toast.error('Данные не найдены')
            return
        }
        default: {
            toast.error('Неизвестная ошибка')
            return
        }
    }
}

const leaveLoading = ref(false)

async function leaveRoom() {
    if (!await confirm({
        text: 'Вы уверены, что хотите покинуть комнату?',
    })) return

    await wrap(leaveLoading, async () => {
        const response = await request.post<null>('/logout')

        if (response instanceof FetchError) {
            await onError(response.statusCode)
            return
        } else {
            await ws.disconnect()
            await router.push({ name: RouteName.Home })
            authStore.$reset()
            toast.success('Вы покинули комнату')
        }
    })
}

const shareLoading = ref(false)

async function shareRoomAccessUrl() {
    await wrap(shareLoading, async () => {
        const response = await request.get<{ accessUrl: string }>('/room-access-url', {
            roomId: props.roomId,
        })

        if (response instanceof FetchError) {
            await onError(response.statusCode)
            return
        } else {
            navigator.clipboard.writeText(response.accessUrl)
                .then(() => toast('Скопировано в буфер обмена'))
        }
    })
}
</script>
