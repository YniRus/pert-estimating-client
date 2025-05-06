import type { UserEstimatesNotificationSettings } from '@/definitions/user-estimates-notificaton-settings'

const userEstimatesNotificationSettingsKey = 'PERT-estimating_user-estimates-notification-settings'

export function getStoredUserEstimatesNotificationSettingsIfValid() {
    const storageValue = localStorage.getItem(userEstimatesNotificationSettingsKey)
    if (!storageValue) return null

    try {
        const settings = JSON.parse(storageValue)
        if (!isValidUserEstimatesNotificationSettings(settings)) return null

        return settings
    } catch {
        return null
    }
}

function isValidUserEstimatesNotificationSettings(
    maybeSettings: unknown,
): maybeSettings is UserEstimatesNotificationSettings {
    if (!maybeSettings || typeof maybeSettings !== 'object') return false
    if (!('enabled' in maybeSettings)) return false
    if (typeof (maybeSettings as UserEstimatesNotificationSettings).enabled !== 'boolean') return false

    return true
}

export function setUserEstimatesNotificationSettingsToStorage(
    settings: UserEstimatesNotificationSettings,
) {
    const storeValue = JSON.stringify(settings)
    localStorage.setItem(userEstimatesNotificationSettingsKey, storeValue)
}
