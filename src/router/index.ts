import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Main from '../layout/Main.vue';

import Dashboard from '../views/Dashboard.vue';
import Article from '../views/Article.vue';
import Series from '../views/Series.vue';
import Setting from '../views/Setting.vue';
import User from '../views/User.vue';
import Manage from '../views/Manage.vue';
import AddArticle from '../views/AddArticle.vue';

import Login from '../views/Login.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Main',
        component: Main,
        children: [
            {
                path: '/',
                name: 'Dashboard',
                component: Dashboard,
                redirect: '/Article',
                meta: {
                    title: '开始'
                }
            },

            {
                path: '/Article',
                name: 'Article',
                component: Article,
                meta: {
                    title: '文章'
                }
            },
            {
                path: '/AddArticle',
                name: 'AddArticle',
                component: AddArticle,
                meta: {
                    title: '写文章'
                }
            },

            {
                path: '/Manage',
                name: 'Manage',
                component: Manage,
                meta: {
                    title: '管理'
                }
            },
            {
                path: '/Series',
                name: 'Series',
                component: Series,
                meta: {
                    title: '系列'
                }
            },
            {
                path: '/User',
                name: 'User',
                component: User,
                meta: {
                    title: '用户'
                }
            },

            {
                path: '/Setting',
                name: 'Setting',
                component: Setting,
                meta: {
                    title: '设置'
                }
            }
        ]
    },
    {
        path: '/Login',
        name: 'Login',
        component: Login
    }
];
const router = createRouter({
    history: createWebHashHistory(''),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return {
            el: '#app',
            top: 0,
            behavior: 'smooth'
        };
    }
});

export default router;
