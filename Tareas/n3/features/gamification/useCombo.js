import { ref, computed } from 'vue';
import { storage } from '../../core/services/StorageService.js';
import { eventBus } from '../../core/services/EventBus.js';
import { STORAGE_KEYS } from '../../core/utils/constants.js';

// Global combo state
const comboState = ref(storage.get('combo_state', {
    count: 0,
    bestStreak: 0
}));

export function useCombo() {
    // --- Computed ---
    const combo = computed(() => comboState.value.count);

    const multiplier = computed(() => {
        const count = comboState.value.count;
        if (count === 0) return 1;
        if (count < 3) return 1.5;
        if (count < 5) return 2;
        if (count < 10) return 3;
        return 5; // Max multiplier
    });

    const nextMultiplierAt = computed(() => {
        const count = comboState.value.count;
        if (count < 3) return 3;
        if (count < 5) return 5;
        if (count < 10) return 10;
        return null; // Already at max
    });

    // --- Actions ---
    const incrementCombo = () => {
        comboState.value.count++;

        if (comboState.value.count > comboState.value.bestStreak) {
            comboState.value.bestStreak = comboState.value.count;
        }

        // Emit combo event for UI feedback
        eventBus.emit('combo-update', {
            combo: comboState.value.count,
            multiplier: multiplier.value
        });

        save();
    };

    const resetCombo = () => {
        if (comboState.value.count > 0) {
            eventBus.emit('combo-broken', { lastCombo: comboState.value.count });
        }
        comboState.value.count = 0;
        save();
    };

    const save = () => {
        storage.set('combo_state', comboState.value);
    };

    return {
        combo,
        multiplier,
        nextMultiplierAt,
        bestStreak: computed(() => comboState.value.bestStreak),
        incrementCombo,
        resetCombo
    };
}
