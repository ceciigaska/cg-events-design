<template>
  <div class="min-h-screen bg-brand-dark flex items-center justify-center px-6">
    <div class="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl">
      <h2 class="text-3xl font-serif font-bold text-gray-800 text-center">
        {{ isLogin ? '¡Bienvenida de nuevo!' : 'Crea tu cuenta' }}
      </h2>
      <p class="text-gray-500 text-center mt-2 mb-8">
        {{ isLogin ? 'Ingresa para gestionar tus eventos' : 'Empieza a diseñar invitaciones mágicas' }}
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" required class="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input v-model="password" type="password" required class="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none" />
        </div>
        
        <button :disabled="auth.loading" class="w-full bg-brand-primary text-white p-4 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">
          {{ auth.loading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Registrarme') }}
        </button>
      </form>

      <button @click="isLogin = !isLogin" class="w-full mt-6 text-sm text-brand-primary font-medium text-center">
        {{ isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const isLogin = ref(true)
const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  try {
    if (isLogin.ref) {
      await auth.login(email.value, password.value)
    } else {
      await auth.register(email.value, password.value)
    }
    router.push('/dashboard') // Si todo sale bien, vamos al dashboard
  } catch (error) {
    alert('Error: ' + error.message)
  }
}
</script>