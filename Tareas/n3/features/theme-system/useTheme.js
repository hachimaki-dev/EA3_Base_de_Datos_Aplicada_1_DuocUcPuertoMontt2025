import { ref, watch } from 'vue';
import { storage } from '../../core/services/StorageService.js';

// Available themes
export const THEMES = [
    { id: 'dark', name: 'Neo Terminal', icon: '🟢', desc: 'Matrix Hacker Style' },
    { id: 'light', name: 'Cyber Pop', icon: '🌸', desc: 'Vaporwave Anime' },
    { id: 'retro', name: 'Bibliotheca', icon: '📜', desc: 'Old School Academic' },
    { id: 'pokemon', name: 'PokeDex Red', icon: '🔴', desc: 'Gotta Catch Em All' },
    { id: 'starwars', name: 'Galactic Empire', icon: '⭐', desc: 'Dark Side Aesthetics' },
    { id: 'nature', name: 'Forest Zen', icon: '🌿', desc: 'Calm Greenery' },
    { id: 'ocean', name: 'Deep Blue', icon: '🌊', desc: 'Underwater Vibes' },
    { id: 'dreamy', name: 'Sweet Dreams', icon: '🦄', desc: 'Pastel & Soft' },
    { id: 'matrix', name: 'The Source', icon: '💊', desc: 'Pure Code' },
    { id: 'dracula', name: 'Vampire Lord', icon: '🧛', desc: 'Dark Purple Theme' },
    { id: 'cyberpunk', name: 'Night City', icon: '🦾', desc: 'High Tech Low Life' },
    { id: 'coffee', name: 'Espresso', icon: '☕', desc: 'Warm & Cozy' },
    { id: 'sunset', name: 'Vapor Sunset', icon: '🌅', desc: 'Warm Gradients' }
];

// Global theme state
const currentTheme = ref(storage.get('theme', 'dark'));

export function useTheme() {
    const setTheme = (themeId) => {
        currentTheme.value = themeId;

        // Apply theme class to body
        if (typeof document !== 'undefined') {
            document.body.className = `theme-${themeId}`;
        }

        save();
    };

    const save = () => {
        storage.set('theme', currentTheme.value);
    };

    // Initialize theme on first load
    if (typeof document !== 'undefined' && currentTheme.value) {
        document.body.className = `theme-${currentTheme.value}`;
    }

    // Watch for changes
    watch(currentTheme, (newTheme) => {
        if (typeof document !== 'undefined') {
            document.body.className = `theme-${newTheme}`;
        }
    });

    return {
        currentTheme,
        themes: THEMES,
        setTheme
    };
}
