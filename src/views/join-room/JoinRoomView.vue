<template>
    <BaseLayout>
        <template #header-actions>
            <v-btn
                class="mr-5"
                text="На главную"
                :ripple="false"
                variant="text"
                @click="toHome"
            />
        </template>

        <v-container class="d-flex justify-center mt-5">
            <EnterRoomForm
                :loading
                :hide-room-id="true"
                @login="login"
            />

            <GoToAuthRoom :room-id="roomId" />
        </v-container>
    </BaseLayout>
</template>

<script setup lang="ts">
import { ref, toValue } from 'vue'
import EnterRoomForm, { type EnterRoomFormData } from '@/views/home/components/EnterRoomForm.vue'
import { FetchError, request } from '@/plugins/ofetch'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'
import RouteName from '@/router/route-name'
import type { UID } from '@/definitions/aliases'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { wrap } from '@/utils/loading'
import GoToAuthRoom from '@/views/join-room/components/GoToAuthRoom.vue'

const router = useRouter()

const props = defineProps<{
    roomId: UID
    pin?: string
}>()

const { roomId, pin } = toValue(props)

function toHome() {
    router.push({ name: RouteName.Home })
}

const loading = ref(false)

function login({ role, name }: EnterRoomFormData) {
    wrap(loading, async () => {
        let response = await request.post<{ a: string }>('/login', {
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
                case 403: {
                    toast.error('Комната защищена PIN-кодом')
                    break
                }
                case 400: {
                    toast.error('Неверный PIN-код')
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
