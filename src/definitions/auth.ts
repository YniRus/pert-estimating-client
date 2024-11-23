import type { UID } from '@/definitions/aliases'
import type { User } from '@/definitions/user'

export interface MyAuth {
    roomId: UID
    user: User
}
