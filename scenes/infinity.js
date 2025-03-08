import { GameState } from "../js/GameState.js";
import { spawnHiddenCoin } from "../js/ui.js";
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

        setupCommonUI(this, true);

        if (!this.coinTimer) {
            this.coinTimer = this.time.addEvent({
                delay: 20000,
                callback: () => spawnHiddenCoin(this),
                loop: true
            });
        }

    }

    update() {}
}