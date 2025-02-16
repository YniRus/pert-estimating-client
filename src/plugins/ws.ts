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
        transports: ['websocket'],
    }

    #client?: Socket<ServerToClientEvents, ClientToServerEvents>

    init() {
        this.#client = io(import.meta.env.VITE_SERVER_HOST, this.#options)
    }

    get #connected() {
        return !!this.#client?.connected
    }

    #connecting = false

    connect(silent?: boolean): Promised<true | WSConnectionError> {
        if (this.#connected) return true

        return new Promise((resolve) => {
            if (!this.#client) {
                const error = new WSConnectionError(
                    'Unable to connect: must be initialized first',
                    WSErrorCode.ClientNotInitialized,
                )
                !silent && console.error(error)
                return resolve(error)
            }

            if (this.#connecting) {
                const onConnect = () => {
                    this.#client?.off('connect_error', onConnectError)
                    resolve(true)
                }

                const onConnectError = (error: Error) => {
                    this.#client?.off('connect', onConnect)
                    resolve(new WSConnectionError(error))
                }

                this.#client.once('connect', onConnect)
                this.#client.once('connect_error', onConnectError)
            } else {
                this.#connecting = true

                const onConnect = () => {
                    this.#client?.off('connect_error', onConnectError)
                    this.#connecting = false
                    !silent && console.log('Socket connected')
                    resolve(true)
                }

                const onConnectError = (error: Error) => {
                    this.#client?.off('connect', onConnect)
                    this.#connecting = false
                    !silent && console.error(error)
                    resolve(new WSConnectionError(error))
                }

                this.#client.once('connect', onConnect)
                this.#client.once('connect_error', onConnectError)

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

    off<Event extends EventNames<ServerToClientEvents>>(
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

        this.#client.off(event, listener)
    }

    emit<Event extends EventNames<ClientToServerEvents>>(
        event: Event,
        ...args: EventParams<ClientToServerEvents, Event>
    ) {
        if (!this.#client) {
            const error = new WSConnectionError(
                'Unable to connect: must be initialized first',
                WSErrorCode.ClientNotInitialized,
            )
            console.error(error)
            return
        }

        this.#client.emit(event, ...args)
    }

    async emitWithAck<Event extends EventNames<ClientToServerEvents>>(
        event: Event,
        ...args: AllButLast<EventParams<ClientToServerEvents, Event>>
    ) {
        if (!this.#client || !this.#connected) {
            const connection = await this.connect(true)
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
