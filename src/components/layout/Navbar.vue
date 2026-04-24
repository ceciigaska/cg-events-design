<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router' // Importamos el router

const auth = useAuthStore()
const router = useRouter()

onMounted(() => {
  auth.initialize()
})

const handleLogout = async () => {
  await auth.logout()
  router.push('/') // Mandar a la home al salir
}
</script>

<template>
  <nav class="flex justify-between items-center px-8 py-4 bg-white shadow">
    
    <!-- Logo -->
    <div class="text-xl font-bold text-purple-600">
      Invitaciones
    </div>

    <!-- Links -->
    <div class="flex gap-6 items-center">
      <a href="#" class="text-gray-600 hover:text-purple-600">Templates</a>
      <a href="#" class="text-gray-600 hover:text-purple-600">Precios</a>

      <!-- Si NO está logueado -->
      <template v-if="!auth.user">
        <button @click="$router.push('/auth')" class="text-gray-600">Login</button>
        <button @click="$router.push('/auth')" class="bg-purple-600 text-white px-4 py-2 rounded-lg">
          Registro
        </button>
      </template>

      <!-- Si está logueado -->
      <template v-else>
  <button @click="$router.push('/dashboard')" class="text-gray-600 hover:text-purple-600">
    Dashboard
  </button>
  <button @click="handleLogout" class="border border-red-400 text-red-500 px-3 py-1 rounded-lg hover:bg-red-50 text-sm">
    Salir
  </button>
</template>
    </div>

  </nav>
</template>