import { useIdle } from '../gamification/useIdle.js';
import { useEconomy } from '../gamification/useEconomy.js';
import { eventBus } from '../../core/services/EventBus.js';

export default {
    name: 'WelcomeBackModal',
    template: `
        <Transition name="modal">
            <div v-if="showWelcomeBack" 
                 class="fixed inset-0 z-[400] flex items-center justify-center bg-black bg-opacity-50"
                 @click="close">
                <div class="bg-gradient-to-br from-purple-900 to-blue-900 p-8 rounded-2xl border-4 border-yellow-400 shadow-2xl max-w-md transform scale-100 animate-bounce"
                     @click.stop>
                    <div class="text-center">
                        <div class="text-6xl mb-4">💤</div>
                        <h2 class="text-3xl font-bold text-yellow-300 mb-2">¡Bienvenido de vuelta!</h2>
                        <p class="text-white text-lg mb-6">
                            Tu Pokémon estuvo entrenando mientras no estabas
                        </p>
                        
                        <div class="bg-black bg-opacity-40 p-6 rounded-lg mb-6">
                            <div class="text-5xl font-bold text-yellow-400 mb-2">
                                +{{ offlineReward }} 💰
                            </div>
                            <div class="text-sm text-gray-300">Idle Farming</div>
                        </div>
                        
                        <button @click="close" 
                                class="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-lg transform hover:scale-105 transition-all">
                            ¡Genial!
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    `,
    setup() {
        const { showWelcomeBack, offlineReward } = useIdle();
        const { earnCoins } = useEconomy();

        // Listen for idle rewards
        eventBus.on('idle-reward', (data) => {
            earnCoins(data.coins, 'idle');
        });

        const close = () => {
            showWelcomeBack.value = false;
        };

        return {
            showWelcomeBack,
            offlineReward,
            close
        };
    }
};
