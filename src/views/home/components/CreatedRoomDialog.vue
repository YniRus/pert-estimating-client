<template>
    <v-dialog
        v-model="dialog"
        persistent
        width="var(--dialog-max-width)"
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
                    Обратите внимание! По этой ссылке пользователи смогут подключиться в вашу комнату без необходимости вводить ID комнаты и PIN-код.
                </p>

                <v-btn
                    class="mt-5"
                    variant="outlined"
                    block
                    append-icon="mdi-chevron-right"
                    text="Подключиться к комнате"
                    @click="toJoinRoom"
                />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { toast } from 'vue3-toastify'
import { useRouter, parseQuery } from 'vue-router'
import RouteName from '@/router/route-name'

const props = defineProps<{
    accessUrl: string
}>()

const dialog = defineModel<boolean>()

const router = useRouter()

function copyAccessUrlToClipboard() {
    navigator.clipboard.writeText(props.accessUrl)
        .then(() => toast('Скопировано в буфер обмена'))
}

function toJoinRoom() {
    const url = new URL(props.accessUrl)
    const resolvedRoute = router.resolve({
        path: url.pathname,
        query: parseQuery(url.search),
    })

    if (resolvedRoute.name !== RouteName.JoinRoom) {
        toast.error('Некорректная ссылка')
        return
    }

    router.push(resolvedRoute)
}
</script>
