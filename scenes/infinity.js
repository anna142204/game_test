import { GameState } from "../js/GameState.js";
import { spawnHiddenCoin } from "../js/ui.js";
import { setupCommonUI } from "../js/uiHelper.js";
import { purchaseUnit } from "../js/units.js";
import { recreateGridFromSave } from "../js/units.js";
import { Game } from "./game.js";


export class Infini extends Phaser.Scene {
    constructor() {
        super({ key: 'Infini' });
    }

    preload() {

    }

    create() {

        this.cameras.main.fadeIn(300, 0, 0, 0);

        GameState.reset();
        GameState.currentScene = this;
        GameState.load();

        this.cameras.main.setBackgroundColor(GameState.currentTheme.background);

        if (GameState.timer) {
            GameState.timer.remove();
            GameState.timer = null;
        }
        GameState.timerStarted = false;


        setupCommonUI(this, true);

        if (GameState.savedGrid) {
            recreateGridFromSave(this);
        }
        
        this.input.keyboard.on('keydown-SPACE', () => {
            if (GameState.gameActive) {
                purchaseUnit(this);
            }
        });

        if (!this.coinTimer) {
            this.coinTimer = this.time.addEvent({
                delay: 20000,
                callback: () => spawnHiddenCoin(this),
                loop: true
            });
        }
        // Bouton Reset
        const resetButton = this.add.text(this.scale.width - 20, 20, "Reset", {
            font: "20px customFont",
            fill: "#ffffff"
        })
            .setOrigin(1, 0)
            .setInteractive()
            .setDepth(10)
            .on('pointerdown', () => {
                if (confirm("Veux-tu vraiment réinitialiser ta partie ?")) {
                    GameState.reset(true);
                    GameState.save();
                    this.scene.restart();
                }
            });



    }

    update() {
        GameState.updateGridSize();
    }

}