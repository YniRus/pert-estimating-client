<template>
    <v-dialog
        :model-value="dialog"
        width="400"
        @after-leave="emit('cancel')"
    >
        <v-card>
            <v-card-title class="my-2 d-flex flex-row align-center justify-space-between">
                {{ title }}

                <v-btn
                    icon="mdi-close"
                    variant="plain"
                    density="comfortable"
                    @click="dialog = false"
                />
            </v-card-title>

            <v-divider />

            <v-container>
                <v-card-text class="pa-0">
                    {{ text }}
                </v-card-text>
            </v-container>

            <v-divider />

            <v-card-actions>
                <v-btn
                    variant="outlined"
                    :text="canselText"
                    @click="dialog = false"
                />

                <v-btn
                    variant="outlined"
                    color="primary"
                    :text="submitText"
                    @click="emit('confirm')"
                />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface ConfirmDialogProps {
    title?: string
    text?: string
    submitText?: string
    canselText?: string
}

withDefaults(defineProps<ConfirmDialogProps>(), {
    title: 'Подтвердите действие',
    text: 'Вы уверены?',
    submitText: 'Подтвердить',
    canselText: 'Отмена',
})

const emit = defineEmits<{
    confirm: []
    cancel: []
}>()

const dialog = ref(true)
</script>
