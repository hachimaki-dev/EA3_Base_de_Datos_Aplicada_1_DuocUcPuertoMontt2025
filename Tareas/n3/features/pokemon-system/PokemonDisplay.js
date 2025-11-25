import { ref, computed } from 'vue';
import { usePokemon } from './usePokemon.js';
import { eventBus } from '../../core/services/EventBus.js';

export default {
    name: 'PokemonDisplay',
    template: `
        <div class="fixed bottom-6 right-6 z-50 cursor-pointer transform transition-all duration-300 hover:scale-110">
            <!-- Egg State -->
            <div v-if="isEgg" @click="hatch" class="relative">
                <div class="w-20 h-20 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4"
                    style="background: linear-gradient(to bottom right, var(--bg-card), var(--input-bg)); border-color: var(--accent);">
                    🥚
                </div>
                <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    Click to Hatch (Debug)
                </div>
            </div>

            <!-- Pokemon State -->
            <div v-else class="relative group" @click="train">
                <!-- Critical Hit Effect -->
                <div v-if="showCritical" 
                     class="absolute inset-0 bg-yellow-400 rounded-full opacity-75 animate-ping pointer-events-none z-20"></div>
                
                <!-- Energy Badge -->
                <div class="absolute -top-1 -left-1 bg-blue-500 text-white text-xs rounded-full px-2 py-1 font-bold shadow-lg z-10">
                    ⚡{{ pokemon.energy }}
                </div>

                <!-- Avatar -->
                <div class="w-24 h-24 rounded-full border-4 overflow-hidden bg-white shadow-2xl relative"
                     style="border-color: var(--accent);">
                    <img :src="pokemon.species.animatedSprite || pokemon.species.sprite" 
                         class="w-full h-full object-contain p-2" />
                </div>
                
                <!-- Level Badge -->
                <div class="absolute -bottom-2 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full border-2 border-white">
                    Lv.{{ pokemon.level }}
                </div>
                
                <!-- XP Bar (Tooltip) -->
                <div class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-32 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div class="bg-gray-800 text-white text-xs rounded p-2 text-center">
                        <div class="mb-1">{{ pokemon.species.name }}</div>
                        <div class="h-2 bg-gray-600 rounded-full overflow-hidden">
                            <div class="h-full bg-blue-500" :style="{ width: progressPercent + '%' }"></div>
                        </div>
                        <div class="mt-1">{{ Math.floor(pokemon.xp) }} / {{ xpToNextLevel }} XP</div>
                    </div>
                </div>
            </div>
        </div>
    `,
    setup() {
        const { pokemon, isEgg, xpToNextLevel, progressPercent, hatch, train } = usePokemon();
        const showCritical = ref(false);

        // Listen for critical hits
        eventBus.on('click-train', (data) => {
            if (data.critical) {
                showCritical.value = true;
                setTimeout(() => {
                    showCritical.value = false;
                }, 1000);
            }
        });

        return {
            pokemon,
            isEgg,
            xpToNextLevel,
            progressPercent,
            hatch,
            train,
            showCritical
        };
    }
};
