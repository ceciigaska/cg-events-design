<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useInvitationStore } from '@/stores/invitations'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const invitationStore = useInvitationStore()
const router = useRouter()

onMounted(async () => {
  await invitationStore.fetchProjects()
})

const handleCreate = async () => {
  try {
    const newProject = await invitationStore.createInvitation(auth.user.id)
    // Por ahora refrescamos la lista, luego iremos al editor
    await invitationStore.fetchProjects()
    alert('¡Invitación creada con éxito!')
  } catch (error) {
    console.error('Error al crear:', error.message)
  }
}
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-white p-8">
    <header class="flex justify-between items-center mb-10">
      <h2 class="text-3xl font-serif font-bold">Mis Proyectos</h2>
      <button 
        @click="handleCreate"
        class="bg-brand-primary hover:bg-purple-700 px-6 py-2 rounded-lg font-bold transition-all"
      >
        + Nueva Invitación
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        v-for="project in invitationStore.projects" 
        :key="project.id"
        class="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-brand-primary transition-all cursor-pointer"
      >
        <h3 class="font-bold text-lg">{{ project.title }}</h3>
        <p class="text-gray-400 text-sm mt-1">Plan: {{ project.plan_type }}</p>
        <div class="mt-4 flex justify-between items-center">
          <span class="text-xs text-gray-500 italic">Creado: {{ new Date(project.created_at).toLocaleDateString() }}</span>
          <button 
  @click="$router.push(`/editor/${project.id}`)" 
  class="text-brand-accent text-sm font-bold"
>
  Editar →
</button>
        </div>
      </div>

      <div 
        v-if="invitationStore.projects.length === 0"
        @click="handleCreate"
        class="border-2 border-dashed border-gray-700 rounded-2xl h-48 flex flex-col items-center justify-center text-gray-500 hover:border-brand-primary hover:text-brand-primary transition-all cursor-pointer"
      >
        <span class="text-3xl">+</span>
        <p>Crea tu primera invitación</p>
      </div>
    </div>
  </div>
</template>