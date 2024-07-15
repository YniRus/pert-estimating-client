<template>
    <v-dialog
        v-model="dialog"
        width="400"
    >
        <v-form
            ref="form"
            @submit.prevent="login"
        >
            <v-card>
                <v-card-title class="my-2 d-flex flex-row align-center justify-space-between">
                    Комната защищена PIN-кодом

                    <v-btn
                        icon="mdi-close"
                        variant="plain"
                        density="comfortable"
                        @click="dialog = false"
                    />
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="pb-1">
                        <v-text-field
                            v-model="pin"
                            :rules="pinValidationRules"
                            label="PIN"
                            variant="outlined"
                        />
                </v-card-text>

                <v-divider class="mt-2"></v-divider>

                <v-card-actions>
                    <v-btn
                        color="success"
                        variant="outlined"
                        type="submit"
                    >
                        Войти
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'

const dialog = defineModel<boolean>()

const pin = ref("")

const pinValidationRules = ref([
    (value: string) => value ? true : "Введите PIN-код",
])

const emit = defineEmits<{
    login: [string]
}>()

const form = ref<VForm | null>(null)

async function login() {
    const { valid } = await form.value!.validate()
    if (!valid) return

    dialog.value = false
    emit('login', pin.value)
}
</script>