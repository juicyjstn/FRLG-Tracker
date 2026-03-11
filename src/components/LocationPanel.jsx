import { useState } from 'react'
import { usePokemonStore } from '../store/usePokemonStore'
import { TYPE_COLORS, TYPE_TEXT } from './typeColors'
import { evolutionData, getEvolutionLabel } from '../data/evolutions'

const METHOD_ICON = {
  walk: '🦶',
  surf: '🏊',
  'old-rod': '🎣',
  'good-rod': '🎣',
  'super-rod': '🎣',
  gift: '🎁',
  trade: '🔄',
  static: '⭐',
  'pick-up': '📦',
  'rock-smash': '🪨',
  headbutt: '🌳',
}

function VersionBadge({ versions }) {
  if (versions === 'both') {
    return (
      <span className="flex gap-1">
        <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-red-600 text-white leading-none">FR</span>
        <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-green-600 text-white leading-none">LG</span>
      </span>
    )
  }
  if (versions === 'firered') {
    return <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-red-600 text-white leading-none">FR only</span>
  }
  return <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-green-600 text-white leading-none">LG only</span>
}

export function LocationPanel() {
  const { pokemon, selectedId, clearSelection, caughtIds, toggleCaught } = usePokemonStore()
  const p = pokemon.find(pk => pk.id === selectedId)
  const [encounterOpen, setEncounterOpen] = useState(true)
  const [learnsetOpen, setLearnsetOpen] = useState(false)

  if (!p) return null

  const caught = caughtIds.has(p.id)

  // Group encounters by location for cleaner display
  const byLocation = {}
  for (const enc of p.encounters) {
    const key = enc.location
    if (!byLocation[key]) byLocation[key] = []
    byLocation[key].push(enc)
  }
  const locationGroups = Object.entries(byLocation)

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        {p.sprite && (
          <img src={p.sprite} alt={p.name} className="w-14 h-14 object-contain image-rendering-pixelated" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">#{String(p.id).padStart(3, '0')}</span>
            {p.exclusivity === 'firered' && (
              <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-red-600 text-white leading-none">FR only</span>
            )}
            {p.exclusivity === 'leafgreen' && (
              <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-green-600 text-white leading-none">LG only</span>
            )}
          </div>
          <h2 className="text-base font-bold capitalize text-gray-900 dark:text-gray-100 truncate">{p.name}</h2>
          <div className="flex gap-1 mt-0.5">
            {p.types.map(type => (
              <span
                key={type}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${TYPE_COLORS[type] || 'bg-gray-300'} ${TYPE_TEXT[type] || 'text-white'}`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={clearSelection}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none ml-1 shrink-0"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Caught toggle */}
      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={caught}
            onChange={() => {
              if (!caught && p.cry) {
                const audio = new Audio(p.cry)
                audio.play().catch((error) => console.warn('Failed to play Pokemon cry:', error))
              }
              toggleCaught(p.id)
            }}
            className="w-4 h-4 accent-green-500"
          />
          <span className={`text-sm font-medium ${caught ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
            {caught ? 'Caught ✓' : 'Not caught'}
          </span>
        </label>
      </div>

      {/* Location list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {/* Encounter Data collapsible section */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setEncounterOpen(open => !open)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-900 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-expanded={encounterOpen}
          >
            <span>Encounter Data</span>
            <span className={`transition-transform duration-200 ${encounterOpen ? 'rotate-180' : 'rotate-0'}`}>▼</span>
          </button>

          {encounterOpen && (
            <div className="p-2 space-y-2">
              {/* Evolution info */}
              {evolutionData[p.id] && (
                <div className="rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 px-3 py-2 flex items-center gap-2">
                  <span className="text-lg">🔄</span>
                  <div>
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Obtained by Evolution</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">{getEvolutionLabel(evolutionData[p.id])}</p>
                  </div>
                </div>
              )}

              {locationGroups.length > 0 ? (
                <div className="space-y-2">
                  {locationGroups.map(([location, encs]) => (
                    <div key={location} className="rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        {location}
                      </div>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-100 dark:border-gray-700">
                            <th className="text-left px-3 py-1 text-gray-400 dark:text-gray-500 font-medium">Method</th>
                            <th className="text-center px-2 py-1 text-gray-400 dark:text-gray-500 font-medium">Lvl</th>
                            <th className="text-center px-2 py-1 text-gray-400 dark:text-gray-500 font-medium">%</th>
                            <th className="text-right px-3 py-1 text-gray-400 dark:text-gray-500 font-medium">Ver</th>
                          </tr>
                        </thead>
                        <tbody>
                          {encs.map((enc, i) => (
                            <tr key={i} className="border-b border-gray-50 dark:border-gray-700 last:border-0">
                              <td className="px-3 py-1.5 text-gray-600 dark:text-gray-300">
                                <span className="mr-1">{METHOD_ICON[enc.method] || '•'}</span>
                                {enc.methodDisplay}
                                {enc.notes && (
                                  <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">{enc.notes}</div>
                                )}
                              </td>
                              <td className="text-center px-2 py-1.5 text-gray-600 dark:text-gray-300">
                                {enc.minLevel != null
                                  ? enc.minLevel === enc.maxLevel
                                    ? enc.minLevel
                                    : `${enc.minLevel}–${enc.maxLevel}`
                                  : '—'}
                              </td>
                              <td className="text-center px-2 py-1.5 text-gray-600 dark:text-gray-300">
                                {enc.chance != null ? `${enc.chance}%` : '—'}
                              </td>
                              <td className="px-3 py-1.5 text-right">
                                <VersionBadge versions={enc.versions} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ) : !evolutionData[p.id] ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No encounter data found for FRLG.</p>
              ) : null}
            </div>
          )}
        </div>

        {/* Learnset collapsible section */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setLearnsetOpen(open => !open)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-900 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-expanded={learnsetOpen}
          >
            <span>Learnset</span>
            <span className={`transition-transform duration-200 ${learnsetOpen ? 'rotate-180' : 'rotate-0'}`}>▼</span>
          </button>

          {learnsetOpen && (
            <div className="p-2 space-y-3">
              {/* Level Up moves */}
              {p.learnset?.levelUp?.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1 pb-1">Level Up</div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <th className="text-center px-2 py-1 text-gray-400 dark:text-gray-500 font-medium w-10">Lvl</th>
                        <th className="text-left px-3 py-1 text-gray-400 dark:text-gray-500 font-medium">Move</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.learnset.levelUp.map((entry, i) => (
                        <tr key={`${entry.level}-${entry.move}-${i}`} className="border-b border-gray-50 dark:border-gray-700 last:border-0">
                          <td className="text-center px-2 py-1.5 text-gray-400 dark:text-gray-500">{entry.level === 0 ? '—' : entry.level}</td>
                          <td className="px-3 py-1.5 text-gray-600 dark:text-gray-300">{entry.move}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TM/HM moves */}
              {p.learnset?.tmhm?.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1 pb-1">TM / HM</div>
                  <div className="flex flex-wrap gap-1 px-1">
                    {p.learnset.tmhm.map((move) => (
                      <span key={move} className="text-[10px] px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                        {move}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Move Tutor moves */}
              {p.learnset?.tutor?.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1 pb-1">Move Tutor</div>
                  <div className="flex flex-wrap gap-1 px-1">
                    {p.learnset.tutor.map((move) => (
                      <span key={move} className="text-[10px] px-1.5 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                        {move}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!p.learnset?.levelUp?.length && !p.learnset?.tmhm?.length && !p.learnset?.tutor?.length && (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No learnset data available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
