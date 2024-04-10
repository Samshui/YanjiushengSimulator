import {createRouter, createWebHashHistory} from "vue-router";
import Home from '../views/Homepage.vue'

const routes = [
    {
        path: '/home',
        name: Home,
        component: Home
    },
    {
        path: '/',
        redirect: '/home'
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
