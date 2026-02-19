<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  gif: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);
const isCopied = ref(false);
const isDownloading = ref(false);

// Cerrar con Escape
const handleKeydown = (e) => {
  if (e.key === 'Escape') emit('close');
};

onMounted(() => {
  document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.body.style.overflow = 'auto';
  window.removeEventListener('keydown', handleKeydown);
});

// Acciones
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.gif.fullUrl);
    isCopied.value = true;
    setTimeout(() => isCopied.value = false, 2000);
  } catch (err) {
    console.error('Error al copiar', err);
  }
};

const downloadGif = async () => {
  if (isDownloading.value) return;
  isDownloading.value = true;
  
  try {
    const response = await fetch(props.gif.fullUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `tenorfun-${props.gif.id}.gif`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (err) {
    console.error('Error al descargar', err);
    alert('No se pudo descargar el GIF. Intenta copiar el enlace.');
  } finally {
    isDownloading.value = false;
  }
};

// Redes Sociales
const shareUrl = encodeURIComponent(props.gif.fullUrl);
const shareText = encodeURIComponent(`¡Mira este GIF en TenorFun! ${props.gif.title}`);

const shareLinks = {
  whatsapp: `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`,
  twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
};

const openShare = (network) => {
  window.open(shareLinks[network], '_blank', 'width=600,height=400');
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" @click.self="emit('close')">
    <!-- Fondo oscuro desenfocado -->
    <div class="absolute inset-0 bg-slate-900/90 backdrop-blur-md transition-opacity duration-300"></div>

    <!-- Contenedor principal del Modal -->
    <div class="relative bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row transform transition-all duration-300 scale-100 animate-modal-pop">
      
      <!-- Botón cerrar móvil (absoluto) -->
      <button @click="emit('close')" class="md:hidden absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Área de la imagen (Izquierda/Arriba) -->
      <div class="w-full md:w-2/3 bg-slate-900/50 flex items-center justify-center p-4 md:p-8 min-h-[300px]">
        <img 
          :src="gif.fullUrl" 
          :alt="gif.title" 
          class="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg ring-1 ring-white/10"
        />
      </div>

      <!-- Panel lateral de acciones (Derecha/Abajo) -->
      <div class="w-full md:w-1/3 bg-slate-800 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-700">
        <div>
          <!-- Botón cerrar Desktop -->
          <div class="hidden md:flex justify-end mb-4">
            <button @click="emit('close')" class="text-slate-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h3 class="text-2xl font-bold text-white mb-6 pr-8 md:pr-0 leading-tight">
            {{ gif.title || 'GIF sin título' }}
          </h3>

          <div class="space-y-4">
            <!-- Botón Descargar -->
            <button 
              @click="downloadGif" 
              :disabled="isDownloading"
              class="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              <svg v-if="!isDownloading" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <svg v-else class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isDownloading ? 'Descargando...' : 'Descargar GIF' }}
            </button>

            <!-- Botón Copiar Link -->
            <button 
              @click="copyLink" 
              class="w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl border border-slate-600 transition-colors flex items-center justify-center gap-3"
            >
              <template v-if="isCopied">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-emerald-400">¡Enlace Copiado!</span>
              </template>
              <template v-else>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Copiar Enlace
              </template>
            </button>
          </div>
        </div>

        <!-- Compartir Redes Sociales -->
        <div class="mt-8">
          <p class="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">Compartir en redes</p>
          <div class="flex gap-3 justify-center md:justify-start">
            <!-- WhatsApp -->
            <button @click="openShare('whatsapp')" class="p-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-full transition-colors" title="Compartir en WhatsApp">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.332.101 11.893c-.002 2.119.552 4.185 1.588 5.981L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.332 11.893-11.893a11.821 11.821 0 00-3.423-8.452zM12.046 21.77c-1.794 0-3.535-.48-5.064-1.385l-.363-.214-3.766.988.999-3.669-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.032 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m5.423-7.411c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.412"/></svg>
            </button>
            <!-- Twitter -->
            <button @click="openShare('twitter')" class="p-3 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-full transition-colors" title="Compartir en Twitter">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </button>
            <!-- Facebook -->
            <button @click="openShare('facebook')" class="p-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-full transition-colors" title="Compartir en Facebook">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes modal-pop {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-pop {
  animation: modal-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
