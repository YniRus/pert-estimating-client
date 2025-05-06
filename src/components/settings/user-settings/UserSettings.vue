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

        <v-card width="352" class="pa-4">
            <EstimatesOrderUserSettings v-if="canEstimate" />

            <v-spacer v-if="canEstimate" class="mb-4" />

            <BubbleNotificationsUserSettings />

            <v-spacer class="mb-4" />

            <UseEstimatesNotificationByTimerSettings />
        </v-card>
    </v-menu>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import EstimatesOrderUserSettings from '@/components/settings/user-settings/EstimatesOrderUserSettings.vue'
import { useAuthStore } from '@/store/auth'
import BubbleNotificationsUserSettings from '@/components/settings/user-settings/BubbleNotificationsUserSettings.vue'
import UseEstimatesNotificationByTimerSettings
    from '@/components/settings/user-settings/UseEstimatesNotificationByTimerSettings.vue'

const authStore = useAuthStore()

const menu = ref(false)

const canEstimate = computed(() => {
    if (!authStore.data?.user) return false
    return authStore.isCanEstimateUser(authStore.data.user)
})
</script>
