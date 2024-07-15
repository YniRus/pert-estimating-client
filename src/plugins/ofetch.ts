import {
    type FetchContext,
    type FetchError,
    type FetchOptions,
    type FetchResponse,
    type ResponseType,
    ofetch,
} from 'ofetch'
import type { Ref } from 'vue'

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
    baseURL: import.meta.env.VITE_SERVER_HOST
});

export interface RequestOptions<R extends ResponseType = "json"> extends FetchOptions<R> {
    loading?: Ref<boolean>
}

function handleOptions<R extends ResponseType = "json">(options: RequestOptions<R> = {}) {
    const onRequestHandlers = [
        options.onRequest
    ]
    const onResponseHandlers = [
        options.onResponse
    ]

    if (options?.loading) {
        onRequestHandlers.push(() => { options.loading!.value = true })
        onResponseHandlers.push(() => { options.loading!.value = false })
    }

    options = {
        ...options,
        onRequest(context: FetchContext) {
            onRequestHandlers.forEach(handler => handler?.(context))
        },
        onResponse(context: FetchContext & { response: FetchResponse<R> }) {
            onResponseHandlers.forEach(handler => handler?.(context))
        }
    }

    return options
}

async function _get<T = any, R extends ResponseType = "json">(path: string, query?: RequestOptions['query'], options?: RequestOptions<R>) {
    return await baseFetch<T, R>(path, {
        method: HttpRequestMethod.GET,
        query,
        ...handleOptions(options),
    }).catch((error: FetchError<T>) => error)
}

async function _post<T = any, R extends ResponseType = "json">(path: string, data?: RequestOptions['body'], options?: RequestOptions<R>) {
    return await baseFetch<T, R>(path, {
        method: HttpRequestMethod.POST,
        body: data,
        ...handleOptions(options),
    }).catch((error: FetchError<T>) => error)
}

async function _delete<T = any, R extends ResponseType = "json">(path: string, query?: RequestOptions['query'], options?: RequestOptions<R>) {
    return await baseFetch<T, R>(path, {
        method: HttpRequestMethod.DELETE,
        query,
        ...handleOptions(options),
    }).catch((error: FetchError<T>) => error)
}

export const request =  {
    get: _get,
    post: _post,
    delete: _delete,
}

export { FetchError } from "ofetch"