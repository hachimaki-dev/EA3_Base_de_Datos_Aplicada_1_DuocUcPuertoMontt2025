import { ref, computed, watch, readonly } from 'vue';
import { storage } from '../../core/services/StorageService.js';
import { eventBus } from '../../core/services/EventBus.js';
import { SQLValidator } from './SQLValidator.js';
import { modules } from '../../assets/data/modules.js';
import { EVENTS, STORAGE_KEYS } from '../../core/utils/constants.js';
import { useCombo } from '../gamification/useCombo.js';

// Global State
const currentLevelIndex = ref(storage.get(STORAGE_KEYS.PROGRESS, 1));
const userQuery = ref('');
const feedback = ref({ message: '', type: '' });

export function useSQLChallenge() {
    // Get combo system
    const { combo, multiplier, incrementCombo, resetCombo } = useCombo();

    // --- Computed ---

    // Flatten levels for easier navigation
    const allLevels = computed(() => {
        return modules.flatMap((module, mIndex) =>
            module.levels.map((level, lIndex) => ({
                ...level,
                moduleTitle: module.title,
                theory: module.theory,
                mIndex,
                lIndex,
                globalIndex: 0 // Calculated below
            }))
        ).map((level, index) => ({ ...level, globalIndex: index + 1 }));
    });

    const currentLevel = computed(() => {
        return allLevels.value.find(l => l.globalIndex === currentLevelIndex.value) || allLevels.value[0];
    });

    const totalLevels = computed(() => allLevels.value.length);

    const progressPercent = computed(() => {
        return (currentLevelIndex.value / totalLevels.value) * 100;
    });

    // --- Actions ---

    const checkAnswer = () => {
        if (!userQuery.value) {
            setFeedback("Por favor escribe una consulta SQL.", "error");
            return false;
        }

        const isValid = SQLValidator.validate(userQuery.value, currentLevel.value.solution);

        if (isValid) {
            // Increment combo
            incrementCombo();

            // Check if this is the first success ever - trigger hatch
            const firstSuccess = storage.get('first_sql_success', false);

            if (!firstSuccess) {
                setFeedback("¡Correcto! Tu huevo está eclosionando...", "success");
                storage.set('first_sql_success', true);

                // Emit hatch event
                eventBus.emit(EVENTS.POKEMON_HATCHED, { trigger: 'first_challenge' });
            } else {
                // Apply combo multiplier to rewards
                const baseXP = 50;
                const baseCoins = 30;
                const finalXP = Math.floor(baseXP * multiplier.value);
                const finalCoins = Math.floor(baseCoins * multiplier.value);

                setFeedback(`¡Correcto! ${finalXP} XP y ${finalCoins} 💰! ${combo.value > 1 ? `🔥 Combo ×${multiplier.value}` : ''}`, "success");

                // Emit rewards for subsequent challenges
                eventBus.emit('sql-success', {
                    xp: finalXP,
                    coins: finalCoins,
                    level: currentLevelIndex.value
                });
            }

            return true;
        } else {
            // Reset combo on failure
            resetCombo();
            setFeedback("Consulta incorrecta. ¡Combo perdido!", "error");
            return false;
        }
    };

    const nextLevel = () => {
        if (currentLevelIndex.value < totalLevels.value) {
            currentLevelIndex.value++;
            userQuery.value = '';
            feedback.value = { message: '', type: '' };
            save();
        }
    };

    const prevLevel = () => {
        if (currentLevelIndex.value > 1) {
            currentLevelIndex.value--;
            userQuery.value = '';
            feedback.value = { message: '', type: '' };
            save();
        }
    };

    const setFeedback = (msg, type) => {
        feedback.value = { message: msg, type };
    };

    const save = () => {
        storage.set(STORAGE_KEYS.PROGRESS, currentLevelIndex.value);
    };

    // --- Watchers ---
    watch(currentLevelIndex, () => save());

    return {
        currentLevel,
        currentLevelIndex,
        totalLevels,
        userQuery,
        feedback,
        progressPercent,
        modules, // Export raw modules for sidebar
        checkAnswer,
        nextLevel,
        prevLevel
    };
}
