import { GameState } from "../js/GameState.js";
import { updateTimer, spawnHiddenCoin, createPanel } from "../js/ui.js";
import { setupCommonUI } from "../js/uiHelper.js";
import { LAYOUT } from "../js/constants.js";

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    preload() {
    
    }

    create() {
        this.cameras.main.fadeIn(300, 0, 0, 0);
        
        GameState.reset();
        GameState.currentScene = this;
        this.cameras.main.setBackgroundColor(GameState.currentTheme.background);
        
      
        setupCommonUI(this, false); 
      

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
        
        const width = this.scale.width;
        const height = this.scale.height;
        const scaleFactor = width <= LAYOUT.scaling.breakpoint ? 
            LAYOUT.scaling.mobile : LAYOUT.scaling.desktop;
        
    }
    update() {}
}