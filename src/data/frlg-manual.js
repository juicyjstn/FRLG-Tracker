// Manually curated FRLG data for Pokémon not covered by PokeAPI encounter data.
// Each entry uses the same shape as API encounter data so it merges cleanly.
//
// obtainMethods: array of { location, method, methodDisplay, versions, notes }
//   - versions: 'both' | 'firered' | 'leafgreen'
//   - method: 'gift' | 'trade' | 'static' | 'walk' | 'surf' | etc.

export const manualData = {
  // --- STARTERS ---
  1: { // Bulbasaur
    obtainMethods: [{ location: 'Pallet Town', area: 'pallet-town', method: 'gift', methodDisplay: 'Gift', versions: 'both', notes: "Choose as starter from Prof. Oak (1 of 3 choices)" }],
  },
  4: { // Charmander
    obtainMethods: [{ location: 'Pallet Town', area: 'pallet-town', method: 'gift', methodDisplay: 'Gift', versions: 'both', notes: "Choose as starter from Prof. Oak (1 of 3 choices)" }],
  },
  7: { // Squirtle
    obtainMethods: [{ location: 'Pallet Town', area: 'pallet-town', method: 'gift', methodDisplay: 'Gift', versions: 'both', notes: "Choose as starter from Prof. Oak (1 of 3 choices)" }],
  },

  // --- FOSSILS ---
  138: { // Omanyte (Dome Fossil)
    obtainMethods: [
      { location: 'Mt. Moon (B2F)', area: 'mt-moon-b2f', method: 'pick-up', methodDisplay: 'Item Pick-up', versions: 'both', notes: "Pick Dome Fossil on Mt. Moon B2F (exclusive choice vs. Helix)" },
      { location: 'Cinnabar Island Lab', area: 'cinnabar-island', method: 'gift', methodDisplay: 'Gift', versions: 'both', notes: "Revived from Dome Fossil at Cinnabar Lab" },
    ],
  },
  140: { // Kabuto (Helix Fossil)
    obtainMethods: [
      { location: 'Mt. Moon (B2F)', area: 'mt-moon-b2f', method: 'pick-up', methodDisplay: 'Item Pick-up', versions: 'both', notes: "Pick Helix Fossil on Mt. Moon B2F (exclusive choice vs. Dome)" },
      { location: 'Cinnabar Island Lab', area: 'cinnabar-island', method: 'gift', methodDisplay: 'Gift', versions: 'both', notes: "Revived from Helix Fossil at Cinnabar Lab" },
    ],
  },
  142: { // Aerodactyl (Old Amber)
    obtainMethods: [
      { location: 'Pewter City Museum', area: 'pewter-city', method: 'pick-up', methodDisplay: 'Item Pick-up', versions: 'both', notes: "Receive Old Amber from scientist in Pewter Museum (back room)" },
      { location: 'Cinnabar Island Lab', area: 'cinnabar-island', method: 'gift', methodDisplay: 'Gift', versions: 'both', notes: "Revived from Old Amber at Cinnabar Lab" },
    ],
  },

  // --- GIFT POKÉMON ---
  25: { // Pikachu — starter in Yellow; in FRLG it's just a wild encounter in Viridian Forest
    // No special manual entry needed; PokeAPI covers wild encounters
  },
  133: { // Eevee
    obtainMethods: [{ location: 'Celadon City', area: 'celadon-city', method: 'gift', methodDisplay: 'Gift', versions: 'both', notes: "Received from on top floor of Celadon Mansion" }],
  },
  106: { // Hitmonlee
    obtainMethods: [{ location: 'Saffron City', area: 'saffron-city', method: 'gift', methodDisplay: 'Gift', versions: 'both', notes: "Choose Hitmonlee from Karate Master in Fighting Dojo (exclusive vs. Hitmonchan)" }],
  },
  107: { // Hitmonchan
    obtainMethods: [{ location: 'Saffron City', area: 'saffron-city', method: 'gift', methodDisplay: 'Gift', versions: 'both', notes: "Choose Hitmonchan from Karate Master in Fighting Dojo (exclusive vs. Hitmonlee)" }],
  },
  131: { // Lapras
    obtainMethods: [{ location: 'Silph Co.', area: 'saffron-city', method: 'gift', methodDisplay: 'Gift', versions: 'both', notes: "Given by Silph Co. employee on 7F after defeating Giovanni" }],
  },
  137: { // Porygon
    obtainMethods: [{ location: 'Celadon City', area: 'celadon-city', method: 'gift', methodDisplay: 'Gift', versions: 'both', notes: "Purchased for 9,999 coins at Celadon Game Corner Prize Corner" }],
  },

  // --- IN-GAME TRADES ---
  83: { // Farfetch'd
    obtainMethods: [{ location: 'Vermilion City', area: 'vermilion-city', method: 'trade', methodDisplay: 'In-Game Trade', versions: 'both', notes: "Trade a Spearow to NPC in Vermilion City house" }],
  },
  122: { // Mr. Mime
    obtainMethods: [{ location: 'Route 2', area: 'route-2', method: 'trade', methodDisplay: 'In-Game Trade', versions: 'both', notes: "Trade an Abra to NPC outside Diglett's Cave entrance on Route 2" }],
  },
  128: { // Tauros — FR: get via trade
    obtainMethods: [
      { location: 'Route 16', area: 'route-16', method: 'trade', methodDisplay: 'In-Game Trade', versions: 'firered', notes: "Trade a Slowpoke to NPC on Route 16 (FireRed)" },
    ],
  },
  // Jynx trade
  124: { // Jynx
    obtainMethods: [{ location: 'Cerulean City', area: 'cerulean-city', method: 'trade', methodDisplay: 'In-Game Trade', versions: 'both', notes: "Trade a Poliwhirl to NPC in Cerulean City house" }],
  },

  // --- LEGENDARY / STATIC ENCOUNTERS ---
  // Note: PokeAPI covers most of these as wild encounters, but adding notes for clarity
  144: { // Articuno
    obtainMethods: [{ location: 'Seafoam Islands', area: 'seafoam-islands', method: 'static', methodDisplay: 'Static', versions: 'both', notes: "Lv.50 — found in Seafoam Islands B4F; requires Strength & Surf" }],
  },
  145: { // Zapdos
    obtainMethods: [{ location: 'Power Plant', area: 'power-plant', method: 'static', methodDisplay: 'Static', versions: 'both', notes: "Lv.50 — found deep in Power Plant on Route 10; requires Surf" }],
  },
  146: { // Moltres
    obtainMethods: [{ location: 'Mt. Ember', area: 'one-island', method: 'static', methodDisplay: 'Static', versions: 'both', notes: "Lv.50 — found at top of Mt. Ember on One Island (post-game)" }],
  },
  150: { // Mewtwo
    obtainMethods: [{ location: 'Cerulean Cave', area: 'cerulean-city', method: 'static', methodDisplay: 'Static', versions: 'both', notes: "Lv.70 — found in Cerulean Cave B1F; requires all 8 badges" }],
  },
  151: { // Mew
    obtainMethods: [{ location: 'Nintendo Event', area: 'special-event', method: 'gift', methodDisplay: 'Event', versions: 'both', notes: "Obtained via Nintendo Mystery Gift event (no longer available)" }],
  },
}

// Version-exclusive Pokémon in FRLG (wild encounters)
// This supplements PokeAPI data which may not always mark exclusivity clearly.
export const versionExclusives = {
  firered: [23, 24, 43, 44, 45, 54, 55, 58, 59, 123, 125],
  // Ekans, Arbok, Oddish, Gloom, Vileplume, Psyduck, Golduck, Growlithe, Arcanine, Scyther, Electabuzz
  leafgreen: [27, 28, 37, 38, 52, 53, 69, 70, 71, 126, 127],
  // Sandshrew, Sandslash, Vulpix, Ninetales, Meowth, Persian, Bellsprout, Weepinbell, Victreebel, Magmar, Pinsir
}
