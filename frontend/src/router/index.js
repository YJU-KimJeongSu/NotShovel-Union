import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import SignUpView from '../views/SignUpView.vue'
import DashBoardView from '../views/DashBoardView.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    
    path: '/signin',
    name: 'signin',
    component: SignInView
  },
  {
    
    path: '/signup',
    name: 'signup',
    component: SignUpView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashBoardView
  },
  
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
