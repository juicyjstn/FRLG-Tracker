import { create } from 'zustand'

const LS_KEY = 'frlg-caught-ids'

function loadCaughtIds() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveCaughtIds(set) {
  localStorage.setItem(LS_KEY, JSON.stringify([...set]))
}

export const usePokemonStore = create((set, get) => ({
  // Data
  pokemon: [],
  locations: [],
  loaded: false,

  // Caught tracking
  caughtIds: loadCaughtIds(),

  // Filters
  searchQuery: '',
  filterType: '',
  filterLocation: '',
  filterVersion: '',   // '' | 'firered' | 'leafgreen'
  filterCaught: '',    // '' | 'caught' | 'uncaught'
  sortBy: 'id',        // 'id' | 'name' | 'type'

  // Selected Pokémon for detail panel
  selectedId: null,

  // Actions
  loadData(data) {
    set({ pokemon: data.pokemon, locations: data.locations, loaded: true })
  },

  toggleCaught(id) {
    const ids = new Set(get().caughtIds)
    if (ids.has(id)) {
      ids.delete(id)
    } else {
      ids.add(id)
    }
    saveCaughtIds(ids)
    set({ caughtIds: ids })
  },

  setSearch(q) { set({ searchQuery: q }) },
  setFilterType(t) { set({ filterType: t }) },
  setFilterLocation(l) { set({ filterLocation: l }) },
  setFilterVersion(v) { set({ filterVersion: v }) },
  setFilterCaught(c) { set({ filterCaught: c }) },
  setSortBy(s) { set({ sortBy: s }) },
  selectPokemon(id) { set({ selectedId: id }) },
  clearSelection() { set({ selectedId: null }) },

  resetFilters() {
    set({
      searchQuery: '',
      filterType: '',
      filterLocation: '',
      filterVersion: '',
      filterCaught: '',
      sortBy: 'id',
    })
  },

  getFiltered() {
    const { pokemon, caughtIds, searchQuery, filterType, filterLocation, filterVersion, filterCaught, sortBy } = get()

    let list = pokemon.filter(p => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!p.name.includes(q) && !String(p.id).includes(q)) return false
      }
      if (filterType && !p.types.includes(filterType)) return false
      if (filterLocation) {
        const hasLocation = p.encounters.some(e => e.location === filterLocation || e.area === filterLocation)
        if (!hasLocation) return false
      }
      if (filterVersion) {
        if (p.exclusivity !== 'both' && p.exclusivity !== filterVersion) return false
      }
      if (filterCaught === 'caught' && !caughtIds.has(p.id)) return false
      if (filterCaught === 'uncaught' && caughtIds.has(p.id)) return false
      return true
    })

    list = [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'type') {
        const ta = a.types[0] || ''
        const tb = b.types[0] || ''
        return ta.localeCompare(tb) || a.id - b.id
      }
      return a.id - b.id
    })

    return list
  },
}))
