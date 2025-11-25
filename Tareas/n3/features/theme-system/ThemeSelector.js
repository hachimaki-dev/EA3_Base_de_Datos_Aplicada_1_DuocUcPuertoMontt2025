import { ref, computed } from 'vue';
import { useTheme } from './useTheme.js';

export default {
    name: 'ThemeSelector',
    template: `
        <div>
            <!-- Theme Button -->
            <button @click="showModal = true" 
                    class="px-4 py-2 rounded-lg font-bold transition-all transform hover:scale-105"
                    style="background-color: var(--accent); color: var(--bg);">
                🎨 Tema
            </button>

            <!-- Theme Modal -->
            <Transition name="modal">
                <div v-if="showModal" 
                     class="fixed inset-0 z-[500] flex items-center justify-center bg-black bg-opacity-75"
                     @click="showModal = false">
                    <div class="rounded-2xl p-8 max-w-4xl w-full mx-4 border-4 shadow-2xl overflow-y-auto max-h-[90vh]"
                         style="background-color: var(--bg-card); border-color: var(--accent);"
                         @click.stop>
                        
                        <!-- Header -->
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-3xl font-bold" style="color: var(--text);">
                                🎨 Selector de Temas
                            </h2>
                            <button @click="showModal = false" 
                                    class="text-3xl opacity-70 hover:opacity-100 transition-opacity"
                                    style="color: var(--text);">
                                ✕
                            </button>
                        </div>

                        <!-- Theme Grid -->
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div v-for="theme in themes" 
                                 :key="theme.id"
                                 @click="selectTheme(theme.id)"
                                 class="p-4 rounded-lg cursor-pointer transition-all transform hover:scale-105 border-2"
                                 :class="{ 'ring-4 ring-offset-2': currentTheme === theme.id }"
                                 :style="{ 
                                     borderColor: currentTheme === theme.id ? 'var(--accent)' : 'transparent',
                                     backgroundColor: 'var(--input-bg)',
                                     ringColor: 'var(--accent)'
                                 }">
                                <div class="text-center">
                                    <div class="text-4xl mb-2">{{ theme.icon }}</div>
                                    <div class="font-bold mb-1" style="color: var(--text);">
                                        {{ theme.name }}
                                    </div>
                                    <div class="text-xs opacity-70" style="color: var(--text);">
                                        {{ theme.desc }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Current Theme Info -->
                        <div class="mt-6 p-4 rounded-lg text-center" style="background-color: var(--input-bg);">
                            <p class="text-sm opacity-70" style="color: var(--text);">
                                Tema actual: <strong>{{ currentThemeName }}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    `,
    setup() {
        const { currentTheme, themes, setTheme } = useTheme();
        const showModal = ref(false);

        const selectTheme = (themeId) => {
            setTheme(themeId);
            // Don't close modal immediately, let user see the change
        };

        const currentThemeName = computed(() => {
            const theme = themes.find(t => t.id === currentTheme.value);
            return theme ? theme.name : 'Unknown';
        });

        return {
            showModal,
            currentTheme,
            themes,
            selectTheme,
            currentThemeName
        };
    }
};
