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

                <v-row v-if="!initialData?.roomId">
                    <v-col class="pb-0">
                        <v-text-field
                            v-model="roomId"
                            :rules="roomIdValidationRules"
                            label="Room ID"
                            variant="outlined"
                        />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="name"
                            :rules="nameValidationRules"
                            label="Введите имя"
                            variant="outlined"
                        >
                            <template #prepend>
                                <v-select
                                    v-model="role"
                                    width="100"
                                    :items="roleItems"
                                    variant="outlined"
                                    label="Роль"
                                    hide-details
                                    autocomplete="off"
                                >
                                    <template #selection="{ item }">
                                        {{ getRoleSelectionText(item) }}
                                    </template>
                                </v-select>
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>

                <v-btn
                    :loading="loading"
                    class="mt-2"
                    text="Войти"
                    type="submit"
                    height="40"
                    variant="outlined"
                    block
                />
            </v-container>
        </v-form>
    </v-sheet>

    <EnterRoomPinDialog
        v-model="enterRoomPinDialog"
        @login="onLoginWithPin"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { UserRole } from '@/definitions/user'
import { getRoleTitle } from '@/utils/role'
import { wrap } from '@/utils/loading'
import { FetchError, request } from '@/plugins/ofetch'
import { toast } from 'vue3-toastify'
import RouteName from '@/router/route-name'
import { useRouter } from 'vue-router'
import EnterRoomPinDialog from '@/views/home/components/EnterRoomPinDialog.vue'
import { useCookies } from '@vueuse/integrations/useCookies'

export type EnterRoomFormData = {
    name: string
    roomId: string
    role?: UserRole | ''
    pin?: string
}

const { initialData } = defineProps<{
    initialData?: Partial<EnterRoomFormData>
}>()

const router = useRouter()
const cookies = useCookies()

const form = ref<VForm | null>(null)

const roomId = ref(initialData?.roomId || '')

const roomIdValidationRules = ref([
    (value: string) => value ? true : 'Введите ID комнаты',
])

const role = ref<UserRole | ''>(initialData?.role || '')

const roleItems = ['', ...Object.values(UserRole)].map((role) => ({
    value: role,
    title: getRoleTitle(role),
}))

function getRoleSelectionText({ title, value }: { title: string, value: string }) {
    return value ? title : ''
}

const name = ref(initialData?.name || '')

const nameValidationRules = ref([
    (value: string) => !!value || 'Введите имя',
])

async function submit() {
    const { valid } = await form.value!.validate()
    if (!valid) return

    await login(getEnterRoomFormData())
}

function getEnterRoomFormData(extData?: Partial<EnterRoomFormData>): EnterRoomFormData {
    return {
        ...(initialData || {}),
        roomId: roomId.value,
        role: role.value,
        name: name.value,
        ...(extData || {}),
    }
}

const loading = ref(false)

const enterRoomPinDialog = ref(false)

async function onLoginWithPin(pin: string) {
    await login(getEnterRoomFormData({ pin }))
}

async function login(data: EnterRoomFormData) {
    await wrap(loading, async () => {
        let response = await request.post<null>('/login', data)

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
                    enterRoomPinDialog.value = true
                    toast.error('Неверный pin-код')
                    return
                }
                default: {
                    toast.error('Неизвестная ошибка')
                    return
                }
            }
        }

        const authToken = cookies.get<string>('authToken', { doNotParse: true })
        if (!authToken) {
            toast.error('Токен авторизации не был установлен. Возможно настройки браузера блокируют cookie.', {
                autoClose: 5000,
            })
            return
        }

        await router.push({ name: RouteName.Room, params: { roomId: data.roomId } })
    })
}
</script>
