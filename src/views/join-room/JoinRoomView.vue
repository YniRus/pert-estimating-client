<template>
    <v-toolbar>
        <v-toolbar-title>PERT Estimating</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn
            class="mr-5"
            text="На главную"
            :ripple="false"
            variant="text"
            @click="toHome"
        />
    </v-toolbar>

    <v-container class="d-flex justify-center mt-5">
        <EnterRoomForm
            :loading
            :hide-room-id="true"
            @login="login"
        />
    </v-container>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import EnterRoomForm, { type EnterRoomFormData } from '@/views/home/components/EnterRoomForm.vue'
import { FetchError, request } from '@/plugins/ofetch'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'
import RouteName from '@/router/route-name'
import type { UID } from '@/definitions/aliases'

const router = useRouter()

const props = defineProps<{
    roomId: UID,
    pin?: string,
}>()

console.log(props)

function toHome() {
    router.push({ name: RouteName.Home })
}

const loading = ref(false)

async function login({ role, name }: EnterRoomFormData) {
    let response = await request.post<{a: string}>("/login", {
        roomId: props.roomId,
        name,
        role: role || "",
        pin: props.pin,
    }, { loading })

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
        // TODO: Переход в комнату
    }
}
</script>