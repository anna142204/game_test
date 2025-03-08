// js/GameState.js
import { GRID_SIZE } from "./constants.js";

export const GameState = {
    grid: [],
    coins: 500,
    timeLeft: 60,
    gameActive: true,
    hiddenCoins: [],
    timer: null,
    gameOverPanel: null,
    winPanel: null,
    coinsText: null,
    timeText: null,
    unitSize: 120,
    gridStartX: 0,
    gridStartY: 0,
    levelUpCost: 30,
    actualMaxLevel: 1,
    timerStarted: false,
    currentScene: null,
    scaleFactor:1,

    reset() {
        this.grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
        this.coins = 500;
        this.timeLeft = 5;
        this.gameActive = true;
        this.hiddenCoins = [];
        this.levelUpCost = 30;
        this.actualMaxLevel = 1;
        this.timerStarted = false;
    }
};
