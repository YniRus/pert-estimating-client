<template>
    <v-menu
        v-model="menu"
        :close-on-content-click="false"
        location="bottom start"
        offset="20"
    >
        <template #activator="{ props }">
            <v-btn
                icon="mdi-cog"
                size="small"
                v-bind="props"
            />
        </template>

        <v-card min-width="352" class="pa-4">
            <EstimatesOrderUserSettings />
        </v-card>
    </v-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EstimatesOrderUserSettings from '@/components/settings/user-settings/EstimatesOrderUserSettings.vue'

const menu = ref(false)
</script>
