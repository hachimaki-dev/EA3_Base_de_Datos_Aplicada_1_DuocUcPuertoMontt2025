/**
 * Servicio de lógica pura para el sistema Pokémon.
 * No depende de Vue ni del estado reactivo.
 */
export class PokemonService {

    /**
     * Calcula los stats basados en baseStats y nivel
     * @param {Object} baseStats 
     * @param {number} level 
     * @returns {Object} Calculated stats
     */
    static calculateStats(baseStats, level) {
        return {
            hp: Math.floor(baseStats.hp * (1 + level / 10)),
            attack: Math.floor(baseStats.attack * (1 + level / 10)),
            defense: Math.floor(baseStats.defense * (1 + level / 10)),
            speed: Math.floor(baseStats.speed * (1 + level / 10))
        };
    }

    /**
     * Calcula XP necesaria para el siguiente nivel
     * @param {number} level 
     * @returns {number} XP needed
     */
    static getXpForNextLevel(level) {
        return level * 100;
    }

    /**
     * Obtiene datos de un Pokémon aleatorio de la API
     * @param {number} id - Pokemon ID (1-151)
     */
    static async fetchPokemon(id) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();

            return {
                id: data.id,
                name: data.name,
                sprite: data.sprites.front_default,
                animatedSprite: data.sprites.versions['generation-v']['black-white'].animated.front_default || data.sprites.front_default,
                types: data.types.map(t => t.type.name),
                baseStats: {
                    hp: data.stats[0].base_stat,
                    attack: data.stats[1].base_stat,
                    defense: data.stats[2].base_stat,
                    speed: data.stats[5].base_stat
                }
            };
        } catch (error) {
            console.error('Error fetching Pokemon:', error);
            return null;
        }
    }
}
