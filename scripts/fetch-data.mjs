/**
 * FRLG Pokédex Data Compiler
 *
 * Fetches Pokémon data from PokeAPI:
 *   - IDs 1–151 (Kanto): all included, dex:'kanto'
 *   - IDs 152–386 (Gen 2–3): only included if they have FRLG encounter data, dex:'national'
 *
 * Run: node scripts/fetch-data.mjs
 * Output: src/data/frlg-pokemon.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { manualData, versionExclusives, nationalEvolutionIds, gen3TypeOverrides } from '../src/data/frlg-manual.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = path.join(__dirname, '../src/data/frlg-pokemon.json')
const DELAY_MS = 200

const KANTO_MAX = 151
const NATIONAL_MAX = 386
const FRLG_VERSIONS = ['firered', 'leafgreen']

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
}

function getVersionExclusivity(id) {
  if (versionExclusives.firered.includes(id)) return 'firered'
  if (versionExclusives.leafgreen.includes(id)) return 'leafgreen'
  return 'both'
}

function prettifyLocation(name) {
  return name
    .replace(/-area$/, '')
    .replace(/-(\d+)f$/, (_, n) => ` (${n}F)`)
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const METHOD_DISPLAY = {
  walk: 'Walk',
  surf: 'Surf',
  'old-rod': 'Old Rod',
  'good-rod': 'Good Rod',
  'super-rod': 'Super Rod',
  'rock-smash': 'Rock Smash',
  headbutt: 'Headbutt',
  gift: 'Gift',
  trade: 'Trade',
  static: 'Static',
}

async function fetchPokemon(id, total) {
  process.stdout.write(`  [${String(id).padStart(3)}/${total}] #${id}...`)

  const data = await fetchJson(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  await sleep(DELAY_MS)
  const encountersRaw = await fetchJson(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`)

  const sprite =
    data.sprites?.versions?.['generation-iii']?.['firered-leafgreen']?.front_default ||
    data.sprites?.front_default ||
    null

  const types = gen3TypeOverrides[id] ?? data.types.map(t => t.type.name)

  // Build encounter map, merging FR+LG entries for the same area+method
  const encountersByArea = {}
  for (const enc of encountersRaw) {
    const areaName = enc.location_area.name
    for (const vd of enc.version_details) {
      if (!FRLG_VERSIONS.includes(vd.version.name)) continue
      const version = vd.version.name
      for (const detail of vd.encounter_details) {
        const key = `${areaName}::${detail.method.name}`
        if (!encountersByArea[key]) {
          encountersByArea[key] = {
            area: areaName,
            location: prettifyLocation(areaName),
            method: detail.method.name,
            methodDisplay: METHOD_DISPLAY[detail.method.name] || detail.method.name,
            minLevel: detail.min_level,
            maxLevel: detail.max_level,
            chance: detail.chance,
            versions: new Set([version]),
          }
        } else {
          encountersByArea[key].versions.add(version)
          encountersByArea[key].minLevel = Math.min(encountersByArea[key].minLevel, detail.min_level)
          encountersByArea[key].maxLevel = Math.max(encountersByArea[key].maxLevel, detail.max_level)
          encountersByArea[key].chance = Math.max(encountersByArea[key].chance, detail.chance)
        }
      }
    }
  }

  const encounters = Object.values(encountersByArea).map(e => ({
    ...e,
    versions: e.versions.size === 2 ? 'both' : [...e.versions][0],
  }))

  // Merge manual data (gifts, trades, statics — mainly for Kanto)
  const manual = manualData[id]
  if (manual?.obtainMethods) {
    for (const m of manual.obtainMethods) {
      encounters.push({
        area: m.area,
        location: m.location,
        method: m.method,
        methodDisplay: m.methodDisplay,
        minLevel: m.level || null,
        maxLevel: m.level || null,
        chance: null,
        versions: m.versions,
        notes: m.notes || null,
      })
    }
  }

  process.stdout.write(` ✓ (${encounters.length} enc)\n`)

  return {
    id,
    name: data.name,
    types,
    sprite,
    cry: data.cries?.latest || null,
    exclusivity: getVersionExclusivity(id),
    encounters,
  }
}

async function main() {
  console.log('FRLG Pokédex Data Compiler')
  console.log('==========================')

  const pokemon = []
  const errors = []

  // --- Kanto Dex (1–151): include all ---
  console.log(`\nKanto Dex (1–${KANTO_MAX}):\n`)
  for (let id = 1; id <= KANTO_MAX; id++) {
    try {
      const p = await fetchPokemon(id, KANTO_MAX)
      pokemon.push({ ...p, dex: 'kanto' })
      await sleep(DELAY_MS)
    } catch (err) {
      console.error(`  ERROR #${id}: ${err.message}`)
      errors.push(id)
    }
  }

  // --- National Dex (152–386): only include if they have FRLG encounters ---
  console.log(`\nNational Dex (152–${NATIONAL_MAX}) — including only those with FRLG encounters:\n`)
  for (let id = KANTO_MAX + 1; id <= NATIONAL_MAX; id++) {
    try {
      const p = await fetchPokemon(id, NATIONAL_MAX)
      if (p.encounters.length > 0 || nationalEvolutionIds.includes(id)) {
        pokemon.push({ ...p, dex: 'national' })
      }
      await sleep(DELAY_MS)
    } catch (err) {
      console.error(`  ERROR #${id}: ${err.message}`)
      errors.push(id)
    }
  }

  if (errors.length > 0) {
    console.warn(`\nWarning: Failed to fetch IDs: ${errors.join(', ')}`)
  }

  pokemon.sort((a, b) => a.id - b.id)

  const kantoList = pokemon.filter(p => p.dex === 'kanto')
  const nationalList = pokemon.filter(p => p.dex === 'national')
  const allLocations = [...new Set(pokemon.flatMap(p => p.encounters.map(e => e.location)))].sort()

  const output = {
    generatedAt: new Date().toISOString(),
    kantoCount: kantoList.length,
    nationalCount: nationalList.length,
    locations: allLocations,
    pokemon,
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8')

  console.log(`\nDone! Written to ${OUTPUT_PATH}`)
  console.log(`  Kanto Pokémon: ${kantoList.length}`)
  console.log(`  National-only Pokémon: ${nationalList.length} (${nationalList.map(p => `#${p.id} ${p.name}`).join(', ')})`)
  console.log(`  Unique locations: ${allLocations.length}`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
