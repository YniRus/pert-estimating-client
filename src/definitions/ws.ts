import type { UID } from '@/definitions/aliases'
import type { Room } from '@/definitions/room'
import { WSError } from '@/utils/ws-error'
import type { User } from '@/definitions/user'
import type { EventsMap } from '@socket.io/component-emitter'
import type { AuthData } from '@/definitions/auth'
import { type Estimate, type Estimates, type EstimateType } from '@/definitions/estimates'

export type WSCallback<T> = (response: T | WSError) => void

export interface ClientToServerEvents extends EventsMap {
    'query:room': (room: UID, callback: WSCallback<Room>) => void
    'query:auth': (callback: WSCallback<AuthData>) => void
    'mutation:estimate': (type: EstimateType, estimate: Estimate, callback: WSCallback<true>) => void
    'mutation:room-estimates-visible': (estimatesVisible: boolean, callback: WSCallback<Room>) => void
    'mutation:room-delete-estimates': (callback: WSCallback<Room>) => void
}

export interface ServerToClientEvents extends EventsMap {
    'on:user-connected': (user: User) => void
    'on:user-disconnected': (userId: UID) => void
    'on:estimates': (userId: UID, estimates: Estimates) => void
    'on:room': (room: Room) => void
}
