<template>
    <v-dialog
        v-model="dialog"
        width="400"
    >
        <v-card>
            <v-card-title class="my-2 d-flex flex-row align-center justify-space-between">
                Новая комната

                <v-btn
                    icon="mdi-close"
                    variant="plain"
                    density="comfortable"
                    @click="dialog = false"
                />
            </v-card-title>

            <v-divider></v-divider>

            <v-form @submit.prevent="create">
                <v-container class="pb-1">
                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model="pin"
                                variant="outlined"
                                label="PIN"
                                hint="Вы можете ограничить доступ к комнате, задав пин-код"
                                persistent-hint
                            />
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>

            <v-divider class="mt-2"></v-divider>

            <v-card-actions>
                <v-btn
                    color="success"
                    variant="outlined"
                    :loading="loading"
                    @click="create"
                >
                    Создать комнату
                    <v-icon icon="mdi-chevron-right" end></v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FetchError, request } from '@/plugins/ofetch'
import { toast } from 'vue3-toastify'

interface CreateRoomResponse {
    roomId: string
}

const dialog = defineModel<boolean>()

const emit = defineEmits<{
    created: [string]
}>()

const pin = ref("")

const loading = ref(false)

async function create() {
    const response = await request.post<CreateRoomResponse>("/room", {
        pin: pin.value.trim(),
    }, { loading })

    if (response instanceof FetchError) {
        toast.error('Неизвестная ошибка')
        return
    }

    emit('created', response.roomId)
}
</script>