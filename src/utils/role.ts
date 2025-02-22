import { UserRole } from '@/definitions/user'

export function getRoleTitle(role?: string) {
    switch (role) {
        case UserRole.QA: return 'QA'
        case UserRole.Dev: return 'DEV'
        default: return 'Без роли'
    }
}
