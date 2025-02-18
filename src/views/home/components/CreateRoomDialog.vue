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

            <v-divider />

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

            <v-divider class="mt-2" />

            <v-card-actions>
                <v-btn
                    color="success"
                    variant="outlined"
                    :loading="loading"
                    append-icon="mdi-chevron-right"
                    text="Создать комнату"
                    @click="create"
                />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FetchError, request } from '@/plugins/ofetch'
import { toast } from 'vue3-toastify'
import { wrap } from '@/utils/loading'

interface CreateRoomResponse {
    accessUrl: string
}

const dialog = defineModel<boolean>()

const emit = defineEmits<{
    created: [string]
}>()

const pin = ref('')

const loading = ref(false)

function create() {
    wrap(loading, async () => {
        const response = await request.post<CreateRoomResponse>('/room', {
            pin: pin.value.trim(),
        })

        if (response instanceof FetchError) {
            toast.error('Неизвестная ошибка')
            return
        }

        emit('created', response.accessUrl)
    })
}
</script>
