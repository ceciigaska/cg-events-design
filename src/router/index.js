import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Dashboard from '@/views/Dashboard.vue' // Importamos el Dashboard

const routes = [
  { 
    path: '/', 
    name: 'home',
    component: Home 
  },
  { 
    path: '/dashboard', 
    name: 'dashboard',
    component: Dashboard 
  },
  { path: '/auth', name: 'auth', component: () => import('@/views/Auth.vue') },
  { 
  path: '/editor/:id', 
  name: 'editor', 
  component: () => import('@/views/Editor.vue') 
}
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})