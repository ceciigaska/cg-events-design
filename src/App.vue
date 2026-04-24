<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

onMounted(() => {
  // Inicializamos la escucha de Supabase para que la sesión sea persistente
  auth.initialize()
})
</script>

<template>
  <RouterView />
</template>

<style>
/* Estilos globales básicos */
body {
  /* @apply antialiased text-gray-900; */
  margin: 0;
  font-family: 'Inter', sans-serif;
}
</style>