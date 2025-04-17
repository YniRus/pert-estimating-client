import { computed } from 'vue'
import { useRoomStore } from '@/store/room'
import { useAuthStore } from '@/store/auth'
import { type User, UserRole } from '@/definitions/user'

export const UNASSIGNED_GROUP = 'unassigned'

export type RoomUserGroup = UserRole | typeof UNASSIGNED_GROUP

export function useRoomGroupedUsers() {
    const authStore = useAuthStore()
    const roomStore = useRoomStore()

    const authUserGroup = computed(() => {
        return authStore.data?.user.role || UNASSIGNED_GROUP
    })

    const groupsOrder = computed<RoomUserGroup[]>(() => {
        return Array.from(new Set([authUserGroup.value, ...Object.values(UserRole), UNASSIGNED_GROUP]))
    })

    const roomGroupedUsers = computed(() => {
        const groupedUsers = groupsOrder.value.reduce((groups, group) => {
            return { ...groups, [group]: [] }
        }, {} as Record<RoomUserGroup, User[]>)

        roomStore.data!.users.forEach((user) => {
            authStore.isAuthUser(user)
                ? groupedUsers[getGroupByRole(user.role)].unshift(user)
                : groupedUsers[getGroupByRole(user.role)].push(user)
        })

        return groupedUsers
    })

    const roomGroupedUsersWhoCanEstimates = computed(() => {
        return Object.fromEntries(Object.entries(roomGroupedUsers.value)
            .map(([group, users]) => [
                group,
                users.filter(authStore.isCanEstimateUser),
            ])) as Record<RoomUserGroup, User[]>
    })

    const hasUsersWhoCanEstimates = computed(() => {
        return Object.values(roomGroupedUsersWhoCanEstimates.value).some((users) => users.length)
    })

    function getGroupByRole(role?: UserRole): RoomUserGroup {
        if (!role) return UNASSIGNED_GROUP
        return role
    }

    return {
        roomGroupedUsers,
        roomGroupedUsersWhoCanEstimates,
        hasUsersWhoCanEstimates,
    }
}
