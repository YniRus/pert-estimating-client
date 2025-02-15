import type { UID } from '@/definitions/aliases'
import type { AuthUser } from '@/definitions/user'

export interface AuthData {
    roomId: UID
    user: AuthUser
}
