import { create } from 'zustand'
import { evolutionData } from '../data/evolutions'
import { STORY_ORDER } from '../data/story-order'

const LS_KEY = 'frlg-caught-ids'
const LS_DARK_KEY = 'frlg-dark-mode'

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

function loadDarkMode() {
  try {
    return localStorage.getItem(LS_DARK_KEY) !== 'false'
  } catch {
    return true
  }
}

export const usePokemonStore = create((set, get) => ({
  // Data
  pokemon: [],
  locations: [],
  loaded: false,

  // Caught tracking
  caughtIds: loadCaughtIds(),

  // Dex view
  dexView: 'kanto', // 'kanto' | 'national'

  // Dark mode
  darkMode: loadDarkMode(),

  // Filters
  searchQuery: '',
  filterType: '',
  filterLocation: '',
  filterVersion: '',      // '' | 'firered' | 'leafgreen'
  filterCaught: '',       // '' | 'caught' | 'uncaught'
  filterEggGroups: [],    // string[] — OR filter across selected egg group slugs
  sortBy: 'id',           // 'id' | 'name' | 'type' | 'story'

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

  toggleDarkMode() {
    const next = !get().darkMode
    localStorage.setItem(LS_DARK_KEY, next)
    set({ darkMode: next })
  },

  setDexView(v) { set({ dexView: v, selectedId: null }) },
  setSearch(q) { set({ searchQuery: q }) },
  setFilterType(t) { set({ filterType: t }) },
  setFilterLocation(l) { set({ filterLocation: l }) },
  setFilterVersion(v) { set({ filterVersion: v }) },
  setFilterCaught(c) { set({ filterCaught: c }) },
  setFilterEggGroups(groups) { set({ filterEggGroups: groups }) },
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
      filterEggGroups: [],
      sortBy: 'id',
    })
  },

  // Returns the active dex list (kanto = only #1-151, national = all)
  getActivePokemon() {
    const { pokemon, dexView } = get()
    return dexView === 'kanto'
      ? pokemon.filter(p => p.dex === 'kanto')
      : pokemon // national shows everything
  },

  getFiltered() {
    const { caughtIds, searchQuery, filterType, filterLocation, filterVersion, filterCaught, filterEggGroups, sortBy } = get()
    const base = get().getActivePokemon()

    let list = base.filter(p => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const numMatch = String(p.id).padStart(3, '0').includes(q) || String(p.id).includes(q)
        if (!p.name.includes(q) && !numMatch) return false
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
      if (filterEggGroups.length > 0) {
        if (!filterEggGroups.some(g => p.eggGroups?.includes(g))) return false
      }
      return true
    })

    if (sortBy === 'story') {
      // Each encounter method only becomes usable at a certain point in the story.
      // Clamp the raw location index up to the method's earliest possible story slot
      // so fishing/surf Pokémon aren't ranked ahead of their actual availability.
      // Numbers are approximate positions in the STORY_ORDER array.
      const METHOD_MIN = {
        'old-rod':      20, // Old Rod from Vermilion City (~Badge 3)
        'surf':         47, // Surf from Safari Zone (~Badge 5)
        'good-rod':     46, // Good Rod from Fuchsia City (~Badge 5)
        'super-rod':    73, // Super Rod from Sevii Islands (post-game)
        'roaming-grass':120,// Legendary beasts roam post-National Dex
      }

      // Build a cached lookup: id → earliest story-order index
      // For evolution-only Pokémon (no encounters), walk up the evo chain.
      const cache = new Map()
      const allPokemon = get().pokemon       // full roster for parent lookups
      const getStoryIdx = (id, visited = new Set()) => {
        if (cache.has(id)) return cache.get(id)
        if (visited.has(id)) return Infinity
        visited.add(id)

        const pk = allPokemon.find(p => p.id === id)
        if (!pk) { cache.set(id, Infinity); return Infinity }

        // 1. Try own encounters, clamping each by method availability
        const encIdxes = pk.encounters.flatMap(e => {
          const locIdx = STORY_ORDER.indexOf(e.location)
          if (locIdx === -1) return []
          const methodMin = METHOD_MIN[e.method] ?? 0
          return [Math.max(locIdx, methodMin)]
        })
        if (encIdxes.length > 0) {
          const idx = Math.min(...encIdxes)
          cache.set(id, idx)
          return idx
        }

        // 2. Fall back to pre-evolution (adds 0.5 per evolution step so the
        //    chain clusters just after the base form)
        const parent = evolutionData[id]?.from
        if (parent != null) {
          const parentIdx = getStoryIdx(parent, visited)
          const idx = parentIdx === Infinity ? Infinity : parentIdx + 0.5
          cache.set(id, idx)
          return idx
        }

        cache.set(id, Infinity)
        return Infinity
      }

      list = [...list].sort((a, b) => {
        const ai = getStoryIdx(a.id)
        const bi = getStoryIdx(b.id)
        return ai !== bi ? ai - bi : a.id - b.id
      })
    } else {
      list = [...list].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'type') {
          const ta = a.types[0] || ''
          const tb = b.types[0] || ''
          return ta.localeCompare(tb) || a.id - b.id
        }
        return a.id - b.id
      })
    }

    return list
  },
}))
