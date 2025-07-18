import type { UID } from '@/definitions/aliases'
import type { Estimates } from '@/definitions/estimates'

export enum UserRole {
    Dev = 'dev',
    Frontend = 'frontend',
    Backend = 'backend',
    QA = 'qa',
    SA = 'sa',
    RoomAdmin = 'room-admin',
}

export interface User {
    id: UID
    role?: UserRole
    name: string
    estimates?: Estimates
}

export interface AuthUser extends Omit<User, 'estimates'> {}
