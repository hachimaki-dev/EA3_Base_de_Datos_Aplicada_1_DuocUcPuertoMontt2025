import { ref, computed, watch, readonly } from 'vue';
import { storage } from '../../core/services/StorageService.js';
import { eventBus } from '../../core/services/EventBus.js';
import { PokemonService } from './PokemonService.js';
import { EVENTS, STORAGE_KEYS } from '../../core/utils/constants.js';

// Global state (Singleton)
const pokemonState = ref(storage.get(STORAGE_KEYS.POKEMON_STATE, {
    exists: false,
    isEgg: true,
    species: null,
    level: 1,
    xp: 0,
    stats: null,
    energy: 100,
    maxEnergy: 100
}));

export function usePokemon() {
    // --- Setup EventBus Listeners ---
    // Listen for first challenge success to hatch
    eventBus.on(EVENTS.POKEMON_HATCHED, (data) => {
        if (pokemonState.value.exists) return; // Already hatched
        hatch();
    });

    // Listen for SQL success to gain rewards
    eventBus.on('sql-success', (data) => {
        if (!pokemonState.value.exists) return; // Not hatched yet
        gainXP(data.xp || 50);
        // Note: Coins are handled by economy system
    });

    // --- Computed ---
    const isEgg = computed(() => !pokemonState.value.exists);

    const xpToNextLevel = computed(() => {
        return PokemonService.getXpForNextLevel(pokemonState.value.level || 1);
    });

    const progressPercent = computed(() => {
        if (isEgg.value) return 0;
        return Math.min((pokemonState.value.xp / xpToNextLevel.value) * 100, 100);
    });

    // --- Actions ---

    const hatch = async () => {
        // Random ID 1-151
        const randomId = Math.floor(Math.random() * 151) + 1;
        const species = await PokemonService.fetchPokemon(randomId);

        if (species) {
            pokemonState.value = {
                ...pokemonState.value,
                exists: true,
                isEgg: false,
                species: species,
                level: 1,
                xp: 0,
                stats: PokemonService.calculateStats(species.baseStats, 1),
                hatchedAt: new Date().toISOString()
            };

            eventBus.emit(EVENTS.POKEMON_HATCHED, species);
            save();
        }
    };

    const gainXP = (amount) => {
        if (isEgg.value) return;

        pokemonState.value.xp += amount;

        // Level Up Check
        if (pokemonState.value.xp >= xpToNextLevel.value) {
            pokemonState.value.xp -= xpToNextLevel.value;
            pokemonState.value.level++;

            // Recalculate stats
            pokemonState.value.stats = PokemonService.calculateStats(
                pokemonState.value.species.baseStats,
                pokemonState.value.level
            );

            eventBus.emit(EVENTS.LEVEL_UP, pokemonState.value.level);
        }
        save();
    };

    const train = () => {
        if (pokemonState.value.energy > 0) {
            // Critical hit chance (10%)
            const isCritical = Math.random() < 0.1;
            const baseXP = 10;
            const xpGain = isCritical ? baseXP * 3 : baseXP;

            pokemonState.value.energy--;
            gainXP(xpGain);

            // Emit for UI feedback
            eventBus.emit('click-train', { xp: xpGain, critical: isCritical });

            return true;
        }
        return false;
    };

    // --- Energy Regeneration ---
    // Regenerate 1 energy every 30 seconds
    setInterval(() => {
        if (pokemonState.value.energy < pokemonState.value.maxEnergy) {
            pokemonState.value.energy++;
            save();
        }
    }, 30000); // 30 seconds

    const save = () => {
        storage.set(STORAGE_KEYS.POKEMON_STATE, pokemonState.value);
    };

    // --- Watchers ---
    watch(pokemonState, () => {
        save();
    }, { deep: true });

    return {
        pokemon: readonly(pokemonState),
        isEgg,
        xpToNextLevel,
        progressPercent,
        hatch,
        gainXP,
        train
    };
}
