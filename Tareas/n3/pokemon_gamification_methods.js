// ================================================================
// 🎮 POKEMON GAMIFICATION SYSTEM - METHODS
// ================================================================
// This file contains all the methods for the expanded Pokemon
// gamification system including economy, achievements, minigames,
// collection, battles, and more.
// ================================================================

const PokemonGamificationMethods = {

    // ============================================================
    // ECONOMY SYSTEM
    // ============================================================

    earnCoins(amount, source = 'unknown') {
        this.economy.pokeCoins += amount;
        this.economy.totalEarned += amount;

        // Show floating coin animation
        this.showFloatingCoinNotification(amount);

        // Check achievements
        this.checkAchievement('rich_trainer');

        this.saveGameState();
    },

    spendCoins(amount) {
        if (this.economy.pokeCoins >= amount) {
            this.economy.pokeCoins -= amount;
            this.economy.totalSpent += amount;
            this.saveGameState();
            return true;
        }
        return false;
    },

    showFloatingCoinNotification(amount) {
        // Trigger floating coin animation
        this.floatingCoinAmount = `+${amount} 💰`;
        this.showFloatingCoin = true;

        setTimeout(() => {
            this.showFloatingCoin = false;
        }, 2000);
    },

    // ============================================================
    // ACHIEVEMENTS SYSTEM
    // ============================================================

    checkAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement || achievement.unlocked) return;

        let shouldUnlock = false;

        switch (achievementId) {
            case 'first_hatch':
                shouldUnlock = this.pokemonState.exists;
                break;
            case 'reach_level_10':
                shouldUnlock = this.pokemonState.level >= 10;
                break;
            case 'reach_level_25':
                shouldUnlock = this.pokemonState.level >= 25;
                break;
            case 'complete_all':
                shouldUnlock = this.currentLevel >= this.totalLevels;
                break;
            case 'rich_trainer':
                shouldUnlock = this.economy.totalEarned >= 5000;
                break;
            case 'click_master':
                if (achievement.progress === undefined) achievement.progress = 0;
                achievement.progress = this.pokemonState.totalClicks || 0;
                shouldUnlock = achievement.progress >= achievement.target;
                break;
            case 'streak_king':
                if (achievement.progress === undefined) achievement.progress = 0;
                achievement.progress = Math.max(achievement.progress, this.pokemonState.streak || 0);
                shouldUnlock = achievement.progress >= achievement.target;
                break;
            case 'win_10_minigames':
                if (achievement.progress === undefined) achievement.progress = 0;
                shouldUnlock = achievement.progress >= achievement.target;
                break;
            case 'collector':
                if (achievement.progress === undefined) achievement.progress = 0;
                achievement.progress = this.collection.length;
                shouldUnlock = achievement.progress >= achievement.target;
                break;
            case 'battle_champion':
                if (achievement.progress === undefined) achievement.progress = 0;
                achievement.progress = this.totalBattlesWon || 0;
                shouldUnlock = achievement.progress >= achievement.target;
                break;
        }

        if (shouldUnlock) {
            this.unlockAchievement(achievementId);
        }
    },

    unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement || achievement.unlocked) return;

        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();

        // Give reward
        this.earnCoins(achievement.reward, 'achievement');

        // Show notification
        this.achievementNotification = achievement;
        setTimeout(() => {
            this.achievementNotification = null;
        }, 5000);

        this.triggerConfetti();
        this.saveGameState();
    },

    // ============================================================
    // IDLE FARMING SYSTEM
    // ============================================================

    startIdleFarming() {
        // Initialize idle farming
        if (!this.pokemonState.lastIdleCheck) {
            this.pokemonState.lastIdleCheck = Date.now();
        }

        // Update idle coins per minute based on active Pokemon stats
        this.updateIdleRate();

        // Check for idle income every 5 seconds
        this.idleInterval = setInterval(() => {
            this.collectIdleCoins();
        }, 5000);
    },

    updateIdleRate() {
        if (!this.pokemonState.exists || !this.pokemonState.stats) {
            this.pokemonState.idleCoinsPerMinute = 0;
            return;
        }

        // Formula: (speed / 10) + (level * 0.5)
        const baseRate = (this.pokemonState.stats.speed / 10) + (this.pokemonState.level * 0.5);

        // Apply boosts
        const boost = this.getActiveBoostMultiplier('idle');
        this.pokemonState.idleCoinsPerMinute = Math.floor(baseRate * boost);
    },

    collectIdleCoins() {
        if (!this.pokemonState.lastIdleCheck || !this.pokemonState.exists) return;

        const now = Date.now();
        const elapsed = now - this.pokemonState.lastIdleCheck;
        const minutes = elapsed / 60000;

        // Calculate coins earned (max 8 hours = 480 minutes)
        const cappedMinutes = Math.min(minutes, 480);
        const coinsEarned = Math.floor(this.pokemonState.idleCoinsPerMinute * cappedMinutes);

        if (coinsEarned > 0) {
            this.earnCoins(coinsEarned, 'idle');
        }

        this.pokemonState.lastIdleCheck = now;
        this.saveGameState();
    },

    // ============================================================
    // ENERGY & CLICKING SYSTEM
    // ============================================================

    startEnergyRegeneration() {
        // Regenerate 1 energy every 30 seconds
        this.energyInterval = setInterval(() => {
            this.regenerateEnergy();
        }, 30000);
    },

    regenerateEnergy() {
        if (this.pokemonState.energy < this.pokemonState.maxEnergy) {
            this.pokemonState.energy = Math.min(
                this.pokemonState.energy + 1,
                this.pokemonState.maxEnergy
            );
            this.saveGameState();
        }
    },

    clickPokemon(event) {
        if (!this.pokemonState.exists || this.pokemonState.energy <= 0) return;

        // Consume energy
        this.pokemonState.energy--;
        this.pokemonState.totalClicks = (this.pokemonState.totalClicks || 0) + 1;

        // Calculate click reward
        const now = Date.now();
        const timeSinceLastClick = this.pokemonState.lastClickTime ? now - this.pokemonState.lastClickTime : 3000;

        // Combo system: if clicked within 2 seconds, increment combo
        if (timeSinceLastClick < 2000) {
            this.pokemonState.clickCombo = Math.min((this.pokemonState.clickCombo || 0) + 1, 50);
        } else {
            this.pokemonState.clickCombo = 0;
        }

        this.pokemonState.lastClickTime = now;

        // Calculate coins with combo multiplier (max 5x)
        let clickPower = this.pokemonState.clickPower || 5;

        // Apply power boost if active
        const boost = this.getActiveBoostMultiplier('click');
        clickPower *= boost;

        const comboMultiplier = 1 + Math.min(this.pokemonState.clickCombo * 0.1, 4);
        const coinsEarned = Math.floor(clickPower * comboMultiplier);

        this.earnCoins(coinsEarned, 'click');

        // Check achievements
        this.checkAchievement('click_master');

        this.saveGameState();
    },

    // ============================================================
    // BOOST SYSTEM
    // ============================================================

    getActiveBoostMultiplier(type) {
        if (!this.economy.activeBoosts) this.economy.activeBoosts = [];

        const now = Date.now();
        let multiplier = 1;

        // Filter expired boosts
        this.economy.activeBoosts = this.economy.activeBoosts.filter(boost => boost.expiresAt > now);

        // Apply active boosts of matching type
        this.economy.activeBoosts.forEach(boost => {
            if (boost.type === type || boost.type === 'all') {
                multiplier *= boost.multiplier;
            }
        });

        return multiplier;
    },

    applyBoost(boostType, multiplier, duration) {
        if (!this.economy.activeBoosts) this.economy.activeBoosts = [];

        this.economy.activeBoosts.push({
            type: boostType,
            multiplier: multiplier,
            expiresAt: Date.now() + duration
        });

        this.saveGameState();
    },

    // ============================================================
    // SHOP SYSTEM
    // ============================================================

    buyItem(itemId) {
        const item = this.shopItems.find(i => i.id === itemId);
        if (!item) return false;

        // Check if can afford
        if (!this.spendCoins(item.cost)) {
            alert('❌ Not enough PokéCoins!');
            return false;
        }

        // Apply item effect
        switch (item.type) {
            case 'consumable':
                this.useConsumableItem(item);
                break;
            case 'boost':
                this.applyBoost(item.id.includes('xp') ? 'xp' : 'click', item.id.includes('xp') ? 2 : 1.5, item.duration);
                alert(`✅ ${item.name} activated!`);
                break;
            case 'unlock':
                this.minigames[item.unlocks].unlocked = true;
                alert(`✅ ${this.minigames[item.unlocks].name} unlocked!`);
                break;
            case 'upgrade':
                // Handle upgrades
                alert(`✅ ${item.name} purchased!`);
                break;
        }

        this.saveGameState();
        return true;
    },

    useConsumableItem(item) {
        switch (item.id) {
            case 'rare_candy':
                if (this.pokemonState.exists) {
                    this.pokemonState.level++;
                    this.pokemonState.stats = this.calculatePokemonStats(
                        this.pokemonState.species.baseStats,
                        this.pokemonState.level
                    );
                    this.updateIdleRate();
                    this.triggerConfetti();
                    alert(`🎉 ${this.pokemonState.species.name} reached level ${this.pokemonState.level}!`);
                }
                break;
            case 'energy_tank':
                this.pokemonState.energy = Math.min(this.pokemonState.energy + 50, this.pokemonState.maxEnergy);
                alert('🔋 Energy restored +50!');
                break;
            case 'evolution_stone':
                // TODO: Implement evolution
                alert('🔮 Evolution stone used!');
                break;
            case 'pokeball':
            case 'greatball':
            case 'masterball':
                this.attemptCapture(item.catchRate);
                break;
        }
    },

    // ============================================================
    // COLLECTION & CAPTURE SYSTEM
    // ============================================================

    async attemptCapture(catchRate) {
        const randomId = Math.floor(Math.random() * 151) + 1;
        const pokemonData = await this.fetchPokemonFromAPI(randomId);
        if (!pokemonData) return;

        const roll = Math.random();
        if (roll <= catchRate) {
            // Success!
            this.collection.push({
                species: pokemonData,
                level: Math.floor(Math.random() * 10) + 1,
                caughtAt: new Date().toISOString(),
                stats: this.calculatePokemonStats(pokemonData.baseStats, 1)
            });

            this.checkAchievement('collector');
            this.triggerConfetti();
            alert(`🎉 You caught ${pokemonData.name}!`);
        } else {
            // Failed
            alert(`😢 ${pokemonData.name} broke free!`);
        }

        this.saveGameState();
    },

    switchActivePokemon(index) {
        if (index < 0 || index >= this.collection.length) return;

        this.activeMonIndex = index;
        this.pokemonState = this.collection[index];
        this.updateIdleRate();
        this.saveGameState();
    },

    // ============================================================
    // MINIGAMES
    // ============================================================

    playRockPaperScissors(playerChoice) {
        const choices = ['rock', 'paper', 'scissors'];
        const aiChoice = choices[Math.floor(Math.random() * choices.length)];

        let result;
        if (playerChoice === aiChoice) {
            result = 'tie';
        } else if (
            (playerChoice === 'rock' && aiChoice === 'scissors') ||
            (playerChoice === 'paper' && aiChoice === 'rock') ||
            (playerChoice === 'scissors' && aiChoice === 'paper')
        ) {
            result = 'win';
            this.minigames.rock_paper_scissors.wins++;
            this.earnCoins(20, 'minigame');
            this.incrementMinigameWins();
        } else {
            result = 'loss';
            this.minigames.rock_paper_scissors.losses++;
        }

        this.saveGameState();
        return { playerChoice, aiChoice, result };
    },

    incrementMinigameWins() {
        const achievement = this.achievements.win_10_minigames;
        if (achievement.progress === undefined) achievement.progress = 0;
        achievement.progress++;
        this.checkAchievement('win_10_minigames');
    },

    // ============================================================
    // BATTLE SYSTEM
    // ============================================================

    async startBattle() {
        if (this.pokemonState.energy < 20) {
            alert('❌ Not enough energy! Need 20 energy to battle.');
            return;
        }

        // Generate random wild Pokemon
        const enemyId = Math.floor(Math.random() * 151) + 1;
        const enemyData = await this.fetchPokemonFromAPI(enemyId);
        if (!enemyData) return;

        const enemyLevel = Math.max(1, this.pokemonState.level + Math.floor(Math.random() * 5) - 2);
        const enemyStats = this.calculatePokemonStats(enemyData.baseStats, enemyLevel);

        // Consume energy
        this.pokemonState.energy -= 20;

        // Simple battle calculation
        const playerPower = this.pokemonState.stats.attack + this.pokemonState.stats.speed;
        const enemyPower = enemyStats.attack + enemyStats.speed;
        const playerHP = this.pokemonState.stats.hp;
        const enemyHP = enemyStats.hp;

        const playerScore = playerPower + (playerHP / 2);
        const enemyScore = enemyPower + (enemyHP / 2);

        // Add some randomness
        const roll = Math.random();
        const victory = playerScore * (0.8 + roll * 0.4) > enemyScore;

        this.battleState = {
            enemy: { species: enemyData, level: enemyLevel, stats: enemyStats },
            result: victory ? 'victory' : 'defeat',
            coinsWon: victory ? Math.floor(50 + enemyLevel * 10) : 10
        };

        if (victory) {
            this.totalBattlesWon = (this.totalBattlesWon || 0) + 1;
            this.earnCoins(this.battleState.coinsWon, 'battle');
            this.checkAchievement('battle_champion');
        } else {
            this.earnCoins(10, 'consolation');
        }

        this.showBattleModal = true;
        this.saveGameState();
    },

    // ============================================================
    // SAVE/LOAD SYSTEM
    // ============================================================

    saveGameState() {
        const gameState = {
            version: '2.0',
            pokemonState: this.pokemonState,
            economy: this.economy,
            achievements: this.achievements,
            minigames: this.minigames,
            collection: this.collection,
            activeMonIndex: this.activeMonIndex,
            totalBattlesWon: this.totalBattlesWon
        };

        localStorage.setItem('sqlWorkshop_gameState', JSON.stringify(gameState));
    },

    loadGameState() {
        const saved = localStorage.getItem('sqlWorkshop_gameState');
        if (!saved) return;

        try {
            const gameState = JSON.parse(saved);

            if (gameState.pokemonState) {
                Object.assign(this.pokemonState, gameState.pokemonState);
            }
            if (gameState.economy) {
                Object.assign(this.economy, gameState.economy);
            }
            if (gameState.achievements) {
                // Merge achievements (keep structure but restore unlocked states)
                Object.keys(gameState.achievements).forEach(key => {
                    if (this.achievements[key]) {
                        Object.assign(this.achievements[key], gameState.achievements[key]);
                    }
                });
            }
            if (gameState.minigames) {
                Object.keys(gameState.minigames).forEach(key => {
                    if (this.minigames[key]) {
                        Object.assign(this.minigames[key], gameState.minigames[key]);
                    }
                });
            }
            if (gameState.collection) {
                this.collection = gameState.collection;
            }
            if (gameState.activeMonIndex !== undefined) {
                this.activeMonIndex = gameState.activeMonIndex;
            }
            if (gameState.totalBattlesWon !== undefined) {
                this.totalBattlesWon = gameState.totalBattlesWon;
            }
        } catch (e) {
            console.error('Error loading game state:', e);
        }
    }
};
