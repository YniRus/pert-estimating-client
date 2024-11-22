import type { UID } from '@/definitions/aliases'
import type { User } from '@/definitions/user'

export interface Room {
    id: UID
    users: User[]
}
