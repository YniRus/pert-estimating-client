import type { UID } from '@/definitions/aliases'
import type { User } from '@/definitions/user'

export interface AuthData {
    roomId: UID
    user: User
}
