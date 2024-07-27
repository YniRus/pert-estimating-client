<template>
    <v-dialog
        v-model="dialog"
        persistent
        width="400"
    >
        <v-card>
            <v-card-title class="my-2 d-flex flex-row align-center justify-space-between">
                Вы создали комнату!

                <v-btn
                    icon="mdi-close"
                    variant="plain"
                    density="comfortable"
                    @click="dialog = false"
                />
            </v-card-title>

            <v-divider />

            <v-card-text>
                <p class="text-subtitle-1 mb-1">
                    Вы можете поделиться ссылкой ниже:
                </p>

                <v-text-field
                    :model-value="accessUrl"
                    append-icon="mdi-content-copy"
                    variant="outlined"
                    hide-details
                    single-line
                    readonly
                    @click:append="copyAccessUrlToClipboard"
                />

                <p class="text-subtitle-2 mt-2">
                    Обратите внимание! По этой ссылке пользователи смогут подключиться в вашу комнату без необходимости вводить ID комнаты и PIN-код
                </p>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { toast } from 'vue3-toastify'

const dialog = defineModel<boolean>()

const props = defineProps<{
    accessUrl: string
}>()

function copyAccessUrlToClipboard() {
    navigator.clipboard.writeText(props.accessUrl)
        .then(() => toast('Скопировано в буфер обмена'))
}
</script>
