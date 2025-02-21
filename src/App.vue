<template>
    <AppError v-if="appStore.error" />

    <v-app v-else>
        <v-main>
            <router-view />
        </v-main>

        <DialogsWrapper />
    </v-app>
</template>

<script setup lang="ts">
import { DialogsWrapper } from 'vuejs-confirm-dialog'
import { useAppStore } from '@/store/app'
import AppError from '@/components/common/AppError.vue'

const appStore = useAppStore()
</script>
