<template>
    <BaseLayout :loading>
        <div class="room-view">
            <h1>This is an room page</h1>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import type { UID } from '@/definitions/aliases'
import type { Room } from '@/definitions/room'
import { onMounted, ref } from 'vue'
import { FetchError, request } from '@/plugins/ofetch'
import { toast } from 'vue3-toastify'
import RouteName from '@/router/route-name'
import { useRouter } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'

const router = useRouter()

const props = defineProps<{
    roomId: UID
}>()

const loading = ref(false)

const room = ref<Room>()

onMounted(async () => {
    let response = await request.get<Room>(`/room/${props.roomId}`, undefined, { loading })

    if (response instanceof FetchError) {
        await router.push({ name: RouteName.Home })

        switch (response.statusCode) {
            case 400:
            case 404: {
                toast.error('Комната не найдена')
                return
            }
            case 403: {
                toast.error('Ошибка авторизации')
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

</script>
