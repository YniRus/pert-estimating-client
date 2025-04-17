<template>
    <v-menu
        v-if="isVisible"
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

        <v-card width="352" class="pa-4">
            <EstimatesOrderUserSettings v-if="canEstimate" />
        </v-card>
    </v-menu>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import EstimatesOrderUserSettings from '@/components/settings/user-settings/EstimatesOrderUserSettings.vue'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

const menu = ref(false)

const canEstimate = computed(() => {
    if (!authStore.data?.user) return false
    return authStore.isCanEstimateUser(authStore.data.user)
})

const isVisible = computed(() => {
    return canEstimate.value
})
</script>
