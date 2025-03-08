// js/grid.js
import { GameState } from "./GameState.js";
import { GRID_SIZE } from "./constants.js";

export function drawGrid(scene) {
   
    const scaleFactor = GameState.scaleFactor;
    const scaledUnitSize = GameState.unitSize * scaleFactor;
    
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const x = GameState.gridStartX + (col * scaledUnitSize) + (scaledUnitSize / 2);
            const y = GameState.gridStartY + (row * scaledUnitSize) + (scaledUnitSize / 2);
            
            scene.add.image(x, y, 'gridCell')
                .setDisplaySize(scaledUnitSize, scaledUnitSize)
                .setDepth(2);
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
    return true;
}

// Checks if a grid position is valid
export function isValidGridPosition(row, col) {
    return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE;
}