import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserEstimatesNotificationSettings } from '@/definitions/user-estimates-notificaton-settings'
import {
    getStoredUserEstimatesNotificationSettingsIfValid,
    setUserEstimatesNotificationSettingsToStorage,
} from '@/utils/user-estimates-notificaton-settings'

export const useUserEstimatesNotificationStore = defineStore('user-estimates-notification', () => {
    const settings = ref(getInitialSettings())

    function getInitialSettings(): UserEstimatesNotificationSettings {
        return getStoredUserEstimatesNotificationSettingsIfValid() || getDefaultState()
    }

    function getDefaultState(): UserEstimatesNotificationSettings {
        return {
            enabled: true,
            timer: {
                enabled: false,
                timeout: 10,
            },
        }
    }

    const isEnabled = computed(() => settings.value.enabled)

    function setEnabled(value: boolean) {
        settings.value.enabled = value
        setUserEstimatesNotificationSettingsToStorage(settings.value)
    }

    const isTimerEnabled = computed(() => !!settings.value.timer?.enabled)

    function setTimerEnabled(value: boolean) {
        if (!settings.value.timer) {
            settings.value.timer = getDefaultState().timer!
        }
        settings.value.timer.enabled = value
        setUserEstimatesNotificationSettingsToStorage(settings.value)
    }

    const timerTimeout = computed(() => settings.value.timer?.timeout || 10)

    function setTimerTimeout(value: number) {
        if (!settings.value.timer) return // Без включенного таймера не можем менять таймаут
        settings.value.timer.timeout = value
        setUserEstimatesNotificationSettingsToStorage(settings.value)
    }

    function $reset() {
        settings.value = getDefaultState()
    }

    return {
        settings,
        isEnabled,
        setEnabled,
        isTimerEnabled,
        setTimerEnabled,
        timerTimeout,
        setTimerTimeout,
        $reset,
    }
})
