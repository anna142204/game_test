// js/units.js
import { GameState } from "./GameState.js";
import { updateCoinsDisplay, showPanel, updateTimer } from "./ui.js";
import { COLORS, GRID_SIZE } from "./constants.js";
import { isValidGridPosition, isGridFull } from "./grid.js";

export function purchaseUnit(scene) {
    if (!GameState.timerStarted) {
        GameState.timerStarted = true;
        GameState.timer = scene.time.addEvent({
            delay: 1000,
            callback: updateTimer,
            callbackScope: scene,
            args: [scene],
            loop: true
        });        
    }
    const emptySlot = findEmptySlot();
    if (!emptySlot) return;
    if (GameState.coins >= GameState.levelUpCost) {
        addNewUnit(scene);
        GameState.coins -= GameState.levelUpCost;
        updateCoinsDisplay();
    }
    isGameOver();
}

export function addNewUnit(scene) {
    const emptySlot = findEmptySlot();
    if (!emptySlot) return;
    const { row, col } = emptySlot;
    const x = GameState.gridStartX + col * GameState.unitSize + GameState.unitSize / 2;
    const y = GameState.gridStartY + row * GameState.unitSize + GameState.unitSize / 2;
    let unitLevel = 1;
    if (GameState.actualMaxLevel >= 4) {
        unitLevel = Phaser.Math.Between(1, Math.max(2, Math.floor(GameState.actualMaxLevel / 2)));
    }
    createUnitAt(scene, row, col, x, y, unitLevel);
}

// Creates a unit at a specific grid position
function createUnitAt(scene, row, col, x, y, level) {
    const unitColor = getUnitColor(level);
    const unit = scene.add.image(x, y, 'unit').setDisplaySize(GameState.unitSize, GameState.unitSize).setTint(unitColor).setDepth(3);
    const text = scene.add.text(x, y, level.toString(), {
        font: "20px customFont",
        fill: "#fff"
    }).setOrigin(0.5).setDepth(4);
    unit.level = level;
    unit.row = row;
    unit.col = col;
    unit.text = text;
    GameState.grid[row][col] = unit;
    unit.setInteractive();
    unit.on('pointerdown', () => {
        if (GameState.gameActive) {
            tryFusion(unit);
        }
    });
    scene.tweens.add({
        targets: unit,
        scale: 1.2,
        duration: 200,
        yoyo: true
    });
}

// Returns the color for a unit based on its level
export function getUnitColor(level) {
    return COLORS[level] || COLORS.default;
}

// Attempts to fuse the selected unit with a neighboring unit of the same level
export function tryFusion(unit) {
    const { row, col, level } = unit;
    const directions = [
        { r: -1, c: 0 }, { r: 1, c: 0 },
        { r: 0, c: -1 }, { r: 0, c: 1 },
        { r: -1, c: -1 }, { r: -1, c: 1 },
        { r: 1, c: -1 }, { r: 1, c: 1 }
    ];
    for (let d of directions) {
        for (let step = 1; step <= 2; step++) {
            const newRow = row + d.r * step;
            const newCol = col + d.c * step;
            if (isValidGridPosition(newRow, newCol)) {
                const neighbor = GameState.grid[newRow][newCol];
                if (neighbor && neighbor.level === level) {
                    fuseUnits(unit, neighbor);
                    return;
                }
            }
        }
    }
}

export function findEmptySlot() {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (GameState.grid[row][col] === null) {
                return { row, col };
            }
        }
    }
    return null;
}


export function fuseUnits(unit1, unit2) {
    const fusionLevel = unit1.level + 1;
    const reward = fusionLevel * 10;

    // Mise à jour du niveau max atteint
    GameState.actualMaxLevel = Math.max(GameState.actualMaxLevel, fusionLevel);

    // Ajout des pièces
    GameState.coins += reward;
    updateCoinsDisplay();

    // Suppression des anciennes unités
    unit1.text.destroy();
    unit2.text.destroy();
    unit1.destroy();
    unit2.destroy();

    // Mise à jour de la grille
    GameState.grid[unit1.row][unit1.col] = null;
    GameState.grid[unit2.row][unit2.col] = null;
    const scene = GameState.currentScene;
    if (!scene) {
        console.error("Erreur : aucune scène disponible pour créer l'unité fusionnée !");
        return;
    }

    const x = GameState.gridStartX + unit1.col * GameState.unitSize + GameState.unitSize / 2;
    const y = GameState.gridStartY + unit1.row * GameState.unitSize + GameState.unitSize / 2;
    createUnitAt(scene, unit1.row, unit1.col, x, y, fusionLevel);

}
export function isGameOver() {
    if (!hasValidMoves() && isGridFull()) {
        console.log("GameState.currentScene:", GameState.currentScene);
        console.log("GameState.gameOverPanel:", GameState.gameOverPanel);
        showPanel(GameState.currentScene, GameState.gameOverPanel);
        console.log("gameover");
    }
}

export function hasValidMoves() {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const unit = GameState.grid[row][col];
            if (unit) {
                const directions = [
                    { r: -1, c: 0 }, { r: 1, c: 0 },
                    { r: 0, c: -1 }, { r: 0, c: 1 },
                    { r: -1, c: -1 }, { r: -1, c: 1 },
                    { r: 1, c: -1 }, { r: 1, c: 1 }
                ];
                for (let d of directions) {
                    for (let step = 1; step <= 2; step++) {
                        const newRow = row + d.r * step;
                        const newCol = col + d.c * step;
                        if (isValidGridPosition(newRow, newCol)) {
                            const neighbor = GameState.grid[newRow][newCol];
                            if (neighbor && neighbor.level === unit.level) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}