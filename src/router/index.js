import { createRouter, createWebHashHistory } from "vue-router"
 
const routes = [
    {
        path: '/',
        name: 'Index',
        component: () => import('@/pages/index')
    },
	{
	    path: '/pdf',
	    name: 'pdf',
	    component: () => import('@/pages/pdf')
	}
]
export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})
 
export default router
