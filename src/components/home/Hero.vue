<template>
  <section class="relative bg-brand-dark py-24 overflow-hidden">
    <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl"></div>
    
    <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
      <div>
        <span class="text-brand-accent font-semibold tracking-widest uppercase text-sm">Próximamente: Editor Drag & Drop</span>
        <h1 class="text-5xl md:text-7xl font-serif text-white mt-4 leading-tight">
          Invitaciones que <span class="italic text-brand-accent">enamoran</span> a tus invitados.
        </h1>
        <p class="text-gray-400 mt-6 text-lg max-w-lg">
          Crea experiencias digitales interactivas para tu boda, XV años o evento especial. Gestión de RSVP, mapas y música en un solo link.
        </p>
        <div class="mt-10 flex flex-wrap gap-4">
          <button @click="$router.push('/register')" class="bg-brand-primary hover:bg-purple-700 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25">
            Crear mi invitación gratis
          </button>
          <button class="border border-gray-600 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
            Ver Demo Premium
          </button>
        </div>
      </div>
      
      <div class="hidden lg:block relative">
        <div class="bg-gradient-to-tr from-brand-primary to-purple-400 w-full aspect-video rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" alt="Wedding event" class="opacity-60 object-cover w-full h-full" />
        </div>
        <div class="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3">
          <div class="bg-green-100 text-green-600 p-2 rounded-full">✓</div>
          <div>
            <p class="text-sm font-bold text-gray-800">RSVP en tiempo real</p>
            <p class="text-xs text-gray-500">12 confirmados hoy</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>