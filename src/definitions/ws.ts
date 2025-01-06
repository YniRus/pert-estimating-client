import type { UID } from '@/definitions/aliases'
import type { Room } from '@/definitions/room'
import { WSError } from '@/utils/ws-error'
import type { User } from '@/definitions/user'
import type { EventsMap } from '@socket.io/component-emitter'
import type { AuthData } from '@/definitions/auth'
import type { Estimate } from '@/definitions/estimates'

export type WSCallback<T> = (response: T | WSError) => void

export interface ClientToServerEvents extends EventsMap {
    'query:room': (room: UID, callback: WSCallback<Room>) => void
    'query:auth': (callback: WSCallback<AuthData>) => void
    'mutation:user-estimate': (estimate: Estimate) => void
}

export interface ServerToClientEvents extends EventsMap {
    'on:user-connected': (user: User) => void
    'on:user-disconnected': (userId: UID) => void
}
