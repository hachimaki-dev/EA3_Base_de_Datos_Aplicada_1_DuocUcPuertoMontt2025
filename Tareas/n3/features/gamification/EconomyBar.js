import { useEconomy } from './useEconomy.js';

export default {
    name: 'EconomyBar',
    template: `
        <div class="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border-2 border-yellow-500 shadow-lg">
            <span class="text-2xl">💰</span>
            <div class="flex flex-col">
                <span class="text-yellow-400 font-bold text-lg font-mono">{{ balance }}</span>
                <span class="text-xs text-gray-400">PokéCoins</span>
            </div>
        </div>
    `,
    setup() {
        const { balance } = useEconomy();

        return {
            balance
        };
    }
};
