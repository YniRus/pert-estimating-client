import type { UID } from '@/definitions/aliases'
import type { Room } from '@/definitions/room'
import { WSError } from '@/utils/ws-error'

export type WSCallback<T> = (response: T | WSError) => void

export interface ClientToServerEvents {
    'query:room': (room: UID, callback: WSCallback<Room>) => void
}

export interface ServerToClientEvents {

}
