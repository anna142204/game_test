import { GameState } from "../js/GameState.js";
import { drawGrid } from "../js/grid.js";
import { purchaseUnit, findEmptySlot} from "../js/units.js";
import { createPanel } from "./ui.js";

import { GAME_KEY } from "./constants.js";
export function setupCommonUI(scene, isInfinityMode = false) {
    const updateUI = (width = scene.scale.width, height = scene.scale.height) => {
        GameState.updateGridSize();

        scene.children.removeAll();

        let scaleFactor;

        if (width <= 480) {
            scaleFactor = 1.5;
        } else if (width <= 768) {
            scaleFactor = 1.8;
        } else if (width <= 980) {
            scaleFactor = 2;
        } else {
            scaleFactor = 1;
        }
        
        GameState.scaleFactor = scaleFactor;

        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height / 2);
        const scaledUnitSize = GameState.unitSize * scaleFactor;
        const gridSizePixels = scaledUnitSize * GameState.grid_size;
 
        GameState.gameOverPanel = createPanel(scene, 'GAME OVER', '#FF0000', scaleFactor);
        GameState.winPanel = createPanel(scene, 'YOU WIN!', '#00FF00', scaleFactor);

        const isMobile = width <= 980;
    
        GameState.gridStartX = Math.floor(centerX - (gridSizePixels / 2));
        GameState.gridStartY = isMobile 
            ? Math.floor(centerY - (gridSizePixels / 2)) 
            : Math.floor(centerY - (gridSizePixels / 3));

        drawGrid(scene);

        const titleY = isMobile ? height * 0.18 : height * 0.12;
        const titleSize = isMobile ? 80 * scaleFactor : 70 * scaleFactor;
        
        scene.add.text(centerX, titleY, `${GAME_KEY}`, {
            font: `${titleSize}px customFont`,
            fill: '#fff',
            stroke: '#000000',
            strokeThickness: 6 * scaleFactor
        }).setOrigin(0.5).setDepth(2).setInteractive().on('pointerdown', () => {
            scene.scene.start('Start');
        });

        const infoY = isMobile 
            ? titleY + 100 * scaleFactor 
            : titleY + 75 * scaleFactor; 
        
        const coinIconOffsetX = isMobile ? 20 * scaleFactor : 30 * scaleFactor;
        const coinTextOffsetX = isMobile ? 40 * scaleFactor : 60 * scaleFactor;
        
        const coinIconX = centerX + coinIconOffsetX;
        scene.add.image(coinIconX, infoY, 'coin')
            .setScale(0.6 * scaleFactor)
            .setDepth(1);
            
        const coinTextX = centerX + coinTextOffsetX;
        GameState.coinsText = scene.add.text(coinTextX, infoY, `${GameState.coins}$`, {
            font: `${30 * scaleFactor}px customFont`,
            fill: '#FFD700'
        }).setOrigin(0, 0.5).setDepth(2);

        const timerOffsetX = isMobile ? -80 * scaleFactor : -100;
        const timerText = isInfinityMode ? 'Time: ∞' : `Time: ${GameState.timeLeft}s`;
        GameState.timeText = scene.add.text(centerX + timerOffsetX, infoY, timerText, {
            font: `${24 * scaleFactor}px customFont`,
            fill: '#FFFFFF'
        }).setOrigin(0.5).setDepth(2);

        const buttonOffset = isMobile ? 80 * scaleFactor : 100 * scaleFactor;
        const buttonY = GameState.gridStartY + gridSizePixels + buttonOffset;
        
        const buttonWidth = isMobile ? 180 * scaleFactor : 200 * scaleFactor;
        const buttonHeight = isMobile ? 50 * scaleFactor : 60 * scaleFactor;
        
        const addUnitButton = scene.add.rectangle(
            centerX,
            buttonY,
            buttonWidth,
            buttonHeight,
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

        const buttonFontSize = isMobile ? 20 * scaleFactor : 24 * scaleFactor;
        const buttonText = scene.add.text(centerX, buttonY, `Buy  |  ${GameState.levelUpCost}$`, {
            font: `${buttonFontSize}px customFont`,
            fill: '#000'
        }).setOrigin(0.5).setDepth(3);

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
    };

    updateUI();

    scene.scale.on('resize', (gameSize) => {
        updateUI(gameSize.width, gameSize.height);
    });
}