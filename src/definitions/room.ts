import type { UID } from '@/definitions/aliases'
import type { User } from '@/definitions/user'

export interface Room {
    uid: UID
    users: User[]
}
