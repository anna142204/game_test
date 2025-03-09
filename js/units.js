// js/units.js
import { GameState } from "./GameState.js";
import { updateCoinsDisplay, showPanel, updateTimer } from "./ui.js";
import { COLORS } from "./constants.js";
import { isValidGridPosition, isGridFull } from "./grid.js";

export function purchaseUnit(scene) {
    if (!GameState.timerStarted && scene.scene.key === 'Game') {
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

export function getLowestUnitOnGrid() {
    let minLevel = GameState.actualMaxLevel;

    for (let row = 0; row < GameState.grid_size; row++) {
        for (let col = 0; col < GameState.grid_size; col++) {
            if (GameState.grid[row] && GameState.grid[row][col] !== undefined) {
                const unit = GameState.grid[row][col];
                if (unit && unit.level < minLevel) {
                    minLevel = unit.level;
                }
            }
        }
    }
    return minLevel;
}

export function addNewUnit(scene) {
    const emptySlot = findEmptySlot();
    if (!emptySlot) return;

    const { row, col } = emptySlot;
    const scaledUnitSize = GameState.unitSize * GameState.scaleFactor;

    const x = GameState.gridStartX + col * scaledUnitSize + scaledUnitSize / 2;
    const y = GameState.gridStartY + row * scaledUnitSize + scaledUnitSize / 2;

    let minGridLevel = getLowestUnitOnGrid();
    let theoreticalMinLevel = Math.floor(GameState.actualMaxLevel / 5) + 1;
    let minLevel = Math.min(theoreticalMinLevel, minGridLevel);
    let maxLevel = Math.min(GameState.actualMaxLevel - 1, minLevel + 2);

    let unitLevel = Phaser.Math.Between(minLevel, maxLevel);

    createUnitAt(scene, row, col, x, y, unitLevel);
}

function createUnitAt(scene, row, col, x, y, level) {
    const scaledUnitSize = GameState.unitSize * GameState.scaleFactor;
    const unitColor = getUnitColor(level);
    
    const isMobile = scene.scale.width <= 980;
    const baseSize = GameState.unitSize;
    
    const unit = scene.add.image(x, y, 'unit')
        .setDisplaySize(baseSize * GameState.scaleFactor, baseSize * GameState.scaleFactor)
        .setTint(unitColor)
        .setDepth(3);

    const fontSize = (isMobile ? 28 : 20) * GameState.scaleFactor;
    const text = scene.add.text(x, y, level.toString(), {
        font: `${fontSize}px customFont`,
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

    const tweenScale = GameState.scaleFactor * 1.2;
    scene.tweens.add({
        targets: unit,
        displayWidth: baseSize * tweenScale,
        displayHeight: baseSize * tweenScale,
        duration: 100,
        yoyo: true,
        onComplete: () => {
            unit.displayWidth = baseSize * GameState.scaleFactor;
            unit.displayHeight = baseSize * GameState.scaleFactor;
        }
    });
}

export function getUnitColor(level) {
    return COLORS[level] || COLORS.default;
}

export function tryFusion(unit) {
    const { row, col, level } = unit;
    
    const directions = [
      { r: -1, c: 0 }, { r: 1, c: 0 },   
      { r: 0, c: -1 }, { r: 0, c: 1 },   
      { r: -1, c: -1 }, { r: -1, c: 1 },
      { r: 1, c: -1 }, { r: 1, c: 1 }
    ];
 
    const maxDistance = GameState.grid_size - 1;
    
    for (let d of directions) {
      for (let step = 1; step <= maxDistance; step++) {
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
    for (let row = 0; row < GameState.grid_size; row++) {
        for (let col = 0; col < GameState.grid_size; col++) {
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

    GameState.actualMaxLevel = Math.max(GameState.actualMaxLevel, fusionLevel);
    GameState.coins += reward;
    updateCoinsDisplay();

    unit1.text.destroy();
    unit2.text.destroy();
    unit1.destroy();
    unit2.destroy();

    GameState.grid[unit1.row][unit1.col] = null;
    GameState.grid[unit2.row][unit2.col] = null;
    
    const scene = GameState.currentScene;
    if (!scene) {
        console.error("Error: no scene available to create fused unit!");
        return;
    }

    const scaledUnitSize = GameState.unitSize * GameState.scaleFactor;
    const x = GameState.gridStartX + unit1.col * scaledUnitSize + scaledUnitSize / 2;
    const y = GameState.gridStartY + unit1.row * scaledUnitSize + scaledUnitSize / 2;

    createUnitAt(scene, unit1.row, unit1.col, x, y, fusionLevel);
}

export function isGameOver() {
    if (!hasValidMoves() && isGridFull()) {
        showPanel(GameState.currentScene, GameState.gameOverPanel);
    }
}

export function hasValidMoves() {
    const directions = [
      { r: -1, c: 0 }, { r: 1, c: 0 },   // vertical
      { r: 0, c: -1 }, { r: 0, c: 1 },   // horizontal
      { r: -1, c: -1 }, { r: -1, c: 1 }, // diagonales
      { r: 1, c: -1 }, { r: 1, c: 1 }
    ];
    
    // Déterminer la distance maximale à vérifier basée sur la taille de la grille
    const maxDistance = GameState.grid_size - 1;
    
    for (let row = 0; row < GameState.grid_size; row++) {
      for (let col = 0; col < GameState.grid_size; col++) {
        const unit = GameState.grid[row][col];
        
        if (unit) {
          for (let d of directions) {
            // Vérifier toutes les distances possibles selon la taille de la grille
            for (let step = 1; step <= maxDistance; step++) {
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