// js/grid.js
import { GameState } from "./GameState.js";
import { GRID_SIZE } from "./constants.js";

export function drawGrid(scene) {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const x = GameState.gridStartX + col * GameState.unitSize + GameState.unitSize / 2;
            const y = GameState.gridStartY + row * GameState.unitSize + GameState.unitSize / 2;
            scene.add.image(x, y, 'gridCell').setDisplaySize(GameState.unitSize, GameState.unitSize).setDepth(2);
        }
    }
}

export function isGridFull() {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (GameState.grid[row][col] === null) {
                return false;
            }
        }
    }
    console.log("la grille est pleine")
    return true;
}


// Checks if a grid position is valid
export function isValidGridPosition(row, col) {
    return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE;
}