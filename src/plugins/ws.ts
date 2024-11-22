import { io, type Socket } from 'socket.io-client'
import { type ClientToServerEvents, type ServerToClientEvents } from '@/definitions/ws'
import type { AllButLast, Promised } from '@/definitions/utility'
import type { EventParams, EventNames } from '@socket.io/component-emitter'
import { isErrorResponse, WSConnectionError, WSError } from '@/utils/ws-error'

class WS {
    #options: Parameters<typeof io>[1] = {
        path: '/io',
        withCredentials: true,
        extraHeaders: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        reconnection: true,
        reconnectionAttempts: 5,
        autoConnect: false,
    }

    #client?: Socket<ServerToClientEvents, ClientToServerEvents>

    init() {
        this.#client = io(import.meta.env.VITE_SERVER_HOST, this.#options)
    }

    get #connected() {
        return !!this.#client?.connected
    }

    #connecting = false

    connect(): Promised<true | WSConnectionError> {
        if (this.#connected) return true

        return new Promise((resolve) => {
            if (!this.#client) {
                const error = new WSConnectionError('Unable to connect: must be initialized first')
                console.error(error)
                return resolve(error)
            }

            if (this.#connecting) {
                this.#client.once('connect', () => resolve(true))
                this.#client.once('connect_error', (error) => resolve(new WSConnectionError(error)))
            } else {
                this.#connecting = true

                this.#client.once('connect', () => {
                    this.#connecting = false
                    console.log('Socket connected')
                    resolve(true)
                })

                this.#client.once('connect_error', (error: Error) => {
                    this.#connecting = false
                    console.error(error)
                    resolve(new WSConnectionError(error))
                })

                this.#client.connect()
            }
        })
    }

    #disconnecting = false

    disconnect() {
        if (!this.#client || !this.#connected) return

        if (!this.#disconnecting && this.#client.connected) {
            this.#client.once('disconnect', () => {
                this.#disconnecting = false
            })

            this.#client.disconnect()
        }
    }

    async emitWithAck<Event extends EventNames<ClientToServerEvents>>(
        event: Event,
        ...args: AllButLast<EventParams<ClientToServerEvents, Event>>
    ) {
        if (!this.#client || !this.#connected) {
            const connection = await this.connect()
            if (connection instanceof WSConnectionError) return connection
        }

        const response = await this.#client!.emitWithAck(event, ...args)
        if (isErrorResponse(response)) return new WSError(response.error)
        return response
    }
}

const ws = new WS()
export default ws
