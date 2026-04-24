<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const activeTab = ref('diseño') 
const auth = useAuthStore()
const uploading = ref(false)

const timeLeft = ref({ dias: 0, horas: 0, min: 0, seg: 0 })

const eventTemplates = {
  wedding: {
    names: 'Ceci & Angel',
    message: '¡Nos casamos!',
    primaryColor: '#6d28d9',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000',
  },
  birthday: {
    names: '¡Mis 5 Años! - Santi',
    message: '¡Ven a celebrar conmigo!',
    primaryColor: '#db2777',
    coverImage: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=1000',
  },
  baptism: {
    names: 'Bautizo de Sofía',
    message: 'Acompáñanos a recibir esta bendición',
    primaryColor: '#60a5fa',
    coverImage: 'https://images.unsplash.com/photo-1560440024-1b4fe2f73b4f?q=80&w=1000',
  },
  babyshower: {
    names: 'Baby Shower - Itzel',
    message: '¡Ya casi llega nuestro bebé!',
    primaryColor: '#f9a8d4',
    coverImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000',
  },
  xv: {
    names: 'Mis XV Años - Vale',
    message: 'Una noche mágica para recordar',
    primaryColor: '#fbbf24',
    coverImage: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1000',
  },
  other: {
    names: 'Nombre del Evento',
    message: '¡Estás invitado!',
    primaryColor: '#10b981',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000',
  }
}

const config = ref({
  eventType: 'wedding',
  ...eventTemplates.wedding,
  eventDate: '2026-10-30',
  imageZoom: 100,
  imagePositionY: 0,
  locationName: 'Salón de Eventos "El Jardín"',
  locationAddress: 'Av. Paseo de la Reforma 1, CDMX',
  googleMapsUrl: '',
  showMap: true,
  hasRSVP: false,
  hasGiftTable: false,
  giftTableLink: '',
  giftTableMessage: 'Tu presencia es nuestro mejor regalo...'
})

watch(() => config.value.eventType, (newType) => {
  const template = eventTemplates[newType] || eventTemplates.wedding
  config.value = { ...config.value, ...template }
})

const calculateTime = () => {
  const target = new Date(config.value.eventDate).getTime()
  const now = new Date().getTime()
  const diff = target - now
  if (diff > 0) {
    timeLeft.value = {
      dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
      horas: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      min: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seg: Math.floor((diff % (1000 * 60)) / 1000)
    }
  }
}

const guests = ref([])
const invitationId = route.params.id

const fetchGuests = async () => {
  const { data, error } = await supabase.from('confirmations').select('*').eq('invitation_id', invitationId)
  if (!error) guests.value = data
}

onMounted(async () => {
  setInterval(calculateTime, 1000)
  if (!auth.user) { router.push('/auth'); return }
  const { data } = await supabase.from('invitations').select('*').eq('id', invitationId).single()
  if (data?.config) config.value = { ...config.value, ...data.config }
  await fetchGuests()
  loading.value = false
})

const saveChanges = async () => {
  await supabase.from('invitations').update({ config: config.value }).eq('id', invitationId)
  alert('¡Configuración guardada!')
}

const uploadImage = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  uploading.value = true
  const fileName = `${Date.now()}.${file.name.split('.').pop()}`
  const filePath = `${auth.user.id}/${fileName}`
  const { error } = await supabase.storage.from('invitations_assets').upload(filePath, file)
  if (!error) {
    const { data } = supabase.storage.from('invitations_assets').getPublicUrl(filePath)
    config.value.coverImage = data.publicUrl
  }
  uploading.value = false
}
</script>

