import { io, type Socket } from 'socket.io-client'
import { type ClientToServerEvents, type ServerToClientEvents } from '@/definitions/ws'
import type { AllButLast, Promised } from '@/definitions/utility'
import type { EventNames, EventParams } from '@socket.io/component-emitter'
import { isErrorResponse, WSConnectionError, WSError, WSErrorCode } from '@/utils/ws-error'

class WS {
    #options: Parameters<typeof io>[1] = {
        path: '/io',
        withCredentials: true,
        extraHeaders: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        timeout: 10000,
        ackTimeout: 2000,
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
                const error = new WSConnectionError(
                    'Unable to connect: must be initialized first',
                    WSErrorCode.ClientNotInitialized,
                )
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

    disconnect(): Promise<true> {
        return new Promise((resolve) => {
            if (!this.#client || !this.#connected) return resolve(true)

            if (this.#disconnecting) {
                this.#client.once('disconnect', () => resolve(true))
            } else if (!this.#disconnecting) {
                this.#client.once('disconnect', () => {
                    this.#disconnecting = false
                    return resolve(true)
                })

                this.#client.disconnect()
            }
        })
    }

    on<Event extends EventNames<ServerToClientEvents>>(
        event: Event,
        listener: ServerToClientEvents[Event],
    ) {
        if (!this.#client) {
            const error = new WSConnectionError(
                'Unable to connect: must be initialized first',
                WSErrorCode.ClientNotInitialized,
            )
            console.error(error)
            return
        }

        this.#client.on(event, listener)
    }

    async emitWithAck<Event extends EventNames<ClientToServerEvents>>(
        event: Event,
        ...args: AllButLast<EventParams<ClientToServerEvents, Event>>
    ) {
        if (!this.#client || !this.#connected) {
            const connection = await this.connect()
            if (connection instanceof WSConnectionError) return connection
        }

        try {
            const response = await this.#client!.emitWithAck(event, ...args)
            if (isErrorResponse(response)) return new WSError(response.error)
            return response
        } catch (error: unknown) {
            if (error instanceof Error) {
                // Ожидаемая ошибка - timeout ack
                return new WSError({
                    message: error.message,
                    code: WSErrorCode.EmitWithAckTimeout,
                })
            } else {
                return new WSError({ message: error?.toString() || 'Unexpected error' })
            }
        }
    }
}

const ws = new WS()
export default ws
