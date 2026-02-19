<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import GifModal from './GifModal.vue';

const props = defineProps({
  gifs: {
    type: Array,
    required: true
  },
  isLoadingMore: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['loadMore']);

const selectedGif = ref(null);

const openModal = (gif) => {
  selectedGif.value = gif;
};

const closeModal = () => {
  selectedGif.value = null;
};

// Lógica de Scroll Infinito
const handleScroll = () => {
  // Detectar si llegamos al final de la página
  const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - 200;
  
  if (bottomOfWindow && !props.isLoadingMore) {
    emit('loadMore');
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="relative">
    <div class="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mx-auto max-w-7xl px-4 pb-8">
      <div 
        v-for="(gif, index) in gifs" 
        :key="`${gif.id}-${index}`" 
        class="group relative break-inside-avoid rounded-2xl overflow-hidden bg-slate-800 shadow-xl transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer animate-fade-in-up"
        @click="openModal(gif)"
      >
        
        <!-- Imagen con Skeleton Loading state -->
        <div class="relative w-full min-h-[150px] bg-slate-800">
          <img 
            :src="gif.url" 
            :alt="gif.title" 
            class="w-full h-auto object-cover relative z-10"
            loading="lazy"
            onload="this.classList.add('loaded')"
          />
          <div class="absolute inset-0 bg-slate-700 animate-pulse z-0"></div>
        </div>
        
        <!-- Overlay Hover Effect -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex flex-col justify-end p-4 translate-y-4 group-hover:translate-y-0">
          <p class="text-white font-bold text-sm truncate drop-shadow-md">
            {{ gif.title || 'Ver GIF' }}
          </p>
          <div class="mt-2 flex items-center gap-2 text-cyan-400 text-xs font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Ampliar
          </div>
        </div>

      </div>
    </div>

    <!-- Indicador de Carga Inferior -->
    <div v-if="isLoadingMore" class="flex justify-center items-center py-8 mb-8">
      <div class="animate-bounce flex space-x-2">
        <div class="w-3 h-3 bg-cyan-500 rounded-full"></div>
        <div class="w-3 h-3 bg-blue-500 rounded-full animation-delay-200"></div>
        <div class="w-3 h-3 bg-indigo-500 rounded-full animation-delay-400"></div>
      </div>
    </div>

    <!-- Modal (Teleport para evitar problemas de z-index con las columnas) -->
    <Teleport to="body">
      <Transition name="fade">
        <GifModal 
          v-if="selectedGif" 
          :gif="selectedGif" 
          @close="closeModal" 
        />
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
img {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
img.loaded {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 200ms;
}
.animation-delay-400 {
  animation-delay: 400ms;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
