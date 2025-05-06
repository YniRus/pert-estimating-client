<template>
    <v-layout
        data-layout="base"
        class="overflow-visible"
        full-height
    >
        <v-app-bar
            elevation="2"
            color="grey-lighten-4"
            density="comfortable"
            class="px-5"
        >
            <div class="d-flex align-center ga-4">
                <v-app-bar-title class="d-none d-sm-block ml-0">
                    {{ title }}
                </v-app-bar-title>

                <div
                    v-if="logoSrc"
                    class="d-none d-sm-flex align-center ga-4"
                >
                    <v-icon size="x-small" icon="mdi-close" />

                    <img :src="logoSrc" height="24">
                </div>

                <v-btn
                    v-tooltip="{ text: 'Скоро...' }"
                    text="Документация"
                    append-icon="mdi-open-in-new"
                    variant="plain"
                    role="link"
                    size="small"
                    :ripple="false"
                />
            </div>

            <template
                v-if="!loading"
                #append
            >
                <slot name="header-actions" />
            </template>
        </v-app-bar>

        <v-main class="d-flex">
            <v-progress-circular
                v-if="loading"
                class="ma-auto"
                indeterminate
                :size="64"
            />

            <keep-alive>
                <slot v-if="!loading" />
            </keep-alive>
        </v-main>
    </v-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps<{
    loading?: boolean
}>()

const title = import.meta.env.VITE_APP_TITLE
const host = import.meta.env.VITE_SERVER_HOST || '/api' // TODO: СДелать app запрос с получением пути до логотипа

const logoSrc = ref('')

onMounted(async () => {
    try {
        logoSrc.value = await loadImage(`${host}/assets/logo`)
    } catch {
        logoSrc.value = ''
    }
})

function loadImage(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(src)
        img.onerror = () => reject()
        img.src = src
    })
}
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use 'vuetify/settings' as v-settings;
@use '@/styles/mixins';

.v-main {
    > :deep(.v-container) {
        @include mixins.flex(column, center);

        width: 100%;
        max-width: var(--content-max-width);
        padding: map.get(v-settings.$spacers, 5);
    }
}
</style>

<style lang="scss">
@use '@/styles/toastify';

$header-height: 56px;

body:has(.v-layout[data-layout='base']) {
    @include toastify.offset-top($header-height);
}
</style>
