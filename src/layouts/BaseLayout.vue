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
            <v-app-bar-title class="d-none d-sm-block ml-0">
                {{ title }}
            </v-app-bar-title>

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
defineProps<{
    loading?: boolean
}>()

const title = import.meta.env.VITE_APP_TITLE
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
