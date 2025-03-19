import { GAME_KEY, THEMES, LAYOUT, fontStyle } from "../js/constants.js";
import { GameState } from "../js/GameState.js";
import { switchTheme } from "../js/uiHelper.js";
import { LayoutManager } from "../js/layoutManager.js";

export class Start extends Phaser.Scene {
    constructor() {
        super({ key: 'Start' });
    }

    preload() {
    }

    create() {
        this.cameras.main.fadeIn(300, 0, 0, 0);
        this.cameras.main.setBackgroundColor(GameState.currentTheme.background);
    
        this.layout = new LayoutManager(this);
        const theme = GameState.currentTheme;
        const scaleFactor = this.layout.scaleFactor;
       
       const fontSize =  Math.round(LAYOUT.fonts.title * scaleFactor);
    
       //Title
       this.createText(this.layout.centerX, this.layout.titleY+80, GAME_KEY, {
        font: `${Math.round(LAYOUT.fonts.title * scaleFactor)}px customFont`,
        fill: theme.titleText,
        stroke: theme.stroke,
        strokeThickness: Math.round(LAYOUT.styles.strokeThickness * scaleFactor),
        resolution: window.devicePixelRatio
    });
    const buttonImage = GameState.currentTheme === THEMES.light ? 'buttonLight' : 'buttonDark';
    const buttonTheme = GameState.currentTheme === THEMES.light ? 'buttonThemeLight' : 'buttonThemeDark';
    const fontColor = GameState.currentTheme === THEMES.light ? '#4C202F' : '#ffffff';

    this.add.image(this.layout.centerX, this.layout.gridY*1.35, 'unit').setScale(scaleFactor);
    
    this.createButton(Math.round(LAYOUT.button.width * scaleFactor),this.layout.centerX + this.layout.buttonSpacing, this.layout.buttonY, 'Infinity mode', 'Infini', scaleFactor, buttonImage);
    this.createButton(Math.round(LAYOUT.button.width * scaleFactor),this.layout.centerX - this.layout.buttonSpacing, this.layout.buttonY, 'Level mode', 'Game', scaleFactor, buttonImage);
    this.createButton(Math.round(30+LAYOUT.button.width * scaleFactor),this.layout.centerX, this.layout.buttonY + this.layout.buttonSpacing, "Switch theme", () => switchTheme(this), scaleFactor, buttonTheme,fontColor);

    this.createText(this.layout.centerX, Math.round(this.layout.height * 0.9), "made by Spilana", {
        fontSize: `${Math.round(LAYOUT.fonts.credit * scaleFactor)}px`,
        fill: theme.text
    });
}

createButton(width, x, y, text, callback, scaleFactor, buttonImage,fontColor= GameState.currentTheme.buttonText) {
  
    
    const button = this.add.image(x, y, buttonImage)
        .setDisplaySize(width, Math.round(LAYOUT.button.height * scaleFactor))
        .setInteractive()
        .setDepth(2)
        .on('pointerdown', () => {
            if (typeof callback === "function") {
                callback();
            } else {
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.time.delayedCall(300, () => {
                    this.scene.start(callback);
                });
            }
        });

    this.add.text(x, y, text, {
        font: `${Math.round(LAYOUT.fonts.button * scaleFactor)}px customFont`,
        fill: fontColor,
        resolution: window.devicePixelRatio 
    }).setOrigin(0.5).setDepth(3);
}

createText(x, y, text, style) {
    this.add.text(x, y, text, style).setOrigin(0.5);
}
}