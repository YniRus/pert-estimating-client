import {
    type FetchError,
    type IFetchError,
    type FetchOptions,
    type ResponseType,
    ofetch,
} from 'ofetch'

declare module 'ofetch' {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    export interface FetchError<T = any, E = any> extends Omit<IFetchError<T>, 'data'> {
        data: E
    }
}

export enum HttpRequestMethod {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
}

const baseFetch = ofetch.create({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    baseURL: import.meta.env.VITE_SERVER_HOST,
    credentials: 'include',
})

export interface FetchErrorData {
    error: {
        message: string
        type: string
        code?: number
    }
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
async function _get<T = any, E = any, R extends ResponseType = 'json'>(path: string, query?: FetchOptions['query'], options?: FetchOptions<R>) {
    return await baseFetch<T, R>(path, {
        method: HttpRequestMethod.GET,
        query,
        ...options,
    }).catch((error: FetchError<T, E>) => error)
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
async function _post<T = any, E = any, R extends ResponseType = 'json'>(path: string, data?: FetchOptions['body'], options?: FetchOptions<R>) {
    return await baseFetch<T, R>(path, {
        method: HttpRequestMethod.POST,
        body: data,
        ...options,
    }).catch((error: FetchError<T, E>) => error)
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
async function _delete<T = any, E = any, R extends ResponseType = 'json'>(path: string, query?: FetchOptions['query'], options?: FetchOptions<R>) {
    return await baseFetch<T, R>(path, {
        method: HttpRequestMethod.DELETE,
        query,
        ...options,
    }).catch((error: FetchError<T, E>) => error)
}

export const request = {
    get: _get,
    post: _post,
    delete: _delete,
}

export { FetchError } from 'ofetch'
