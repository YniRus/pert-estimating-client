import type { UID } from '@/definitions/aliases'

export enum EstimateType {
    Hours = 'h',
    Days = 'd',
    Weeks = 'w',
    Months = 'm',
}

export interface Estimates {
    roomId: UID
    userId: UID
    estimate: {
        min?: number
        probable?: number
        max?: number
    }
    visible: boolean
}
