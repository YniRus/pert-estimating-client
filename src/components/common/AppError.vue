<template>
    <v-layout
        height="100vh"
        max-width="var(--content-max-width)"
        class="d-flex flex-column align-center justify-center ma-auto"
    >
        <v-icon
            size="64"
            color="red"
            class="mb-3"
            icon="mdi-alert-circle-outline"
        />

        <p class="text-h5 text-uppercase text-center">
            {{ title }}
        </p>

        <v-divider class="w-25 my-5" />

        <div class="text-body-1 text-center">
            {{ description }}
        </div>

        <div class="text-overline text-center mt-3">
            {{ errorCode }}
        </div>
    </v-layout>
</template>

<script setup lang="ts">
import { AppErrorCode, useAppStore } from '@/store/app'
import { computed } from 'vue'

const appStore = useAppStore()

const title = computed(() => {
    switch (appStore.error) {
        case AppErrorCode.AnotherAuth: return 'Вы активны в другом окне'
        case AppErrorCode.AuthTokenChanged: return 'Токен авторизации изменён'
        case AppErrorCode.AuthTokenRemoved: return 'Токен авторизации удалён'
        default: return 'Критическая ошибка'
    }
})

const description = computed(() => {
    switch (appStore.error) {
        case AppErrorCode.AnotherAuth: return 'Вы авторизовались в другом окне. Для активации текущего окна - перезагрузите страницу.'
        case AppErrorCode.AuthTokenChanged: return 'Текущий токен авторизации был изменён, т.к. вы авторизовались в другой комнате или под другим пользователем в другом окне. Для активации текущего окна - перезагрузите страницу.'
        case AppErrorCode.AuthTokenRemoved: return 'Текущий токен авторизации был удалён. Пожалуйста, закройте эту страницу.'
        default: return 'Произошла критическая ошибка, непредвиденная системой. Пожалуйста, попробуйте позже.'
    }
})

const errorCode = computed(() => {
    return `Код ошибки: ${appStore.error || 0}`
})
</script>
