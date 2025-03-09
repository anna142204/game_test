import { GameState } from "../js/GameState.js";
import { updateTimer } from "../js/ui.js";
import { spawnHiddenCoin, createPanel } from "../js/ui.js";
import { setupCommonUI } from "../js/uiHelper.js";


export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    preload() {
        this.load.image('gridCell', 'assets/case.png');
        this.load.image('unit', 'assets/chat.png');
        this.load.image('coin', 'assets/coin.png');
        this.load.font('customFont', 'assets/SourGummy-VariableFont_wdth,wght.ttf');
        this.load.audio('coinSound', 'assets/coin.mp3');
    }

    create() {
        GameState.reset();
        GameState.currentScene = this;
   
        this.time.delayedCall(100, () => {
            setupCommonUI(this, false); 
        });

        this.time.addEvent({
            delay: 1000,
            callback: () => updateTimer(this),
            loop: true
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
      
    }

    update() {}
}