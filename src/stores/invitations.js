import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useInvitationStore = defineStore('invitations', {
  state: () => ({
    projects: [],
    loading: false
  }),
  actions: {
    async fetchProjects() {
      this.loading = true
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error) this.projects = data
      this.loading = false
    },
    async createInvitation(userId) {
      const { data, error } = await supabase
        .from('invitations')
        .insert([
          { user_id: userId, title: 'Mi Nueva Invitación' }
        ])
        .select()
      
      if (error) throw error
      return data[0]
    }
  }
})