<template>
  <div v-if="!loading" class="h-screen w-full flex bg-[#111111] text-white font-sans overflow-hidden">
    
    <aside class="w-20 h-full bg-[#18191b] flex flex-col items-center py-6 gap-8 border-r border-white/5">
      <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center font-black text-xs">CG</div>
      <button v-for="tab in ['diseño', 'texto', 'modulos', 'invitados']" :key="tab" 
              @click="activeTab = tab"
              :class="['flex flex-col items-center gap-1 transition-all', activeTab === tab ? 'text-purple-500 opacity-100' : 'opacity-40 hover:opacity-100']">
        <span class="text-[20px]">{{ tab === 'diseño' ? '🎨' : tab === 'texto' ? '📝' : tab === 'modulos' ? '⚙️' : '👥' }}</span>
        <span class="text-[10px] font-bold capitalize">{{ tab }}</span>
      </button>
    </aside>

    <aside class="w-80 h-full bg-[#1e1f21] border-r border-white/5 p-6 overflow-y-auto custom-scrollbar flex flex-col">
      <div class="flex-1">
        
        <div v-if="activeTab === 'diseño'" class="space-y-6 animate-in fade-in duration-300">
          <h2 class="text-sm font-bold uppercase tracking-widest text-gray-400">Estética Visual</h2>
          <section class="space-y-4">
            <label class="block text-[10px] font-bold text-gray-500 uppercase">Tipo de Evento</label>
            <select v-model="config.eventType" class="w-full bg-black/40 border border-white/10 p-2 rounded-lg text-sm outline-none focus:border-purple-500">
              <option value="wedding">💍 Boda</option>
              <option value="birthday">🎂 Cumpleaños</option>
              <option value="baptism">🕊️ Bautizo</option>
              <option value="babyshower">🍼 Baby Shower</option>
              <option value="xv">👑 XV Años</option>
              <option value="other">🎉 Otro / Especial</option>
            </select>
          </section>
          <section class="space-y-4">
            <label class="block text-[10px] font-bold text-gray-500 uppercase">Color de Acento</label>
            <div class="flex items-center gap-3 bg-black/20 p-2 rounded-xl border border-white/10">
              <input type="color" v-model="config.primaryColor" class="w-8 h-8 rounded bg-transparent cursor-pointer" />
              <span class="text-xs font-mono uppercase">{{ config.primaryColor }}</span>
            </div>
          </section>
          <section class="space-y-4 pt-4 border-t border-white/5">
            <label class="block text-[10px] font-bold text-gray-500 uppercase text-center">Ajuste de Portada</label>
            <div class="space-y-3">
              <div class="flex justify-between text-[9px] text-gray-500 uppercase font-bold"><span>Zoom</span><span>{{ config.imageZoom }}%</span></div>
              <input type="range" v-model="config.imageZoom" min="100" max="200" class="w-full accent-purple-500 h-1 bg-white/10 rounded-lg appearance-none" />
              <div class="flex justify-between text-[9px] text-gray-500 uppercase font-bold"><span>Posición Vertical</span><span>{{ config.imagePositionY }}px</span></div>
              <input type="range" v-model="config.imagePositionY" min="-200" max="200" class="w-full accent-purple-500 h-1 bg-white/10 rounded-lg appearance-none" />
            </div>
          </section>
        </div>

        <div v-if="activeTab === 'texto'" class="space-y-6 animate-in fade-in duration-300">
          <h2 class="text-sm font-bold uppercase tracking-widest text-gray-400">Contenido</h2>
          <div class="space-y-4">
            <div>
              <label class="text-gray-500 font-bold mb-1 block uppercase text-[10px]">Nombres</label>
              <input v-model="config.names" type="text" class="w-full bg-black/20 border border-white/10 p-2 rounded-lg text-xs" />
            </div>
             <div>
              <label class="text-gray-500 font-bold mb-1 block uppercase text-[10px]">Fecha</label>
              <input v-model="config.eventDate" type="date" class="w-full bg-black/20 border border-white/10 p-2 rounded-lg text-xs" />
            </div>
            <div>
              <label class="text-gray-500 font-bold mb-1 block uppercase text-[10px]">Mensaje</label>
              <textarea v-model="config.message" rows="3" class="w-full bg-black/20 border border-white/10 p-2 rounded-lg resize-none text-xs"></textarea>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'modulos'" class="space-y-6 animate-in fade-in duration-300">
          <h2 class="text-sm font-bold uppercase tracking-widest text-gray-400">Módulos Activos</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div class="flex flex-col">
                <span class="text-xs font-bold">Confirmación RSVP</span>
                <span class="text-[9px] opacity-40">Habilitar formulario</span>
              </div>
              <input type="checkbox" v-model="config.hasRSVP" class="accent-purple-500 w-4 h-4" />
            </div>

            <div class="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-xs font-bold">Ubicación</span>
                  <span class="text-[9px] opacity-40">Mostrar mapa y lugar</span>
                </div>
                <input type="checkbox" v-model="config.showMap" class="accent-purple-500 w-4 h-4" />
              </div>
              <div v-if="config.showMap" class="space-y-3 pt-3 border-t border-white/5 animate-in slide-in-from-top-2">
                <input v-model="config.locationName" type="text" placeholder="Lugar (ej: Hacienda El Carmen)" class="w-full bg-black/40 p-2 rounded-lg text-[10px] border border-white/5" />
                <input v-model="config.locationAddress" type="text" placeholder="Dirección completa" class="w-full bg-black/40 p-2 rounded-lg text-[10px] border border-white/5" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'invitados'" class="space-y-6 animate-in fade-in duration-300">
          <h2 class="text-sm font-bold uppercase tracking-widest text-gray-400">Asistencia</h2>
          <div class="space-y-2">
            <div v-for="guest in guests" :key="guest.id" class="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
              <div class="text-[10px]">
                <p class="font-bold">{{ guest.guest_name }}</p>
                <p class="opacity-40">{{ guest.extra_guests }} invitados extra</p>
              </div>
              <div :class="guest.is_attending ? 'text-green-400' : 'text-red-400'" class="text-[8px] font-black uppercase">
                {{ guest.is_attending ? 'Sí' : 'No' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button @click="saveChanges" class="w-full mt-6 bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-xl">
        Publicar Cambios
      </button>
    </aside>

    <main class="flex-1 h-full bg-[#0a0a0a] relative flex items-center justify-center p-8 overflow-hidden">
      <div class="relative w-[340px] h-full max-h-[680px] bg-[#1a1a1a] rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] border-[8px] border-[#252525] overflow-hidden">
        <div class="h-full overflow-y-auto scroll-hide">
          
          <div class="w-full h-72 relative overflow-hidden bg-zinc-900">
            <img v-if="config.coverImage" :src="config.coverImage" 
                 class="w-full h-full object-cover"
                 :style="{ transform: `scale(${config.imageZoom/100}) translateY(${config.imagePositionY}px)` }" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]"></div>
          </div>

          <div class="px-8 -mt-12 relative z-10 text-center space-y-6 pb-20">
            <div>
              <h1 class="text-3xl font-serif leading-tight" :style="{ color: config.primaryColor }">
                {{ config.names }}
              </h1>
              <p class="text-[9px] opacity-40 tracking-[0.3em] uppercase italic mt-2">
                {{ config.message }}
              </p>
            </div>

            <div class="text-3xl opacity-90 animate-bounce-subtle">
              {{ 
                config.eventType === 'wedding' ? '💍' : 
                config.eventType === 'birthday' ? '🎂' : 
                config.eventType === 'baptism' ? '🕊️' : 
                config.eventType === 'babyshower' ? '🍼' : 
                config.eventType === 'xv' ? '👑' : '🎉' 
              }}
            </div>

            <div class="flex justify-center gap-3 py-6 border-y border-white/5 bg-white/[0.02] rounded-3xl">
              <div v-for="(val, unit) in timeLeft" :key="unit" class="flex flex-col min-w-[45px]">
                <span class="text-xl font-light" :style="{ color: config.primaryColor }">{{ val }}</span>
                <span class="text-[7px] uppercase opacity-30 tracking-widest">{{ unit }}</span>
              </div>
            </div>

            <div class="space-y-6 pt-4">
              <div class="text-center">
                <span class="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">Reserva la fecha</span>
                <h3 class="text-xl mt-1 font-serif">{{ config.eventDate }}</h3>
                <p class="text-[10px] opacity-50 mt-1">{{ config.locationName }}</p>
              </div>

              <div v-if="config.hasRSVP" class="pt-2">
                <button class="w-full py-4 rounded-2xl text-[9px] font-bold uppercase tracking-widest border transition-all" 
                        :style="{ borderColor: config.primaryColor + '44', color: config.primaryColor, backgroundColor: config.primaryColor + '11' }">
                  Confirmar Asistencia
                </button>
              </div>
            </div>
          </div>

          <footer class="pb-10 text-center opacity-10 text-[6px] uppercase tracking-[0.6em]">
            CG Event & Design
          </footer>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.scroll-hide::-webkit-scrollbar { display: none; }
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
.font-serif { font-family: 'Playfair Display', serif; }

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-bounce-subtle {
  animation: bounce-subtle 3s ease-in-out infinite;
}
</style>