import { ref, onMounted } from 'vue';
import { storage } from '../../core/services/StorageService.js';
import { eventBus } from '../../core/services/EventBus.js';
import { STORAGE_KEYS } from '../../core/utils/constants.js';

export function useIdle() {
    const showWelcomeBack = ref(false);
    const offlineReward = ref(0);

    // --- Calculate offline rewards ---
    const calculateOfflineRewards = (pokemonLevel) => {
        const now = Date.now();
        const lastOnline = storage.get('last_online', now);
        const minutesOffline = Math.min((now - lastOnline) / 60000, 240); // Max 4 hours

        if (minutesOffline < 1) return 0; // Less than 1 minute, no reward

        const coinsPerMinute = pokemonLevel * 2;
        return Math.floor(minutesOffline * coinsPerMinute);
    };

    // --- Check on mount ---
    const checkOfflineRewards = (pokemonLevel) => {
        if (pokemonLevel === 0) return; // No Pokemon yet

        const reward = calculateOfflineRewards(pokemonLevel);

        if (reward > 0) {
            offlineReward.value = reward;
            showWelcomeBack.value = true;

            // Award coins
            eventBus.emit('idle-reward', { coins: reward });

            // Auto-hide after 5 seconds
            setTimeout(() => {
                showWelcomeBack.value = false;
            }, 5000);
        }
    };

    // --- Track online status ---
    const updateLastOnline = () => {
        storage.set('last_online', Date.now());
    };

    // Update on visibility change (user leaves/returns to tab)
    if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                // User returned, check rewards handled by caller
            } else {
                // User left, save timestamp
                updateLastOnline();
            }
        });

        // Also update periodically while active
        setInterval(updateLastOnline, 30000); // Every 30 seconds
    }

    return {
        showWelcomeBack,
        offlineReward,
        checkOfflineRewards,
        updateLastOnline
    };
}
