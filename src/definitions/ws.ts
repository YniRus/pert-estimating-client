import type { UID } from '@/definitions/aliases'
import type { Room } from '@/definitions/room'
import { WSError } from '@/utils/ws-error'
import type { User } from '@/definitions/user'
import type { EventsMap } from '@socket.io/component-emitter'
import type { MyAuth } from '@/definitions/auth'

export type WSCallback<T> = (response: T | WSError) => void

export interface ClientToServerEvents extends EventsMap {
    'query:room': (room: UID, callback: WSCallback<Room>) => void
    'query:my-auth': (callback: WSCallback<MyAuth>) => void
}

export interface ServerToClientEvents extends EventsMap {
    'on:user-connected': (user: User) => void
    'on:user-disconnected': (userId: UID) => void
}
