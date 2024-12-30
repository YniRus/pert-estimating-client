import type { UID } from '@/definitions/aliases'
import type { User } from '@/definitions/user'
import type { Estimates } from '@/definitions/estimates'

export interface Room {
    id: UID
    users: User[]
    estimates?: Record<User['id'], Estimates>
    estimatesVisible?: boolean
}
