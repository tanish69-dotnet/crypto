import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCryptoStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      // Currency
      currency: 'usd',
      setCurrency: (currency) => set({ currency }),

      // Sort
      sortBy: 'market_cap_rank',
      sortDir: 'asc',
      setSortBy: (field) =>
        set((s) => ({
          sortBy: field,
          sortDir: s.sortBy === field ? (s.sortDir === 'asc' ? 'desc' : 'asc') : 'asc',
        })),

      // Search
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      // View
      viewMode: 'grid',
      setViewMode: (viewMode) => set({ viewMode }),

      // Watchlist
      watchlist: [],
      showWatchlist: false,
      toggleShowWatchlist: () => set((s) => ({ showWatchlist: !s.showWatchlist })),
      toggleWatchlist: (coinId) =>
        set((s) => ({
          watchlist: s.watchlist.includes(coinId)
            ? s.watchlist.filter((id) => id !== coinId)
            : [...s.watchlist, coinId],
        })),
      isWatched: (coinId) => get().watchlist.includes(coinId),

      // Modal
      selectedCoin: null,
      setSelectedCoin: (coin) => set({ selectedCoin: coin }),
      clearSelectedCoin: () => set({ selectedCoin: null }),
    }),
    {
      name: 'cryptonova-v1',
      partialize: (s) => ({
        theme: s.theme,
        currency: s.currency,
        watchlist: s.watchlist,
        viewMode: s.viewMode,
      }),
    }
  )
);

export default useCryptoStore;
