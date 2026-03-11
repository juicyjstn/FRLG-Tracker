![pokemon-firered-and-leafgreen-cover cover_large](https://github.com/user-attachments/assets/f090923e-2baa-4bca-8f3f-f8c983fb8651)

# FireRed / LeafGreen Tracker

A Pokédex and encounter tracker for **Pokémon FireRed & LeafGreen**, usable in the browser.

🔗 **Live app:** [juicyjstn.github.io/FRLG-Tracker](https://juicyjstn.github.io/FRLG-Tracker/)

---

## Features

### 📋 Pokédex with Tracking
- Browse all **211 Pokémon** available in FireRed & LeafGreen — full Kanto Dex (1–151) plus every non-Kanto species with an in-game encounter
- Mark each Pokémon as **caught** — progress is saved locally in your browser
- Cry audio plays when you mark a Pokémon as caught
- Filter by **FireRed-only**, **LeafGreen-only**, or both version exclusives
- Switch between **Kanto Dex** (151) and **National Dex** (all 211) views
- Progress bar shows how much of the active dex you've caught

### 🔍 Per-Pokémon Detail Panel
Click any Pokémon to open its detail panel:

**Encounter Data**
- All wild encounter locations with method (walk, surf, fishing, etc.), level range, encounter rate, and version availability
- Locations sorted by level — earliest-game encounters first
- Evolution method shown for Pokémon obtained by evolving

**Pokédex Entry**
- Both FireRed and LeafGreen Pokédex flavor text entries, each labeled with a version badge
- Egg groups
- Base stat bars (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed) with numeric values and BST total

**Evolution Chain**
- Visual sprite chain with evolution method labels (level, stone, trade, friendship)
- Click any Pokémon in the chain to jump directly to its entry

**Learnset** *(Gen 3 accurate)*
- Level-up moves with levels
- TM/HM compatibility with disc labels (TM01–TM50, HM01–HM07)
- Move Tutor moves
- Egg moves

### 🎨 UI
- Dark mode (default on) with toggle
- Cover art changes to match the active version filter
- Sidebar floats over the Pokémon grid without shifting the layout

---

## Data Sources

- Encounter data, learnsets, stats, and Pokédex entries are fetched from [PokéAPI](https://pokeapi.co/)
- All data is **Gen 3 specific** — types (no Fairy), moves, and learnsets reflect FireRed & LeafGreen
