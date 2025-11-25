import { createApp, ref, provide, onMounted } from 'vue';
import { storage } from './core/services/StorageService.js';
import { eventBus } from './core/services/EventBus.js';
import { APP_NAME, APP_VERSION } from './core/utils/constants.js';
import PokemonDisplay from './features/pokemon-system/PokemonDisplay.js';
import ChallengeView from './features/sql-challenge/ChallengeView.js';
import CoinNotification from './features/gamification/CoinNotification.js';
import EconomyBar from './features/gamification/EconomyBar.js';
import WelcomeBackModal from './features/gamification/WelcomeBackModal.js';
import ThemeSelector from './features/theme-system/ThemeSelector.js';
import { useIdle } from './features/gamification/useIdle.js';
import { usePokemon } from './features/pokemon-system/usePokemon.js';

// Root Component
const App = {
    components: {
        PokemonDisplay,
        ChallengeView,
        CoinNotification,
        EconomyBar,
        WelcomeBackModal,
        ThemeSelector
    },
    setup() {
        // Provide global services
        provide('storage', storage);
        provide('eventBus', eventBus);

        const isLoaded = ref(false);
        const { checkOfflineRewards } = useIdle();
        const { pokemon } = usePokemon();

        // Simulate loading
        setTimeout(() => {
            isLoaded.value = true;

            // Check for offline rewards after load
            setTimeout(() => {
                if (pokemon.value.exists) {
                    checkOfflineRewards(pokemon.value.level);
                }
            }, 500);
        }, 1000);

        return {
            isLoaded,
            appName: APP_NAME,
            version: APP_VERSION
        };
    },
    template: `
        <div v-if="isLoaded" class="container mx-auto px-4 py-6 max-w-6xl">
            <header class="flex justify-between items-center mb-8 border-b-2 pb-4" style="border-color: var(--border-color)">
                <div>
                    <h1 class="text-4xl font-bold hacker-font">{{ appName }}</h1>
                    <p class="text-sm opacity-70">v{{ version }}</p>
                </div>
                <div class="flex items-center gap-3">
                    <EconomyBar />
                    <ThemeSelector />
                </div>
            </header>
            
            <main>
                <ChallengeView />
            </main>
            
            <!-- Floating Components -->
            <PokemonDisplay />
            <CoinNotification />
            <WelcomeBackModal />
        </div>
        <div v-else class="flex items-center justify-center min-h-screen">
            Loading...
        </div>
    `
};

// Mount App
const app = createApp(App);
app.mount('#app');

console.log(`[${APP_NAME}] System initialized v${APP_VERSION}`);
