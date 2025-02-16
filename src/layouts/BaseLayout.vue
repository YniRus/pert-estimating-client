<template>
    <v-layout full-height>
        <v-app-bar elevation="2" color="grey-lighten-4">
            <v-app-bar-title>PERT Estimating</v-app-bar-title>

            <template #append>
                <slot name="header-actions" />
            </template>
        </v-app-bar>

        <v-main :class="{ 'd-flex align-center justify-center': loading }">
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
defineProps<{
    loading?: boolean
}>()
</script>

<style lang="scss" scoped>
.v-main {
    overflow-y: auto;

    height: calc(100vh - var(--v-layout-top) - var(--v-layout-bottom));
    margin-top: var(--v-layout-top);
    margin-bottom: var(--v-layout-bottom);
    padding-top: unset;
    padding-bottom: unset;
}
</style>
