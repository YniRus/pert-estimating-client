import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Room } from '@/definitions/room'
import type { UID } from '@/definitions/aliases'
import ws from '@/plugins/ws'
import { WSError } from '@/utils/ws-error'
import type { User } from '@/definitions/user'
import type { Estimates } from '@/definitions/estimates'

export const useRoomStore = defineStore('room', () => {
    const data = ref<Room>()

    async function init(roomId: UID) {
        const response = await ws.emitWithAck('query:room', roomId)

        if (response instanceof WSError) return response

        data.value = response
    }

    async function updateEstimatesVisible(estimatesVisible: boolean) {
        const response = await ws.emitWithAck('mutation:room-estimates-visible', estimatesVisible)

        if (response instanceof WSError) return response

        updateRoom(response)
    }

    async function deleteEstimates() {
        const response = await ws.emitWithAck('mutation:room-delete-estimates')

        if (response instanceof WSError) return response

        updateRoom(response)
    }

    function updateRoom(room: Room) {
        if (!data.value) return
        if (room.id !== data.value?.id) return

        data.value = {
            ...data.value,
            users: room.users,
            estimatesVisible: room.estimatesVisible,
        }
    }

    function addUser(user: User) {
        if (!data.value) return

        const existedUserIndex = getUserIndexById(user.id)
        existedUserIndex > -1
            ? data.value.users[existedUserIndex] = user
            : data.value.users.push(user)
    }

    function removeUser(userId: UID) {
        if (!data.value) return

        data.value.users = data.value.users.filter((user) => user.id !== userId)
    }

    function getUserIndexById(userId: UID) {
        if (!data.value) return -1
        return data.value.users.findIndex((user) => user.id === userId)
    }

    function setUserEstimates(userId: UID, estimates: Estimates) {
        if (!data.value) return

        const user = data.value.users.find((user) => user.id === userId)
        if (!user) return

        user.estimates = estimates
    }

    async function wsOn() {
        ws.on('on:user-connected', addUser)
        ws.on('on:user-disconnected', removeUser)
        ws.on('on:estimates', setUserEstimates)
        ws.on('on:room', updateRoom)
    }

    async function wsOff() {
        ws.off('on:user-connected', addUser)
        ws.off('on:user-disconnected', removeUser)
        ws.off('on:estimates', setUserEstimates)
        ws.off('on:room', updateRoom)
    }

    function $reset() {
        data.value = undefined
    }

    return {
        $reset,
        data,
        init,
        wsOn,
        wsOff,
        updateEstimatesVisible,
        deleteEstimates,
    }
})
