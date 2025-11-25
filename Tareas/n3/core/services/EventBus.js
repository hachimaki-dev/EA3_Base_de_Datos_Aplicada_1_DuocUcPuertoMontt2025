import { reactive } from 'vue';

/**
 * Sistema de eventos global simple usando la reactividad de Vue.
 * Permite comunicación desacoplada entre módulos.
 */
class EventBus {
    constructor() {
        this.events = reactive({});
    }

    /**
     * Suscribirse a un evento
     * @param {string} event - Nombre del evento
     * @param {Function} handler - Función callback
     * @returns {Function} Función para desuscribirse
     */
    on(event, handler) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(handler);

        // Return unsubscribe function
        return () => this.off(event, handler);
    }

    /**
     * Desuscribirse de un evento
     * @param {string} event - Nombre del evento
     * @param {Function} handler - Función callback a remover
     */
    off(event, handler) {
        if (!this.events[event]) return;

        const index = this.events[event].indexOf(handler);
        if (index > -1) {
            this.events[event].splice(index, 1);
        }
    }

    /**
     * Emitir un evento con datos
     * @param {string} event - Nombre del evento
     * @param {*} data - Datos a pasar a los handlers
     */
    emit(event, data) {
        if (!this.events[event]) return;

        this.events[event].forEach(handler => {
            try {
                handler(data);
            } catch (error) {
                console.error(`[EventBus] Error in handler for event "${event}":`, error);
            }
        });
    }
}

export const eventBus = new EventBus();
