// uiHelper.js
import { GameState } from "../js/GameState.js";
import { drawGrid } from "../js/grid.js";
import { purchaseUnit, findEmptySlot, isGameOver } from "../js/units.js";
import { createPanel } from "../js/ui.js";
import { GAME_KEY } from "./constants.js";


export function setupCommonUI(scene, isInfinityMode = false) {
    const updateUI = (width = scene.scale.width, height = scene.scale.height) => {
        // Clear existing UI elements (if any)
        scene.children.removeAll();

        // Calculate scale factor
        let scaleFactor;
        if (width <= 980) {
            scaleFactor = 1,8;
        } else {
            scaleFactor = 1;
        }

        const centerX = width / 2;
        const centerY = height / 2;

        GameState.scaleFactor = scaleFactor;
        // Définir la taille des unités mise à l'échelle
        const scaledUnitSize = GameState.unitSize * scaleFactor;

        // Calcul de la position de la grille avec le facteur d'échelle
        const gridSizePixels = scaledUnitSize * 3; // Pour une grille 3x3
        GameState.gridStartX = centerX - (gridSizePixels / 2);
        GameState.gridStartY = centerY - (gridSizePixels / 2) + 45 * scaleFactor;


        // Draw the grid
        drawGrid(scene);

// Titre du jeu
        scene.add.text(centerX, centerY - 300 * scaleFactor, `${GAME_KEY}`, {
            font: `${70 * scaleFactor}px customFont`,
            fill: '#fff',
            stroke: '#000000',
            strokeThickness: 6 * scaleFactor
        }).setOrigin(0.5).setDepth(2).setInteractive().on('pointerdown', () => {
            scene.scene.start('Start');
        });

        // Coin display
        GameState.coinsText = scene.add.text(centerX, centerY - 230 * scaleFactor, `Coins: ${GameState.coins}`, {
            font: `${30 * scaleFactor}px customFont`,
            fill: '#FFD700'
        }).setOrigin(0.5).setDepth(2);

        scene.add.image(centerX - 95 * scaleFactor, centerY - 232 * scaleFactor, 'coin')
            .setScale(0.6 * scaleFactor)
            .setDepth(1);

        // Timer display
        const timerText = isInfinityMode ? 'Time: ∞' : `Time: ${GameState.timeLeft}s`;
        GameState.timeText = scene.add.text(centerX, centerY - 190 * scaleFactor, timerText, {
            font: `${24 * scaleFactor}px customFont`,
            fill: '#FFFFFF'
        }).setOrigin(0.5).setDepth(2);

        // Add unit button
        const addUnitButton = scene.add.rectangle(
            centerX,
            centerY + 300 * scaleFactor,
            220 * scaleFactor,
            60 * scaleFactor,
            0xfffd77,
            0.8
        )
            .setStrokeStyle(3 * scaleFactor, 0x000000)
            .setInteractive()
            .setDepth(2)
            .on('pointerdown', () => {
                if (GameState.gameActive) {
                    scene.tweens.add({
                        targets: addUnitButton,
                        scaleX: 0.9,
                        scaleY: 0.9,
                        duration: 50,
                        yoyo: true,
                        onComplete: () => purchaseUnit(scene)
                    });
                }
            })
            .on('pointerover', () => {
                scene.tweens.add({
                    targets: addUnitButton,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 100,
                    ease: 'Power2'
                });
            })
            .on('pointerout', () => {
                scene.tweens.add({
                    targets: addUnitButton,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100,
                    ease: 'Power2'
                });
            });

        const buttonText = scene.add.text(centerX, centerY + 300 * scaleFactor, `Acheter | ${GameState.levelUpCost}$`, {
            font: `${24 * scaleFactor}px customFont`,
            fill: '#000'
        }).setOrigin(0.5).setDepth(3);

        // Update button state
        const updateButtonState = () => {
            const emptySlot = findEmptySlot();
            if (!emptySlot || GameState.coins < GameState.levelUpCost) {
                addUnitButton.setFillStyle(0xaaaaaa, 1.5);
                buttonText.setColor('#888');
                addUnitButton.disableInteractive();
            } else {
                addUnitButton.setFillStyle(0xfffd77, 0.8);
                buttonText.setColor('#000');
                addUnitButton.setInteractive();
            }
        };

        scene.time.addEvent({
            delay: 100,
            callback: updateButtonState,
            loop: true
        });

        updateButtonState();

        // Create game over and win panels
        GameState.gameOverPanel = createPanel(scene, 'GAME OVER', '#FF0000', scaleFactor);
        GameState.winPanel = createPanel(scene, 'YOU WIN!', '#00FF00', scaleFactor);
    };

    // Initialize the UI
    updateUI();

    // Handle resizing
    scene.scale.on('resize', (gameSize) => {
        updateUI(gameSize.width, gameSize.height);
    });
}