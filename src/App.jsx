import { useEffect } from 'react'
import { usePokemonStore } from './store/usePokemonStore'
import { FilterBar } from './components/FilterBar'
import { PokedexGrid } from './components/PokedexGrid'
import { LocationPanel } from './components/LocationPanel'
import pokedexData from './data/frlg-pokemon.json'

export default function App() {
  const { loadData, caughtIds, pokemon, loaded, selectedId, clearSelection, getFiltered } = usePokemonStore()

  useEffect(() => {
    loadData(pokedexData)
  }, [])

  const filtered = getFiltered()
  const caughtCount = [...caughtIds].filter(id => pokemon.some(p => p.id === id)).length

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">⏳</div>
          <p>Loading Pokédex...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 transition-all ${selectedId ? 'pr-80' : ''}`}>
      {/* App header */}
      <header className="bg-red-600 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <span className="text-2xl">🔴</span>
        <div>
          <h1 className="text-lg font-bold leading-tight">FireRed / LeafGreen Tracker</h1>
          <p className="text-red-200 text-xs">
            {caughtCount} / {pokemon.length} caught
            {caughtCount === pokemon.length && pokemon.length > 0 && ' 🎉'}
          </p>
        </div>
        {/* Progress bar */}
        <div className="flex-1 max-w-xs ml-auto hidden sm:block">
          <div className="h-2 rounded-full bg-red-800 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: pokemon.length ? `${(caughtCount / pokemon.length) * 100}%` : '0%' }}
            />
          </div>
          <p className="text-right text-red-200 text-[10px] mt-0.5">
            {pokemon.length ? Math.round((caughtCount / pokemon.length) * 100) : 0}%
          </p>
        </div>
      </header>

      {/* Filter bar */}
      <FilterBar totalCount={pokemon.length} filteredCount={filtered.length} />

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
