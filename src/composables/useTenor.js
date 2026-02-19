import { ref, readonly } from 'vue';

const SEARCH_URL = 'https://g.tenor.com/v1/search';
const TRENDING_URL = 'https://g.tenor.com/v1/trending';
const API_KEY = 'LIVDSRZULELA';

export function useTenor() {
  const gifs = ref([]);
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const error = ref(null);
  const nextPos = ref('');
  const currentQuery = ref('');
  const isTrending = ref(true);

  const processResults = (results) => {
    if (results && Array.isArray(results)) {
      return results.map(result => ({
        id: result.id,
        title: result.content_description || 'GIF',
        url: result.media[0].tinygif.url,
        fullUrl: result.media[0].gif.url,
        dims: result.media[0].tinygif.dims
      }));
    }
    return [];
  };

  const loadData = async (query = '', isLoadMore = false) => {
    if (isLoadMore) {
      if (isLoadingMore.value || !nextPos.value) return;
      isLoadingMore.value = true;
    } else {
      isLoading.value = true;
      gifs.value = [];
      nextPos.value = '';
    }
    
    error.value = null;

    try {
      let url = '';
      if (query) {
        // Añadimos locale=es_MX para buscar y recibir resultados en español
        url = `${SEARCH_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}&limit=20&media_filter=minimal&locale=es_MX`;
        if (isLoadMore && nextPos.value) url += `&pos=${nextPos.value}`;
      } else {
        url = `${TRENDING_URL}?key=${API_KEY}&limit=20&media_filter=minimal&locale=es_MX`;
        if (isLoadMore && nextPos.value) url += `&pos=${nextPos.value}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo conectar`);
      }

      const data = await response.json();
      
      const newGifs = processResults(data.results);
      
      if (isLoadMore) {
        gifs.value = [...gifs.value, ...newGifs];
      } else {
        gifs.value = newGifs;
      }
      
      nextPos.value = data.next || '';
      
    } catch (err) {
      console.error('Error fetching GIFs:', err);
      error.value = "Hubo un problema de conexión.";
      if (!isLoadMore) gifs.value = [];
    } finally {
      isLoading.value = false;
      isLoadingMore.value = false;
    }
  };

  const searchGifs = async (query) => {
    currentQuery.value = query;
    isTrending.value = !query;
    await loadData(query, false);
  };

  const getTrending = async () => {
    currentQuery.value = '';
    isTrending.value = true;
    await loadData('', false);
  };

  const loadMore = async () => {
    if (!nextPos.value) return;
    await loadData(currentQuery.value, true);
  };

  return {
    gifs: readonly(gifs),
    isLoading: readonly(isLoading),
    isLoadingMore: readonly(isLoadingMore),
    error: readonly(error),
    hasMore: readonly(ref(true)),
    searchGifs,
    getTrending,
    loadMore
  };
}
