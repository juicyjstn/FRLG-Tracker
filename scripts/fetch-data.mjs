/**
 * FRLG Pokédex Data Compiler
 *
 * Fetches Pokémon data from PokeAPI for all 151 Kanto Pokémon,
 * compiles encounter data for FireRed/LeafGreen, and merges with
 * manually curated data for gifts/trades/statics.
 *
 * Run: node scripts/fetch-data.mjs
 * Output: src/data/frlg-pokemon.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { manualData, versionExclusives } from '../src/data/frlg-manual.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = path.join(__dirname, '../src/data/frlg-pokemon.json')
const DELAY_MS = 250 // Polite delay between API calls

const FRLG_VERSIONS = ['firered', 'leafgreen']

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
}

function getVersionForId(id) {
  if (versionExclusives.firered.includes(id)) return 'firered'
  if (versionExclusives.leafgreen.includes(id)) return 'leafgreen'
  return 'both'
}

/** Prettify raw location area name like "viridian-forest-area" → "Viridian Forest" */
function prettifyLocation(name) {
  return name
    .replace(/-area$/, '')
    .replace(/-\d+f$/, (m) => ` (${m.replace('--', '').replace('-', '').toUpperCase()}F)`)
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

async function fetchPokemon(id) {
  process.stdout.write(`  [${id}/151] Fetching Pokémon #${id}...`)
  const data = await fetchJson(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  process.stdout.write(' data')

  await sleep(DELAY_MS)

  const encountersRaw = await fetchJson(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`)
  process.stdout.write(' encounters')

  // Sprite: prefer Gen-III FRLG sprite, fallback to default
  const sprite =
    data.sprites?.versions?.['generation-iii']?.['firered-leafgreen']?.front_default ||
    data.sprites?.front_default ||
    null

  // Types
  const types = data.types.map(t => t.type.name)

  // Process encounter data for FRLG versions
  const encountersByArea = {}

  for (const enc of encountersRaw) {
    const areaName = enc.location_area.name
    const areaUrl = enc.location_area.url

    for (const versionData of enc.version_details) {
      if (!FRLG_VERSIONS.includes(versionData.version.name)) continue

      const version = versionData.version.name

      for (const detail of versionData.encounter_details) {
        const method = detail.method.name
        const key = `${areaName}::${method}`

        if (!encountersByArea[key]) {
          encountersByArea[key] = {
            area: areaName,
            location: prettifyLocation(areaName),
            method,
            methodDisplay: METHOD_DISPLAY[method] || method,
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

  // Serialize version Sets
  const encounters = Object.values(encountersByArea).map(e => ({
    ...e,
    versions: e.versions.size === 2 ? 'both' : [...e.versions][0],
  }))

  // Merge manual data
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

  const exclusivity = getVersionForId(id)

  console.log(` ✓ (${encounters.length} encounters)`)

  return {
    id,
    name: data.name,
    types,
    sprite,
    exclusivity, // 'both' | 'firered' | 'leafgreen'
    encounters,
  }
}

async function main() {
  console.log('FRLG Pokédex Data Compiler')
  console.log('==========================')
  console.log(`Fetching 151 Pokémon from PokeAPI with ${DELAY_MS}ms delay...\n`)

  const pokemon = []
  let errors = []

  for (let id = 1; id <= 151; id++) {
    try {
      const p = await fetchPokemon(id)
      pokemon.push(p)
      await sleep(DELAY_MS)
    } catch (err) {
      console.error(`  ERROR for #${id}: ${err.message}`)
      errors.push(id)
    }
  }

  if (errors.length > 0) {
    console.warn(`\nWarning: Failed to fetch IDs: ${errors.join(', ')}`)
  }

  // Sort by ID
  pokemon.sort((a, b) => a.id - b.id)

  // Build unique location list for filter dropdown
  const allLocations = [...new Set(
    pokemon.flatMap(p => p.encounters.map(e => e.location))
  )].sort()

  const output = {
    generatedAt: new Date().toISOString(),
    count: pokemon.length,
    locations: allLocations,
    pokemon,
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8')

  console.log(`\nDone! Written to ${OUTPUT_PATH}`)
  console.log(`  Pokémon: ${pokemon.length}`)
  console.log(`  Unique locations: ${allLocations.length}`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
