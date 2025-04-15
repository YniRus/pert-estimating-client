import { type AuthUser, UserRole } from '@/definitions/user'

const authUserStorageKey = 'PERT-estimating_last-auth-user'

export interface StoredAuthUser extends Pick<AuthUser, 'name' | 'role'> {}

export function getStoredAuthUserIfValid() {
    const storageValue = localStorage.getItem(authUserStorageKey)
    if (!storageValue) return null

    try {
        const authUser = JSON.parse(storageValue)
        if (!isValidAuthUser(authUser)) return null

        return authUser
    } catch {
        return null
    }
}

function isValidAuthUser(maybeAuthUser: unknown): maybeAuthUser is StoredAuthUser {
    if (typeof maybeAuthUser !== 'object' || maybeAuthUser === null) return false
    if (!('name' in maybeAuthUser) || typeof maybeAuthUser.name !== 'string') return false
    if ('role' in maybeAuthUser) {
        if (typeof maybeAuthUser.role !== 'string') return false
        if (![...Object.values(UserRole), ''].includes(maybeAuthUser.role)) return false
    }

    return true
}

export function setAuthUserToStorage(authUser: StoredAuthUser) {
    const storeValue = JSON.stringify(authUser)
    localStorage.setItem(authUserStorageKey, storeValue)
}

export function removeAuthUserFromStorage() {
    localStorage.removeItem(authUserStorageKey)
}
