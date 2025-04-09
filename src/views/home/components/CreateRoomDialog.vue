<template>
    <v-dialog
        v-model="dialog"
        width="var(--dialog-max-width)"
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

                    <v-row>
                        <v-col>
                            <p class="text-subtitle-1 mb-2">
                                Шкала оценки
                            </p>

                            <EstimateVariantsSelector
                                :variants="estimateVariants"
                                @change="estimateVariants = $event"
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

    <CreatedRoomDialog
        v-model="createdRoomDialog"
        :access-url="roomAccessUrl"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FetchError, request } from '@/plugins/ofetch'
import { toast } from 'vue3-toastify'
import { wrap } from '@/utils/loading'
import CreatedRoomDialog from '@/views/home/components/CreatedRoomDialog.vue'
import EstimateVariantsSelector from '@/components/settings/room-config/EstimateVariantsSelector.vue'
import type { EstimateVariant } from '@/definitions/estimates'

const dialog = defineModel<boolean>()

const pin = ref('')

const estimateVariants = ref<EstimateVariant[]>()

const loading = ref(false)

function create() {
    wrap(loading, async () => {
        const response = await request.post<{ accessUrl: string }>('/room', {
            pin: pin.value.trim(),
            config: {
                estimateVariants: estimateVariants.value,
            },
        })

        if (response instanceof FetchError) {
            toast.error('Неизвестная ошибка')
            return
        }

        onRoomCreated(response.accessUrl)
    })
}

const roomAccessUrl = ref('')
const createdRoomDialog = ref(false)

function onRoomCreated(accessUrl: string) {
    roomAccessUrl.value = accessUrl
    dialog.value = false
    createdRoomDialog.value = true
}
</script>
