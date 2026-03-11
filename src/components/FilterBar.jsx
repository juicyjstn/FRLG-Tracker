import { usePokemonStore } from '../store/usePokemonStore'

const TYPES = [
  'normal','fire','water','electric','grass','ice','fighting','poison',
  'ground','flying','psychic','bug','rock','ghost','dragon',
]

export function FilterBar({ totalCount, filteredCount }) {
  const {
    searchQuery, filterType, filterLocation, filterVersion, filterCaught, sortBy,
    locations, setSearch, setFilterType, setFilterLocation, setFilterVersion,
    setFilterCaught, setSortBy, resetFilters,
  } = usePokemonStore()

  const isFiltered = searchQuery || filterType || filterLocation || filterVersion || filterCaught

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
        {/* Row 1: Search + Sort */}
        <div className="flex gap-2 flex-wrap items-center">
          <input
            type="search"
            placeholder="Search name or #..."
            value={searchQuery}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="id">Sort: # (Dex)</option>
            <option value="name">Sort: Name</option>
            <option value="type">Sort: Type</option>
          </select>

          <div className="ml-auto text-sm text-gray-500">
            {isFiltered ? (
              <span>{filteredCount} / {totalCount} shown</span>
            ) : (
              <span>{totalCount} Pokémon</span>
            )}
          </div>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded px-2 py-1 transition-colors"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Row 2: Filters */}
        <div className="flex gap-2 flex-wrap items-center">
          {/* Type filter */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white capitalize"
          >
            <option value="">All Types</option>
            {TYPES.map(t => (
              <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>

          {/* Location filter */}
          <select
            value={filterLocation}
            onChange={e => setFilterLocation(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white max-w-[200px]"
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Version filter */}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden text-sm">
            {[['', 'Both'], ['firered', 'FireRed'], ['leafgreen', 'LeafGreen']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilterVersion(val)}
                className={`px-3 py-1.5 transition-colors whitespace-nowrap
                  ${filterVersion === val
                    ? val === 'firered' ? 'bg-red-600 text-white' : val === 'leafgreen' ? 'bg-green-600 text-white' : 'bg-gray-700 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'}
                  ${val !== '' ? 'border-l border-gray-300' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Caught filter */}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden text-sm">
            {[['', 'All'], ['caught', 'Caught ✓'], ['uncaught', 'Uncaught']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilterCaught(val)}
                className={`px-3 py-1.5 transition-colors
                  ${filterCaught === val
                    ? val === 'caught' ? 'bg-green-500 text-white' : val === 'uncaught' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'}
                  ${val !== '' ? 'border-l border-gray-300' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
