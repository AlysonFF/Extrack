import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './views/Home.vue'
import ProjectForm from './views/ProjectForm.vue'
import ProjectList from './views/ProjectList.vue'
import ProjectDetails from './views/ProjectDetails.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import ForgotPassword from './views/ForgotPassword.vue'
import ResetPassword from './views/ResetPassword.vue'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/projects', component: ProjectList, meta: { requiresAuth: true } },
  { path: '/projects/new', component: ProjectForm, meta: { requiresAuth: true } },
  { path: '/projects/:id', component: ProjectDetails, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password/:token', component: ResetPassword }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(Vue3Toastify, {
  autoClose: false,
  pauseOnHover: true,
  closeOnClick: true,
  theme: 'light'
})
app.mount('#app')