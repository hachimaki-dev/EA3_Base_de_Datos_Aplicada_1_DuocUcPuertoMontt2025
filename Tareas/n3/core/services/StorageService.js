/**
 * Servicio robusto para manejo de LocalStorage con prefijos y manejo de errores.
 * Framework-agnostic: puede usarse fuera de Vue.
 */
export class StorageService {
    constructor(prefix = 'sql_tinder_') {
        this.prefix = prefix;
    }

    /**
     * Recupera un valor tipado del storage
     * @param {string} key - Clave del item
     * @param {*} defaultValue - Valor por defecto si no existe o falla
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`[Storage] Error reading key "${key}":`, error);
            return defaultValue;
        }
    }

    /**
     * Guarda un valor serializado
     * @param {string} key - Clave del item
     * @param {*} value - Valor a guardar
     */
    set(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(this.prefix + key, serialized);
            return true;
        } catch (error) {
            console.error(`[Storage] Error saving key "${key}":`, error);
            return false;
        }
    }

    remove(key) {
        localStorage.removeItem(this.prefix + key);
    }

    clear() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }
}

// Exportamos una instancia por defecto para uso general
export const storage = new StorageService();
