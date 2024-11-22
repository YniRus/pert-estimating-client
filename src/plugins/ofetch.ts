import {
    type FetchError,
    type FetchOptions,
    type ResponseType,
    ofetch,
} from 'ofetch'

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

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
async function _get<T = any, R extends ResponseType = 'json'>(path: string, query?: FetchOptions['query'], options?: FetchOptions<R>) {
    return await baseFetch<T, R>(path, {
        method: HttpRequestMethod.GET,
        query,
        ...options,
    }).catch((error: FetchError<T>) => error)
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
async function _post<T = any, R extends ResponseType = 'json'>(path: string, data?: FetchOptions['body'], options?: FetchOptions<R>) {
    return await baseFetch<T, R>(path, {
        method: HttpRequestMethod.POST,
        body: data,
        ...options,
    }).catch((error: FetchError<T>) => error)
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
async function _delete<T = any, R extends ResponseType = 'json'>(path: string, query?: FetchOptions['query'], options?: FetchOptions<R>) {
    return await baseFetch<T, R>(path, {
        method: HttpRequestMethod.DELETE,
        query,
        ...options,
    }).catch((error: FetchError<T>) => error)
}

export const request = {
    get: _get,
    post: _post,
    delete: _delete,
}

export { FetchError } from 'ofetch'
