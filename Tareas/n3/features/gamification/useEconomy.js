import { ref, computed, watch, readonly } from 'vue';
import { storage } from '../../core/services/StorageService.js';
import { eventBus } from '../../core/services/EventBus.js';
import { STORAGE_KEYS } from '../../core/utils/constants.js';

// Global economy state
const economyState = ref(storage.get(STORAGE_KEYS.ECONOMY_STATE, {
    pokeCoins: 100,
    totalEarned: 100,
    totalSpent: 0
}));

export function useEconomy() {
    // Listen for coin earning events
    eventBus.on('sql-success', (data) => {
        earnCoins(data.coins || 30, 'challenge');
    });

    // --- Computed ---
    const balance = computed(() => economyState.value.pokeCoins);
    const totalEarned = computed(() => economyState.value.totalEarned);

    // --- Actions ---
    const earnCoins = (amount, source = 'unknown') => {
        economyState.value.pokeCoins += amount;
        economyState.value.totalEarned += amount;

        // Emit notification event
        eventBus.emit('coin-notification', { amount, source });

        save();
    };

    const spendCoins = (amount) => {
        if (economyState.value.pokeCoins >= amount) {
            economyState.value.pokeCoins -= amount;
            economyState.value.totalSpent += amount;
            save();
            return true;
        }
        return false;
    };

    const save = () => {
        storage.set(STORAGE_KEYS.ECONOMY_STATE, economyState.value);
    };

    // --- Watchers ---
    watch(economyState, () => save(), { deep: true });

    return {
        economy: readonly(economyState),
        balance,
        totalEarned,
        earnCoins,
        spendCoins
    };
}
