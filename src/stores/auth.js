import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),

  actions: {
    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      this.user = data.user
    },

    async register(email, password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) throw error

      this.user = data.user
    },

    async getUser() {
      const { data } = await supabase.auth.getUser()
      this.user = data.user
    }
  }
})