import type { UID } from '@/definitions/aliases'
import type { User } from '@/definitions/user'
import type { EstimateVariant } from '@/definitions/estimates'

export interface Room {
    id: UID
    users: User[]
    estimatesVisible?: boolean
    config?: RoomConfig
}

export interface RoomWithoutConfig extends Omit<Room, 'config'> {}

export interface RoomConfig {
    estimateVariants?: EstimateVariant[]
    withConfirmEstimates?: boolean
}
