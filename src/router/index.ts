import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import single from './single';
import menu from './menu';
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        redirect: '/common/article'
    },
    {
        path: '/',
        name: 'Main',
        component: () => import('@/layout/Main.vue'),
        children: menu as any
    },
    {
        path: '/not-menu-child',
        name: 'not-menu-child',
        component: () => import('@/layout/Main.vue'),
        children: single as any
    }
];

const router = createRouter({
    history: createWebHashHistory(''),
    routes,
    scrollBehavior() {
        return {
            el: '#app',
            top: 0,
            behavior: 'smooth'
        };
    }
});

export default router;
