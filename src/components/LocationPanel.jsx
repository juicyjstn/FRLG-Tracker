import { usePokemonStore } from '../store/usePokemonStore'
import { TYPE_COLORS, TYPE_TEXT } from './typeColors'

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
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-gray-200 flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50">
        {p.sprite && (
          <img src={p.sprite} alt={p.name} className="w-14 h-14 object-contain image-rendering-pixelated" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">#{String(p.id).padStart(3, '0')}</span>
            {p.exclusivity === 'firered' && (
              <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-red-600 text-white leading-none">FR only</span>
            )}
            {p.exclusivity === 'leafgreen' && (
              <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-green-600 text-white leading-none">LG only</span>
            )}
          </div>
          <h2 className="text-base font-bold capitalize text-gray-900 truncate">{p.name}</h2>
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
          className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-1 shrink-0"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Caught toggle */}
      <div className="px-4 py-2 border-b border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={caught}
            onChange={() => toggleCaught(p.id)}
            className="w-4 h-4 accent-green-500"
          />
          <span className={`text-sm font-medium ${caught ? 'text-green-600' : 'text-gray-500'}`}>
            {caught ? 'Caught ✓' : 'Not caught'}
          </span>
        </label>
      </div>

      {/* Location list */}
      <div className="flex-1 overflow-y-auto p-3">
        {locationGroups.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-8">No encounter data found for FRLG.</p>
        ) : (
          <div className="space-y-3">
            {locationGroups.map(([location, encs]) => (
              <div key={location} className="rounded-lg border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  {location}
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-3 py-1 text-gray-400 font-medium">Method</th>
                      <th className="text-center px-2 py-1 text-gray-400 font-medium">Lvl</th>
                      <th className="text-center px-2 py-1 text-gray-400 font-medium">%</th>
                      <th className="text-right px-3 py-1 text-gray-400 font-medium">Ver</th>
                    </tr>
                  </thead>
                  <tbody>
                    {encs.map((enc, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        <td className="px-3 py-1.5">
                          <span className="mr-1">{METHOD_ICON[enc.method] || '•'}</span>
                          {enc.methodDisplay}
                          {enc.notes && (
                            <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{enc.notes}</div>
                          )}
                        </td>
                        <td className="text-center px-2 py-1.5 text-gray-600">
                          {enc.minLevel != null
                            ? enc.minLevel === enc.maxLevel
                              ? enc.minLevel
                              : `${enc.minLevel}–${enc.maxLevel}`
                            : '—'}
                        </td>
                        <td className="text-center px-2 py-1.5 text-gray-600">
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
        )}
      </div>
    </div>
  )
}
