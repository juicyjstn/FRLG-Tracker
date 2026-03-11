import { useEffect } from 'react'
import { usePokemonStore } from './store/usePokemonStore'
import { FilterBar } from './components/FilterBar'
import { PokedexGrid } from './components/PokedexGrid'
import { LocationPanel } from './components/LocationPanel'
import pokedexData from './data/frlg-pokemon.json'

export default function App() {
  const { loadData, caughtIds, loaded, selectedId, clearSelection, getFiltered, getActivePokemon, dexView, darkMode, toggleDarkMode, filterVersion } = usePokemonStore()

  useEffect(() => {
    loadData(pokedexData)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const filtered = getFiltered()
  const activePokemon = getActivePokemon()
  const caughtCount = [...caughtIds].filter(id => activePokemon.some(p => p.id === id)).length
  const total = activePokemon.length

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-400 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">⏳</div>
          <p>Loading Pokédex...</p>
        </div>
      </div>
    )
  }

  const headerBg = dexView === 'national' ? 'bg-indigo-700' : 'bg-red-600'
  const headerBgBar = dexView === 'national' ? 'bg-indigo-900' : 'bg-red-800'
  const headerSubtext = dexView === 'national' ? 'text-indigo-200' : 'text-red-200'
  const base = import.meta.env.BASE_URL
  const coverImage = filterVersion === 'firered'
    ? `${base}cover-firered.jpg`
    : filterVersion === 'leafgreen'
      ? `${base}cover-leafgreen.jpg`
      : `${base}cover-both.jpg`

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* App header */}
      <header className={`${headerBg} text-white px-4 py-3 flex items-center gap-3 shadow-md`}>
        <img
          src={coverImage}
          alt="Game cover"
          className="h-10 w-auto rounded shadow-md object-cover shrink-0 transition-all duration-300"
        />
        <div>
          <h1 className="text-lg font-bold leading-tight">FireRed / LeafGreen Tracker</h1>
          <p className={`${headerSubtext} text-xs`}>
            {dexView === 'kanto' ? 'Kanto Dex' : 'National Dex'} — {caughtCount} / {total} caught
            {caughtCount === total && total > 0 && ' 🎉'}
          </p>
        </div>
        {/* Progress bar */}
        <div className="flex-1 max-w-xs ml-auto hidden sm:block">
          <div className={`h-2 rounded-full ${headerBgBar} overflow-hidden`}>
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: total ? `${(caughtCount / total) * 100}%` : '0%' }}
            />
          </div>
          <p className={`text-right ${headerSubtext} text-[10px] mt-0.5`}>
            {total ? Math.round((caughtCount / total) * 100) : 0}%
          </p>
        </div>
        {/* Dark mode toggle */}
        <div className="flex items-center gap-1.5 shrink-0 ml-3">
          <span className="text-base select-none">☀️</span>
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none
              ${darkMode ? 'bg-white/30' : 'bg-black/20'}`}
          >
            <span
              className="absolute top-0.5 left-0 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
              style={{ transform: darkMode ? 'translateX(22px)' : 'translateX(2px)' }}
            />
          </button>
          <span className="text-base select-none">🌙</span>
        </div>
      </header>

      {/* Filter bar */}
      <FilterBar totalCount={total} filteredCount={filtered.length} />

      {/* Main grid */}
      <main>
        <PokedexGrid />
      </main>

      {/* Location detail panel */}
      {selectedId && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={clearSelection}
          />
          <LocationPanel />
        </>
      )}
    </div>
  )
}
