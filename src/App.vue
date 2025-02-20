<template>
    <v-app>
        <v-main>
            <router-view />
        </v-main>

        <DialogsWrapper />
    </v-app>
</template>

<script setup lang="ts">
import { DialogsWrapper } from 'vuejs-confirm-dialog'
</script>
