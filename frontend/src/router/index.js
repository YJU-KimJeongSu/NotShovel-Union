import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashBoardView from '../views/DashBoardView.vue'
import SignInUpView from '../views/SignInUpView.vue'
import CreateProjectView from '../views/CreateProjectView.vue'
import EditMember from '../views/EditMember.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/createproject',
    name: 'createproject',
    component: CreateProjectView
  },
  {
    path: '/signinup',
    name: 'signinup',
    component: SignInUpView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashBoardView
  },
  {
    path: '/editmember',
    name: 'editmember',
    component: EditMember
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
