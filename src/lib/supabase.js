import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jmzvokcxjbsshovypbeq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptenZva2N4amJzc2hvdnlwYmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzQ1MTEsImV4cCI6MjA5MTI1MDUxMX0.5Zy3OipsdHPQ5GWiJhoVjk5ADGakOM7brpIl8ency58'

export const supabase = createClient(supabaseUrl, supabaseKey)