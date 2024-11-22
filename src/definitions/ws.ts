import type { UID } from '@/definitions/aliases'
import type { Room } from '@/definitions/room'
import type { User } from '@/definitions/user'
import { WSError } from '@/utils/ws-error'

export type WSCallback<T> = (response: T | WSError) => void

export interface ClientToServerEvents {
    'room:query': (room: UID, callback: WSCallback<Room>) => void
    'room:post': (room: UID, callback: WSCallback<User[]>) => void
}

export interface ServerToClientEvents {

}
