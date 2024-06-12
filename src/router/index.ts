import { createRouter, createWebHistory } from 'vue-router'
import Route from '@/router/route'
import RouteName from '@/router/route-name'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: Route.Home,
            name: RouteName.Home,
            component: () => import('@/views/HomeView.vue'),
        },
        {
            path: Route.Room,
            name: RouteName.Room,
            component: () => import('@/views/RoomView.vue'),
        },
        {
            path: '/:pathMatch(.*)',
            redirect: { name: RouteName.Home },
        },
    ],
})

export default router
