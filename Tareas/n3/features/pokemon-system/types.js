/**
 * @typedef {Object} PokemonStats
 * @property {number} hp
 * @property {number} attack
 * @property {number} defense
 * @property {number} speed
 */

/**
 * @typedef {Object} PokemonSpecies
 * @property {number} id
 * @property {string} name
 * @property {string} sprite
 * @property {string} animatedSprite
 * @property {string[]} types
 * @property {PokemonStats} baseStats
 */

/**
 * @typedef {Object} PokemonState
 * @property {boolean} exists
 * @property {boolean} isEgg
 * @property {PokemonSpecies|null} species
 * @property {number} level
 * @property {number} xp
 * @property {PokemonStats|null} stats
 * @property {number} energy
 * @property {number} maxEnergy
 * @property {string|null} hatchedAt
 */
