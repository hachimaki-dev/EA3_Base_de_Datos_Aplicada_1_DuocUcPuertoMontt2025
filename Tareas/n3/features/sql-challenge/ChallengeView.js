import { ref, computed } from 'vue';
import { useSQLChallenge } from './useSQLChallenge.js';

export default {
    name: 'ChallengeView',
    template: `
        <div class="grid grid-cols-12 gap-6">
            <!-- Sidebar (Modules) -->
            <div class="col-span-3 bg-gray-900 rounded-lg p-4 h-[80vh] overflow-y-auto custom-scrollbar border-2 border-gray-700">
                <div v-for="(module, mIndex) in modules" :key="mIndex" class="mb-4">
                    <h3 class="font-bold text-sm mb-2 text-gray-400 uppercase tracking-wider">{{ module.title }}</h3>
                    <div class="space-y-1">
                        <div v-for="(level, lIndex) in module.levels" :key="lIndex"
                             class="p-2 rounded cursor-pointer text-sm transition-colors flex items-center gap-2"
                             :class="{ 
                                'bg-blue-900 text-white': isCurrent(module, level),
                                'hover:bg-gray-800 text-gray-400': !isCurrent(module, level)
                             }">
                            <span>{{ level.icon }}</span>
                            <span>{{ level.shortTitle }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="col-span-9 flex flex-col gap-6">
                <!-- Header / Story -->
                <div class="bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500 shadow-lg">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h2 class="text-2xl font-bold text-white mb-1">{{ currentLevel.title }}</h2>
                            <div class="text-blue-400 text-sm font-mono">MISION_ID: {{ currentLevelIndex }} / {{ totalLevels }}</div>
                        </div>
                        <div class="text-4xl">{{ currentLevel.icon }}</div>
                    </div>
                    <p class="text-gray-300 italic mb-4">"{{ currentLevel.story }}"</p>
                    
                    <div class="bg-gray-900 p-4 rounded border border-gray-700">
                        <h4 class="text-blue-400 font-bold text-sm mb-2 uppercase">Objetivo:</h4>
                        <p class="text-white">{{ currentLevel.task }}</p>
                    </div>
                </div>

                <!-- Editor Area -->
                <div class="bg-gray-900 rounded-lg border-2 border-gray-700 flex-grow flex flex-col overflow-hidden">
                    <!-- Toolbar -->
                    <div class="bg-gray-800 p-2 flex justify-between items-center border-b border-gray-700">
                        <span class="text-xs text-gray-400 font-mono">SQL_EDITOR_V2.0</span>
                        <div class="flex gap-2">
                            <button @click="showHint = !showHint" class="text-xs bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded">
                                💡 {{ showHint ? 'Ocultar' : 'Mostrar' }} Pista
                            </button>
                            <button @click="toggleSolution" class="text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded">
                                🔓 {{ isUnlocked ? 'Ocultar' : 'Ver' }} Solución
                            </button>
                        </div>
                    </div>

                    <!-- Input -->
                    <textarea 
                        v-model="userQuery"
                        class="w-full h-48 bg-black text-green-400 font-mono p-4 focus:outline-none resize-none"
                        placeholder="SELECT * FROM ..."></textarea>
                    
                    <!-- Feedback Area -->
                    <div v-if="feedback.message" 
                         class="p-3 border-t border-gray-700 font-mono text-sm"
                         :class="feedback.type === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'">
                        {{ feedback.message }}
                    </div>

                    <!-- Actions -->
                    <div class="p-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
                        <button @click="prevLevel" :disabled="currentLevelIndex <= 1" 
                                class="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50">
                            ◀ Anterior
                        </button>
                        
                        <button @click="handleCheck" 
                                class="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg transform hover:scale-105 transition-all">
                            ▶ EJECUTAR QUERY
                        </button>
                        
                        <button @click="nextLevel" :disabled="currentLevelIndex >= totalLevels"
                                class="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50">
                            Siguiente ▶
                        </button>
                    </div>
                </div>

                <!-- Hint Display -->
                <div v-if="showHint" class="bg-yellow-900 text-yellow-100 p-4 rounded border border-yellow-600 animate-fade-in">
                    <strong>💡 PISTA:</strong> {{ currentLevel.hint }}
                </div>
                
                <!-- Solution Display (Password Protected) -->
                <div v-if="showPasswordInput" class="bg-gray-800 p-6 rounded-lg border-2 border-green-500">
                    <h3 class="text-lg font-bold mb-4 text-green-400">🔐 Ingresa la contraseña para ver la solución</h3>
                    <div class="flex gap-2">
                        <input 
                            v-model="passwordAttempt"
                            type="password"
                            @keyup.enter="checkPassword"
                            class="flex-1 bg-gray-900 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-green-500"
                            :class="{ 'border-red-500 animate-shake': passwordError }"
                            placeholder="Contraseña...">
                        <button @click="checkPassword" class="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold">
                            Desbloquear
                        </button>
                        <button @click="showPasswordInput = false" class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded">
                            Cancelar
                        </button>
                    </div>
                    <p v-if="passwordError" class="text-red-400 text-sm mt-2">❌ Contraseña incorrecta</p>
                </div>
                
                <!-- Solution Display (Unlocked) -->
                <div v-if="isUnlocked && !showPasswordInput" class="bg-green-900 text-green-100 p-4 rounded border border-green-600">
                    <div class="flex justify-between items-center mb-2">
                        <strong>✅ SOLUCIÓN:</strong>
                        <button @click="lockSolution" class="text-xs bg-red-600 hover:bg-red-500 px-3 py-1 rounded">
                            🔒 Bloquear
                        </button>
                    </div>
                    <pre class="bg-black p-3 rounded text-green-400 font-mono text-sm overflow-x-auto">{{ currentLevel.solution }}</pre>
                </div>
            </div>
        </div>
    `,
    setup() {
        const {
            currentLevel,
            currentLevelIndex,
            totalLevels,
            userQuery,
            feedback,
            modules,
            checkAnswer,
            nextLevel,
            prevLevel
        } = useSQLChallenge();

        const showHint = ref(false);
        const isUnlocked = ref(false);
        const showPasswordInput = ref(false);
        const passwordAttempt = ref('');
        const passwordError = ref(false);
        const SECRET_KEY = 'prometoaprenderlo';

        const handleCheck = () => {
            const success = checkAnswer();
        };

        const toggleSolution = () => {
            if (isUnlocked.value) {
                lockSolution();
            } else {
                showPasswordInput.value = true;
                passwordAttempt.value = '';
                passwordError.value = false;
            }
        };

        const checkPassword = () => {
            if (passwordAttempt.value.toLowerCase().trim() === SECRET_KEY) {
                isUnlocked.value = true;
                showPasswordInput.value = false;
                passwordError.value = false;
                passwordAttempt.value = '';
            } else {
                passwordError.value = true;
                setTimeout(() => {
                    passwordError.value = false;
                }, 500);
            }
        };

        const lockSolution = () => {
            isUnlocked.value = false;
            showPasswordInput.value = false;
            passwordAttempt.value = '';
        };

        const isCurrent = (module, level) => {
            return level.title === currentLevel.value.title;
        };

        return {
            currentLevel,
            currentLevelIndex,
            totalLevels,
            userQuery,
            feedback,
            modules,
            showHint,
            isUnlocked,
            showPasswordInput,
            passwordAttempt,
            passwordError,
            handleCheck,
            nextLevel,
            prevLevel,
            toggleSolution,
            checkPassword,
            lockSolution,
            isCurrent
        };
    }
};
