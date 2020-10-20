import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  // { path: '/api/:function' },
  { path: '/', component: Home }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export default router