import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false
  }),
  actions: {
    // Escuchar cambios de sesión automáticamente
    initialize() {
      supabase.auth.onAuthStateChange((event, session) => {
        this.user = session?.user || null
      })
    },
    async login(email, password) {
      this.loading = true
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        this.user = data.user
      } finally {
        this.loading = false
      }
    },
    async logout() {
      await supabase.auth.signOut()
      this.user = null
    }
  }
})