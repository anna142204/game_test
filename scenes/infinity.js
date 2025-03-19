import { GameState } from "../js/GameState.js";
import { spawnHiddenCoin} from "../js/ui.js";
import { setupCommonUI } from "../js/uiHelper.js";
import { purchaseUnit } from "../js/units.js";


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

        this.cameras.main.setBackgroundColor(GameState.currentTheme.background);

        if (GameState.timer) {
            GameState.timer.remove();
            GameState.timer = null;
        }
        GameState.timerStarted = false;

       
            setupCommonUI(this, true);
      

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
    
    }
    update() {
        GameState.updateGridSize();
    }
    
}