export interface ErrorResponse {
    error: ErrorData
}

interface ErrorData {
    message: string
    type: string
    code: number
}

export class WSError extends Error {
    code: number

    constructor(error: ErrorData) {
        super(error.message)
        this.name = error.type
        this.code = error.code
    }
}

export class WSConnectionError extends WSError {
    constructor(error: Error | string, code = 4000) {
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
