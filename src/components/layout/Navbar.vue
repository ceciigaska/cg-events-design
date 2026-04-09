<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const auth = useAuthStore()

onMounted(() => {
  auth.getUser()
})
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
        <button class="text-gray-600">Login</button>
        <button class="bg-purple-600 text-white px-4 py-2 rounded-lg">
          Registro
        </button>
      </template>

      <!-- Si está logueado -->
      <template v-else>
        <button class="text-gray-600">Dashboard</button>
      </template>
    </div>

  </nav>
</template>