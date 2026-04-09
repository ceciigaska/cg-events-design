<template>
  <div class="min-h-screen bg-gray-50">
    <h1 class="text-4xl font-bold text-center mt-20">
      Invitaciones digitales
    </h1>

    <p class="text-center mt-4 text-gray-600">
      Crea y comparte tus eventos de forma única
    </p>

    <div class="flex justify-center mt-8">
      <button class="bg-purple-600 text-white px-6 py-3 rounded-xl">
        Empezar gratis
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

onMounted(() => {
  auth.getUser()
})
</script>