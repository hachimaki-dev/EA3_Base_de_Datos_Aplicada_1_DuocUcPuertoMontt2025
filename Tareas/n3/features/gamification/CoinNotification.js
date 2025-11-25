import { ref } from 'vue';
import { eventBus } from '../../core/services/EventBus.js';

export default {
    name: 'CoinNotification',
    template: `
        <Transition name="fade">
            <div v-if="show" 
                 class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[350] text-6xl font-bold pointer-events-none"
                 style="color: #ffd700; text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);">
                <div class="animate-ping">
                    +{{ amount }} 💰
                </div>
            </div>
        </Transition>
    `,
    setup() {
        const show = ref(false);
        const amount = ref(0);

        // Listen for coin notifications
        eventBus.on('coin-notification', (data) => {
            amount.value = data.amount;
            show.value = true;

            setTimeout(() => {
                show.value = false;
            }, 2000);
        });

        return {
            show,
            amount
        };
    }
};
