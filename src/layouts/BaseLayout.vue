<template>
    <v-layout class="fill-height">
        <v-app-bar elevation="2" color="grey-lighten-4">
            <v-app-bar-title>PERT Estimating</v-app-bar-title>

            <template #append>
                <slot name="header-actions"></slot>
            </template>
        </v-app-bar>

        <v-main
            class="fill-height"
            :class="{ 'd-flex align-center justify-center': loading }"
        >
            <v-progress-circular
                v-if="loading"
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
const props = defineProps<{
    loading?: boolean,
}>()
</script>