import { UserRole } from '@/definitions/user'

export function getRoleTitle(role?: string) {
    switch (role) {
        case UserRole.QA: return 'Тестировщик'
        case UserRole.Dev: return 'Разработчик'
        case UserRole.SA: return 'Системный аналитик'
        case UserRole.RoomAdmin: return 'Администратор комнаты'
        default: return 'Без роли'
    }
}

export function getRoleTitleMultiply(role?: string) {
    switch (role) {
        case UserRole.QA: return 'Тестировщики'
        case UserRole.Dev: return 'Разработчики'
        case UserRole.SA: return 'Системные аналитики'
        case UserRole.RoomAdmin: return 'Администраторы комнаты'
        default: return 'Без роли'
    }
}

export function getRoleDescription(role?: string) {
    switch (role) {
        case UserRole.RoomAdmin: return 'Ограничен функционал выставления оценок'
        default: return ''
    }
}

export function getRoleShortTitle(role?: string) {
    switch (role) {
        case UserRole.QA: return 'QA'
        case UserRole.Dev: return 'DEV'
        case UserRole.SA: return 'SA'
        case UserRole.RoomAdmin: return 'ADM'
        default: return ''
    }
}

export function getRoleGroupTitle(role?: string) {
    switch (role) {
        case UserRole.QA: return 'QA'
        case UserRole.Dev: return 'DEV'
        case UserRole.SA: return 'SA'
        case UserRole.RoomAdmin: return ''
        default: return 'Без роли'
    }
}
