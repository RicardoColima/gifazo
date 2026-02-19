<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { useTenor } from './composables/useTenor';
import SearchInput from './components/SearchInput.vue';
import GifGrid from './components/GifGrid.vue';
import LoadingSpinner from './components/LoadingSpinner.vue';
import ErrorBanner from './components/ErrorBanner.vue';

const { gifs, isLoading, isLoadingMore, error, searchGifs, getTrending, loadMore } = useTenor();
const currentTitle = ref('🔥 Tendencias ahora');
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const handleSurprise = () => {
  const terms = ['gatos', 'fails', 'baile', 'risa', 'mind blown', 'perros', 'fiesta', 'wtf', 'mario bros', 'simpsons'];
  const randomTerm = terms[Math.floor(Math.random() * terms.length)];
  handleSearch(randomTerm);
};

onMounted(() => {
  getTrending();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const handleSearch = (query) => {
  if (query) {
    currentTitle.value = `Resultados para "${query}"`;
    searchGifs(query);
  } else {
    currentTitle.value = '🔥 Tendencias ahora';
    getTrending();
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-cyan-500 selection:text-white relative">
    
    <!-- Navbar Fijo y Translúcido -->
    <nav :class="['fixed top-0 left-0 right-0 z-40 transition-all duration-300', isScrolled ? 'bg-slate-900/90 backdrop-blur-md shadow-lg shadow-cyan-900/20 border-b border-cyan-500/20 py-3' : 'bg-transparent py-6']">
      <div class="container mx-auto px-4 flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer group" @click="handleSearch('')">
          <div class="p-2 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <span class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-500 to-indigo-500 tracking-tighter group-hover:from-cyan-200 transition-all">
            Gifazo
          </span>
        </div>
        
        <div class="hidden md:block w-1/3 transition-all duration-300" :class="isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'">
          <div class="relative">
            <SearchInput @search="handleSearch" class="!my-0 scale-90 origin-right" />
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="relative pt-32 pb-20 px-4 text-center overflow-hidden min-h-[65vh] flex items-center justify-center">
      <!-- Malla de fondo animada -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKSIvPjwvc3ZnPg==')] [mask-image:linear-gradient(to_bottom,white_20%,transparent_90%)] animate-grid-flow"></div>

      <!-- Elementos decorativos de luz -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] -z-10 mix-blend-screen animate-blob"></div>
      <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10 mix-blend-screen animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -z-10 mix-blend-screen animate-blob animation-delay-4000"></div>

      <div class="relative z-10 max-w-4xl mx-auto w-full">
        <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-semibold tracking-wide backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:bg-cyan-500/20 transition-colors cursor-pointer" @click="handleSurprise">
          <span>✨</span> Sorpréndeme
        </div>
        
        <!-- H1 Animado con efecto Jelly (Divertido y rebotante) -->
        <div class="relative mx-auto w-fit mb-6 group cursor-pointer px-8 py-4">
          <h1 class="text-7xl md:text-9xl font-black tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 z-10 relative leading-none group-hover:animate-jelly pr-2">
            Gifazo
          </h1>
          
          <!-- Destellos de estrella divertidos al hacer hover -->
          <span class="absolute -top-4 -left-4 text-yellow-300 text-3xl opacity-0 group-hover:animate-pop-star delay-75 pointer-events-none">✨</span>
          <span class="absolute -bottom-2 -right-4 text-pink-400 text-2xl opacity-0 group-hover:animate-pop-star delay-150 pointer-events-none">⭐</span>
          <span class="absolute top-1/2 -right-8 text-cyan-400 text-xl opacity-0 group-hover:animate-pop-star delay-300 pointer-events-none">✨</span>
        </div>
        
        <p class="text-slate-300 text-xl md:text-2xl mb-12 font-light tracking-wide max-w-2xl mx-auto drop-shadow-md leading-relaxed">
          Encuentra <span class="font-bold text-cyan-400 relative">ese<span class="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400/50"></span></span> GIF exacto que necesitas. Rápido, fácil y en alta calidad.
        </p>
        
        <div class="transform hover:scale-[1.02] transition-transform duration-300 relative z-20 w-full max-w-2xl mx-auto" :class="isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'">
          <SearchInput @search="handleSearch" />
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 pb-16 relative z-10 bg-[#0f172a]/90 backdrop-blur-3xl rounded-t-[3rem] pt-12 -mt-12 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] border-t border-white/5">
      <!-- Título de sección -->
      <div class="mb-10 flex items-center gap-3 px-4 max-w-7xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-black text-white/90 border-l-4 border-cyan-500 pl-5 flex items-center gap-4 tracking-tight">
          {{ currentTitle }}
          <span v-if="isLoading" class="flex h-3 w-3 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        </h2>
      </div>

      <div v-if="error" class="mb-8 animate-fade-in max-w-7xl mx-auto">
        <ErrorBanner :message="error" />
      </div>

      <!-- Spinner inicial -->
      <div v-if="isLoading && gifs.length === 0" class="py-32">
        <LoadingSpinner />
      </div>

      <!-- Grilla de GIFs -->
      <div v-else-if="gifs.length > 0" class="animate-fade-in-up">
        <GifGrid :gifs="gifs" :is-loading-more="isLoadingMore" @load-more="loadMore" />
      </div>

      <!-- Estado Vacío -->
      <div v-else-if="!isLoading && !error" class="text-center text-slate-500 mt-20 flex flex-col items-center py-20 animate-fade-in">
        <div class="bg-slate-800/50 p-8 rounded-3xl mb-6 ring-1 ring-slate-700 shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 opacity-50 text-cyan-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold text-slate-300 tracking-tight">No encontramos nada...</p>
        <p class="text-slate-400 mt-3 text-lg">Intenta con otra palabra clave</p>
      </div>
    </main>

    <!-- Botón Volver Arriba -->
    <Transition name="fade-slide">
      <button 
        v-show="isScrolled"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-2 hover:scale-110 transition-all duration-300 group border border-cyan-400/30"
        title="Volver arriba"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:-translate-y-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </Transition>
    
    <footer class="text-center py-12 text-slate-500 text-sm bg-[#090e17] border-t border-slate-800 relative z-10">
      <div class="flex items-center justify-center gap-3 mb-4">
        <div class="p-2 bg-slate-800 rounded-lg"><span class="text-xl">🚀</span></div>
        <div class="p-2 bg-slate-800 rounded-lg"><span class="text-xl">✨</span></div>
      </div>
      <p class="font-medium text-slate-400">Hecho para divertirse con <span class="text-cyan-500 font-bold">Gifazo</span></p>
    </footer>
  </div>
</template>

<style>
/* Efecto Divertido Jelly/Rebote */
@keyframes jelly {
  0% { transform: scale3d(1, 1, 1); }
  30% { transform: scale3d(1.25, 0.75, 1); }
  40% { transform: scale3d(0.75, 1.25, 1); }
  50% { transform: scale3d(1.15, 0.85, 1); }
  65% { transform: scale3d(0.95, 1.05, 1); }
  75% { transform: scale3d(1.05, 0.95, 1); }
  100% { transform: scale3d(1, 1, 1); }
}

.animate-jelly {
  animation: jelly 0.9s ease-in-out both;
  transform-origin: center bottom;
}

/* Efecto para estrellas pop */
@keyframes pop-star {
  0% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.5) rotate(45deg); }
  100% { opacity: 0; transform: scale(0.5) rotate(90deg); }
}

.animate-pop-star {
  animation: pop-star 0.8s ease-out forwards;
}

/* Otras animaciones existentes */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(40px, -60px) scale(1.1); }
  66% { transform: translate(-30px, 30px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 10s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes grid-flow {
  0% { transform: translateY(0); }
  100% { transform: translateY(40px); }
}

.animate-grid-flow {
  animation: grid-flow 3s linear infinite;
}

.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>
