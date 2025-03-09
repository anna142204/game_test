// js/grid.js
import { GameState } from "./GameState.js";

export function drawGrid(scene) {
    GameState.currentScene = scene;
    
    const gridChanged = GameState.updateGridSize();
    
    GameState.clearGridCells();
    
    const scaledUnitSize = GameState.unitSize * GameState.scaleFactor;

    const gridSizePixels = scaledUnitSize * GameState.grid_size;
    GameState.gridStartX = scene.scale.width / 2 - gridSizePixels / 2;
    GameState.gridStartY = scene.scale.height / 2 - gridSizePixels / 2 + 45 * GameState.scaleFactor;

    GameState.gridCells = [];
    for (let row = 0; row < GameState.grid_size; row++) {
        for (let col = 0; col < GameState.grid_size; col++) {
            const x = GameState.gridStartX + col * scaledUnitSize + scaledUnitSize / 2;
            const y = GameState.gridStartY + row * scaledUnitSize + scaledUnitSize / 2;

            const cell = scene.add.image(x, y, 'gridCell')
                .setDisplaySize(scaledUnitSize, scaledUnitSize)
                .setDepth(1);
                
            GameState.gridCells.push(cell);
        }
    }

    GameState.updateUnitPositions();
}

export function isGridFull() {
    for (let row = 0; row < GameState.grid_size; row++) {
        for (let col = 0; col < GameState.grid_size; col++) {
            if (GameState.grid[row][col] === null) {
                return false;
            }
        }
    }
    return true;
}

export function isValidGridPosition(row, col) {
    return row >= 0 && row < GameState.grid_size && col >= 0 && col < GameState.grid_size;
}