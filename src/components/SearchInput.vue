<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['search']);
const query = ref('');
const inputRef = ref(null);
let timeout = null;

const handleInput = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('search', query.value);
  }, 500); // 500ms debounce
};

const clearSearch = () => {
  query.value = '';
  emit('search', '');
  inputRef.value?.focus();
};

// Atajo de teclado (Ctrl/Cmd + K) para buscar
const handleShortcut = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    inputRef.value?.focus();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleShortcut);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleShortcut);
});
</script>

<template>
  <div class="relative w-full max-w-2xl mx-auto my-8 group">
    <!-- Glow effect detrás del input -->
    <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
    
    <div class="relative flex items-center">
      <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-pink-500 group-focus-within:text-pink-400 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      
      <input 
        ref="inputRef"
        type="text" 
        v-model="query"
        @input="handleInput"
        class="block w-full py-4 pl-12 pr-24 text-lg text-white bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-full placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all shadow-xl" 
        placeholder="Busca GIFs (ej. gatos, memes, reactions)..." 
      >

      <!-- Clear button & Shortcut hint -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <button 
          v-if="query" 
          @click="clearSearch"
          class="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors mr-2"
          title="Limpiar búsqueda"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </button>
        <span v-else class="hidden md:flex items-center justify-center px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-800 rounded-lg border border-slate-700">
          ⌘K
        </span>
      </div>
    </div>
  </div>
</template>
