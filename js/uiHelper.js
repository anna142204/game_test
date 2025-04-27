import { GameState } from "../js/GameState.js";
import { drawGrid } from "../js/grid.js";
import { purchaseUnit, findEmptySlot, getUnitColor } from "../js/units.js";
import { createPanel } from "./ui.js";
import { GAME_KEY, THEMES } from "./constants.js";
import { LAYOUT } from "./constants.js";
import { createShop } from "./shop.js";
import { LayoutManager } from "./layoutManager.js";

/**
 * Alterne entre les thèmes clair et sombre
 * @param {Phaser.Scene} scene - La scène Phaser actuelle
 */
export function switchTheme(scene) {
    GameState.currentTheme = GameState.currentTheme === THEMES.dark ? THEMES.light : THEMES.dark;
    scene.scene.restart();
}

export function updateUnitColors() {
    GameState.grid.forEach(row => {
        row.forEach(unit => {
            if (unit) {
                const newColor = getUnitColor(unit.level);
                unit.setTint(newColor);
            }
        });
    });
}

/**
 * Configure l'interface utilisateur commune à plusieurs scènes
 * @param {Phaser.Scene} scene - La scène Phaser actuelle
 * @param {boolean} isInfinityMode - Mode infini activé ou non
 */
export function setupCommonUI(scene, isInfinityMode = false) {
    const layout = new LayoutManager(scene);
    const theme = GameState.currentTheme;
    const scaleFactor = layout.scaleFactor;

    scene.children.removeAll();
    GameState.updateGridSize();
    GameState.scaleFactor = scaleFactor;

    drawGrid(scene);

    createGameTitle(scene, layout.centerX, layout.titleY, scaleFactor, theme);
    createResourcesDisplay(scene, layout.isMobile, layout.resourcesX, layout.resourcesY, scaleFactor, theme, isInfinityMode);
    createPurchaseButton(scene, layout.centerX, layout.buyButtonY, scaleFactor, theme);
    createShop(scene, theme, scaleFactor);
    createBackButton(scene, layout.backButtonX, layout.backButtonY, layout.isMobile, theme);

    GameState.gameOverPanel = createPanel(scene, 'GAME OVER', theme, scaleFactor);
    GameState.winPanel = createPanel(scene, 'YOU WIN!', theme, scaleFactor);

}

/**
 * Crée le titre du jeu
 */
function createGameTitle(scene, centerX, titleY, scaleFactor, theme) {
    const titleSize = LAYOUT.fonts.title * scaleFactor;

    scene.add.text(centerX, titleY, GAME_KEY, {
        font: `${titleSize}px customFont`,
        fill: theme.titleText,
        stroke: theme.stroke,
        strokeThickness: LAYOUT.styles.strokeThickness * scaleFactor
    })
        .setOrigin(0.5)
        .setDepth(2)
        .setInteractive()
        .on('pointerdown', () => {
            scene.scene.start('Start');
        });

    updateUnitColors();
}

/**
 * Crée l'affichage des ressources (pièces et temps)
 */
function createResourcesDisplay(scene, isMobile, resourcesX, infoY, scaleFactor, theme, isInfinityMode) {
    const resourceSize = Math.round(LAYOUT.fonts.resource * scaleFactor);

    GameState.timeText = scene.add.text(resourcesX, infoY, isInfinityMode ? 'Time: ∞' : `Time: ${GameState.timeLeft}s`, {
        font: `${resourceSize}px customFont`,
        fill: theme.text
    }).setOrigin(0.5).setDepth(2);

    // Icône de pièce
    scene.add.image(resourcesX + (isMobile ? 400 : 140), infoY, 'coin')
        .setScale(0.6 * scaleFactor)
        .setDepth(1);

    // Texte du nombre de pièces
    GameState.coinsText = scene.add.text(resourcesX + (isMobile ? 450 : 170), infoY, `${GameState.coins}$`, {
        font: `${resourceSize}px customFont`,
        fill: theme.text
    })
        .setOrigin(0, 0.5)
        .setDepth(2);
}

/**
 * Crée le bouton d'achat d'unité
 */
function createPurchaseButton(scene, centerX, buttonY, scaleFactor, theme) {
    const buttonImage = theme === THEMES.light ? 'buttonLight' : 'buttonDark';
    const buttonWidth = Math.round(200 * scaleFactor);
    const buttonHeight = Math.round(60 * scaleFactor);

    const addUnitButton = scene.add.image(centerX, buttonY, buttonImage)
        .setDisplaySize(buttonWidth, buttonHeight)
        .setInteractive()
        .setDepth(2)
        .on('pointerdown', () => {
            if (GameState.gameActive) {
                scene.tweens.add({
                    targets: addUnitButton,
                    scaleX: 0.95 * scaleFactor,
                    scaleY: 0.95 * scaleFactor,
                    duration: 80,
                    yoyo: true,
                    ease: 'sine.inOut',
                    onComplete: () => purchaseUnit(scene)
                });
            }
        });


    const buttonText = scene.add.text(centerX, buttonY, `Buy | ${GameState.levelUpCost}$`, {
        font: `${Math.round(LAYOUT.fonts.button * scaleFactor)}px customFont`,
        fill: theme.buttonText
    }).setOrigin(0.5).setDepth(3);


    const updateButtonState = () => {
        const emptySlot = findEmptySlot();
        if (!emptySlot || GameState.coins < GameState.levelUpCost) {
            addUnitButton.setAlpha(0.5);
            buttonText.setColor('#888');
            addUnitButton.disableInteractive();
        } else {
            addUnitButton.setAlpha(1);
            buttonText.setColor(theme.buttonText);
            addUnitButton.setInteractive();
        }
    };

    scene.time.addEvent({
        delay: 100,
        callback: updateButtonState,
        loop: true
    });

    updateButtonState();
}

/**
 * Crée le bouton de retour (fonction conservée pour référence mais non utilisée)
 */
function createBackButton(scene, backButtonX, buyButtonY, isMobile, theme) {
    const size = { x: isMobile ? 100 : 30, y: isMobile ? 150 : 40 }
    const buttonImage = theme === THEMES.light ? 'backButtonLight' : 'backButtonDark';
    // Bouton de retour
    scene.add.image(
        backButtonX,
        buyButtonY,
        buttonImage)
        .setDisplaySize(size.x, size.y)
        .setInteractive()
        .setDepth(2)
        .on('pointerdown', () => {
            scene.cameras.main.fadeOut(300, 0, 0, 0);
            scene.time.delayedCall(300, () => {
                scene.scene.start('Start');
            });
        }
        );
}