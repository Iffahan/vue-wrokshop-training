import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'toolbar',
    component: () => import('../views/ToolBar.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        component: HomeView
      },
      {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue')
      },
      {
        path: '/grade',
        name: 'grade',
        component: () => import('../views/GradeCal.vue')
      },
      {
        path: '/test',
        name: 'test',
        component: () => import('../views/TestViews.vue')
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
