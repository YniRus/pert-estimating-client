import type { PartialPick } from '@/definitions/utility'

export interface ErrorResponse {
    error: ErrorData
}

interface ErrorData {
    message: string
    type: string
    code: number
}

export enum WSErrorCode {
    Unknown = 4000,
    ClientNotInitialized = 4001,
    EmitWithAckTimeout = 4013,
}

export class WSError extends Error {
    code: number

    constructor(error: PartialPick<ErrorData, 'type' | 'code'>) {
        super(error.message)
        this.name = error.type ?? 'WSError'
        this.code = error.code ?? WSErrorCode.Unknown
    }
}

export class WSConnectionError extends WSError {
    constructor(error: Error | string, code = WSErrorCode.Unknown) {
        if (isErrorWithData(error)) {
            super(error.data)
        } else {
            super({
                message: error instanceof Error ? error.message : error,
                type: 'WSConnectionError',
                code,
            })
        }
    }
}

export function isErrorWithData(error: unknown): error is Error & { data: ErrorData } {
    return error instanceof Error
        && 'data' in error
        && isErrorResponseData(error.data)
}

export function isErrorResponseData(data: unknown): data is ErrorData {
    return !!data
        && typeof data === 'object'
        && 'message' in data
        && 'type' in data
        && 'code' in data
}

export function isErrorResponse(response: unknown): response is ErrorResponse {
    return !!response
        && typeof response === 'object'
        && 'error' in response
        && isErrorResponseData(response.error)
}
