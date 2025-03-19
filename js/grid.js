// js/grid.js
import { GameState } from "./GameState.js";
import { LAYOUT, THEMES } from "./constants.js";

export function drawGrid(scene) {
    GameState.currentScene = scene;

    const gridChanged = GameState.updateGridSize();
    const { width, height } = scene.scale;
    GameState.clearGridCells();
    const isMobile = width <= LAYOUT.scaling.breakpoint;

    const scaledUnitSize = GameState.unitSize * GameState.scaleFactor;

    const gridSizePixels = scaledUnitSize * GameState.grid_size;
    GameState.gridStartX = scene.scale.width / 2 - gridSizePixels / 2;
    GameState.gridStartY = scene.scale.height / 2 - gridSizePixels / 2 + 45 * GameState.scaleFactor;

    GameState.gridCells = [];
    for (let row = 0; row < GameState.grid_size; row++) {
        for (let col = 0; col < GameState.grid_size; col++) {
            let x = GameState.gridStartX + col * scaledUnitSize + scaledUnitSize / 2;
            let y = GameState.gridStartY + row * scaledUnitSize + (isMobile ? scaledUnitSize : scaledUnitSize / 2);
            
            
            const gridImage = GameState.currentTheme === THEMES.dark ? 'gridCellDark' : 'gridCellLight';

            const cell = scene.add.image(x, y, gridImage)
                .setDisplaySize(scaledUnitSize - 3, scaledUnitSize - 3)
                .setDepth(2);

            GameState.gridCells.push(cell);

        }
    }

    GameState.updateUnitPositions();
}

export function isGridFull() {
    return GameState.grid.every(row => row.every(cell => cell !== null));
}


export function isValidGridPosition(row, col) {
    return row >= 0 && row < GameState.grid_size && col >= 0 && col < GameState.grid_size;
}