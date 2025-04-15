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
                    Подключиться к комнате
                </p>

                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="name"
                            :rules="nameValidationRules"
                            label="Введите имя"
                            variant="outlined"
                            hide-details
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

                <v-row class="mt-0">
                    <v-col class="py-0">
                        <v-checkbox
                            v-model="rememberMe"
                            density="compact"
                            hide-details
                        >
                            <template #label="{ props }">
                                <label
                                    class="pl-1 text-caption cursor-pointer"
                                    v-bind="props"
                                >
                                    Запомнить на этом устройстве
                                </label>
                            </template>
                        </v-checkbox>
                    </v-col>
                </v-row>

                <v-btn
                    :loading="loading"
                    class="mt-4"
                    text="Подключиться"
                    type="submit"
                    variant="outlined"
                    block
                />
            </v-container>
        </v-form>
    </v-sheet>
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
import type { UID } from '@/definitions/aliases'
import { getStoredAuthUserIfValid, removeAuthUserFromStorage, setAuthUserToStorage } from '@/utils/last-auth-user'

export type JoinRoomFormData = {
    roomId: string
    pin?: string
    name: string
    role?: UserRole | ''
}

const { roomId, pin } = defineProps<{
    roomId: UID
    pin?: string
}>()

const router = useRouter()

const form = ref<VForm | null>(null)

const lastAuthUser = getStoredAuthUserIfValid()

const role = ref<UserRole | ''>(lastAuthUser?.role || '')

const roleItems = ['', ...Object.values(UserRole)].map((role) => ({
    value: role,
    title: getRoleTitle(role),
}))

function getRoleSelectionText({ title, value }: { title: string, value: string }) {
    return value ? title : ''
}

const name = ref(lastAuthUser?.name || '')

const nameValidationRules = ref([
    (value: string) => !!value.trim(),
])

const rememberMe = ref(!!lastAuthUser)

async function submit() {
    const { valid } = await form.value!.validate()
    if (!valid) return

    await login(getJoinRoomFormData())
}

function getJoinRoomFormData(): JoinRoomFormData {
    return {
        roomId,
        pin,
        role: role.value,
        name: name.value,
    }
}

const loading = ref(false)

async function login(data: JoinRoomFormData) {
    await wrap(loading, async () => {
        let response = await request.post<null>('/login', data)

        if (response instanceof FetchError) {
            toast.error('Неизвестная ошибка')
            return
        }

        onLoginSuccess(data)

        await router.push({ name: RouteName.Room, params: { roomId: data.roomId } })
    })
}

function onLoginSuccess(data: JoinRoomFormData) {
    if (rememberMe.value) {
        setAuthUserToStorage({
            name: data.name,
            role: data.role || undefined,
        })
    } else {
        removeAuthUserFromStorage()
    }
}
</script>
