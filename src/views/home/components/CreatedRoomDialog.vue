<template>
    <v-dialog
        v-model="dialog"
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

            <v-card-text>
                {{ roomId }}
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const dialog = defineModel<boolean>()

const props = defineProps<{
    roomId: string
}>()

const { roomId } = toRefs(props)
</script>