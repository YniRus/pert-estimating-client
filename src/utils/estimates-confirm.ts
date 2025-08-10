import type { User } from '@/definitions/user'
import { isEmptyEstimates } from '@/utils/estimate/guards'

export function isUserHasUnconfirmedEstimates(user: User) {
    return !user.estimates.confirmed && !isEmptyEstimates(user.estimates.estimates)
}
