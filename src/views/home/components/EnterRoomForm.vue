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

                <v-row v-if="!hideRoomId">
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
                                        {{ getSelectionText(item) }}
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
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import type { VForm } from 'vuetify/components'
import { UserRole } from '@/definitions/user'

export type EnterRoomFormData = {
    name: string
    roomId: string
    role?: UserRole | ''
    pin?: string
}

const props = defineProps<{
    loading: boolean
    hideRoomId?: boolean
}>()

const { loading } = toRefs(props)

const form = ref<VForm | null>(null)

const roomId = ref('')

const roomIdValidationRules = ref([
    (value: string) => value ? true : 'Введите ID комнаты',
])

const role = ref<UserRole | ''>('')

const roleItems: { title: string, value: string }[] = [
    { title: 'Без роли', value: '' },
    { title: 'DEV', value: UserRole.Dev },
    { title: 'QA', value: UserRole.QA },
]

function getSelectionText({ title, value }: { title: string, value: string }) {
    return value ? title : ''
}

const name = ref('')

const nameValidationRules = ref([
    (value: string) => !!value || 'Введите имя',
])

const emit = defineEmits<{
    login: [EnterRoomFormData]
}>()

async function submit() {
    const { valid } = await form.value!.validate()
    if (!valid) return

    emit('login', {
        roomId: roomId.value,
        role: role.value,
        name: name.value,
    })
}
</script>
