// js/GameState.js
import { setupCommonUI } from "./uiHelper.js";
import { drawGrid } from "./grid.js";
import { THEMES } from "./constants.js";

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
    scaleFactor: 1,
    grid_size: 3,
    gridCells: [],
    currentTheme: THEMES.dark,
   unitSkin : 'unit',


    reset() {
        this.grid = Array.from({ length: this.grid_size }, () => Array(this.grid_size).fill(null));
        this.coins = 500;
        this.timeLeft = 10;
        this.gameActive = true;
        this.hiddenCoins = [];
        this.levelUpCost = 30;
        this.actualMaxLevel = 1;
        this.timerStarted = false;
        this.gridCells = [];
        this.shopOpen = false;
        this.shopGroup = null;
    },

    updateGridSize() {
        let oldSize = this.grid_size;

        if (this.actualMaxLevel >= 20) {
            this.grid_size = 5;
        } else if (this.actualMaxLevel >= 10) {
            this.grid_size = 4;
        } else {
            this.grid_size = 3;
        }

        if (this.grid_size !== oldSize) {

            let newGrid = Array.from({ length: this.grid_size }, () =>
                Array(this.grid_size).fill(null)
            );

            for (let row = 0; row < oldSize; row++) {
                for (let col = 0; col < oldSize; col++) {
                    if (row < this.grid_size && col < this.grid_size && this.grid[row] && this.grid[row][col]) {
                        newGrid[row][col] = this.grid[row][col];
                    }
                }
            }

            this.grid = newGrid;

            const isMobile = this.currentScene && this.currentScene.scale.width <= 980;

            if (isMobile) {
                this.scaleFactor = this.grid_size === 3 ? 2 :
                    this.grid_size === 4 ? 1.8 : 1.5;
            } else {
                this.scaleFactor = this.grid_size === 3 ? 1 :
                    this.grid_size === 4 ? 0.8 : 0.7;
            }

            this.clearGridCells();

            if (this.currentScene) {
                drawGrid(this.currentScene);
            }

            return true;
        }

        return false;
    },

    clearGridCells() {
        if (this.gridCells && this.gridCells.length > 0) {
            this.gridCells.forEach(cell => {
                if (cell && cell.destroy) {
                    cell.destroy();
                }
            });
            this.gridCells = [];
        }

        if (this.currentScene) {
            this.currentScene.children.each(child => {
                if (child.texture && child.texture.key === 'gridCell') {
                    child.destroy();
                }
            });
        }
    },

    updateUnitPositions() {
        if (!this.currentScene) return;

        const scaledUnitSize = this.unitSize * this.scaleFactor;

        const gridSizePixels = scaledUnitSize * this.grid_size;
        this.gridStartX = this.currentScene.scale.width / 2 - gridSizePixels / 2;
        this.gridStartY = this.currentScene.scale.height / 2 - gridSizePixels / 2 + 45 * this.scaleFactor;


        for (let rowIndex = 0; rowIndex < this.grid_size; rowIndex++) {
            for (let colIndex = 0; colIndex < this.grid_size; colIndex++) {
                const unit = this.grid[rowIndex] && this.grid[rowIndex][colIndex];
                if (unit) {
                    try {

                        const x = this.gridStartX + colIndex * scaledUnitSize + scaledUnitSize / 2;
                        const y = this.gridStartY + rowIndex * scaledUnitSize + scaledUnitSize / 2;

                        unit.x = x;
                        unit.y = y;

                        const baseSize = this.unitSize;
                        unit.displayWidth = baseSize * this.scaleFactor;
                        unit.displayHeight = baseSize * this.scaleFactor;

                        if (unit.text) {
                            const fontSize = 20 * this.scaleFactor;
                            unit.text.setFontSize(fontSize);
                            unit.text.x = x;
                            unit.text.y = y;
                        }
                    } catch (error) {
                        console.error('Error updating unit:', error);
                    }
                }
            }
        }
    }
};