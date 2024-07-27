import { createRouter, createWebHistory } from 'vue-router'
import Route from '@/router/route'
import RouteName from '@/router/route-name'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: Route.Home,
            name: RouteName.Home,
            component: () => import('@/views/home/HomeView.vue'),
        },
        {
            path: Route.JoinRoom,
            name: RouteName.JoinRoom,
            component: () => import('@/views/join-room/JoinRoomView.vue'),
            props: (route) => ({
                roomId: route.params.roomId,
                pin: route.query.pin,
            }),
        },
        {
            path: Route.Room,
            name: RouteName.Room,
            component: () => import('@/views/RoomView.vue'),
            props: (route) => ({
                roomId: route.params.roomId,
            }),
        },
        {
            path: '/:pathMatch(.*)',
            redirect: { name: RouteName.Home },
        },
    ],
})

export default router
