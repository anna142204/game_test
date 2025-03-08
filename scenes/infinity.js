import { GameState } from "../js/GameState.js";
import { spawnHiddenCoin, createPanel } from "../js/ui.js";
import { setupCommonUI } from "../js/uiHelper.js";



export class Infini extends Phaser.Scene {
    constructor() {
        super({ key: 'Infini' });
    }

    preload() {
        this.load.image('gridCell', 'assets/case.png');
        this.load.image('unit', 'assets/chat.png');
        this.load.image('coin', 'assets/coin.png');
        this.load.image('deco1', 'assets/catfond.png');
        this.load.font('customFont', 'assets/SourGummy-VariableFont_wdth,wght.ttf');
        this.load.audio('coinSound', 'assets/coin.mp3');
    }

    create() {
        GameState.reset();
        GameState.currentScene = this;
        if (GameState.timer) {
            GameState.timer.remove();
            GameState.timer = null;
        }
        GameState.timerStarted = false;

        this.time.delayedCall(100, () => {
            setupCommonUI(this, true);
        });

        if (!this.coinTimer) {
            this.coinTimer = this.time.addEvent({
                delay: 20000,
                callback: () => spawnHiddenCoin(this),
                loop: true
            });
        }
        let width = this.scale.width;
        let scaleFactor;
        if (width <= 980) {
            scaleFactor = 2;
        } else {
            scaleFactor = 1;
        }
        GameState.gameOverPanel = createPanel(this, 'GAME OVER', '#FF0000', scaleFactor);
        GameState.winPanel = createPanel(this, 'YOU WIN!', '#00FF00', scaleFactor);
    }

    update() {}
}