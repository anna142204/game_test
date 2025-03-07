import { GameState } from "../js/GameState.js";
import { drawGrid } from "../js/grid.js";
import { updateTimer } from "../js/ui.js";
import { purchaseUnit, findEmptySlot, isGameOver } from "../js/units.js";
import { createPanel } from "../js/ui.js";
import { spawnHiddenCoin } from "../js/ui.js";
import { GAME_KEY } from "../js/constants.js";

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }
    
preload() {
    this.load.image('gridCell', 'assets/case.png');
    this.load.image('unit', 'assets/chat.png');
    this.load.image('coin', 'assets/coin.png');
    // this.load.image('deco1', 'assets/catfond.png');
    // this.load.image('deco2', 'assets/patte.png');
    // this.load.image('deco3', 'assets/traces.png');
    // this.load.image('deco4', 'assets/trace.svg');
    this.load.font('customFont', 'assets/SourGummy-VariableFont_wdth,wght.ttf');
    this.load.audio('coinSound', 'assets/coin.mp3');
}

create() {
    GameState.reset();
    GameState.currentScene = this;

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // this.add.image(100, window.innerHeight - 100, 'deco1').setScale(0.6).setDepth(1);
    // this.add.image(centerX + 165, centerY - 150, 'deco2').setScale(0.1).setDepth(1);
    // this.add.image(centerX - 225, centerY + 385, 'deco2').setScale(0.1).setDepth(1);
    // this.add.image(window.innerWidth - 100, 100, 'deco3').setScale(0.05).setDepth(1);

    // Calcul de la position de la grille
    const gridSizePixels = GameState.unitSize * 3;
    GameState.gridStartX = centerX - (gridSizePixels / 2);
    GameState.gridStartY = centerY - (gridSizePixels / 2) + 45;

    // Titre du jeu
    this.add.text(centerX, centerY - 300, `${GAME_KEY}`, {
        font: '70px customFont',
        fill: '#fff',
        stroke: '#000000',
        strokeThickness: 6
    }).setOrigin(0.5).setDepth(2).setInteractive().on('pointerdown',()=>{
        this.scene.start('Start');
    });

    // Affichage des pièces
    GameState.coinsText = this.add.text(centerX, centerY - 230, `Coins: ${GameState.coins}`, {
        font: '30px customFont',
        fill: '#FFD700'
    }).setOrigin(0.5).setDepth(2);

    this.add.image(centerX - 95, centerY - 232, 'coin').setScale(0.6).setDepth(1);

    // Affichage du temps
    GameState.timeText = this.add.text(centerX, centerY - 190, `Time: ${GameState.timeLeft}s`, {
        font: '24px customFont',
        fill: '#FFFFFF'
    }).setOrigin(0.5).setDepth(2);

    // Dessiner la grille
    drawGrid(this);

    // Bouton Pause
    const pauseButton = this.add.text(50, 50, 'Pause', {
        font: '24px customFont',
        fill: '#FFFFFF'
    }).setInteractive().on('pointerdown', () => {
        GameState.gameActive = !GameState.gameActive;
        pauseButton.setText(GameState.gameActive ? 'Pause' : 'Resume');
    });

    // Bouton Ajouter unité
    const addUnitButton = this.add.rectangle(centerX, centerY + 300, 220, 60, 0xfffd77, 0.8)
        .setStrokeStyle(3, 0x000000)
        .setInteractive()
        .setDepth(2)
        .on('pointerdown', () => {
            if (GameState.gameActive) {
                this.tweens.add({
                    targets: addUnitButton,
                    scaleX: 0.9,
                    scaleY: 0.9,
                    duration: 50,
                    yoyo: true,
                    onComplete: () => purchaseUnit(this)
                });
            }
        })
        .on('pointerover', () => {
            this.tweens.add({
                targets: addUnitButton,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100,
                ease: 'Power2'
            });
        })
        .on('pointerout', () => {
            this.tweens.add({
                targets: addUnitButton,
                scaleX: 1,
                scaleY: 1,
                duration: 100,
                ease: 'Power2'
            });
        });

    const buttonText = this.add.text(centerX, centerY + 300, `Acheter | ${GameState.levelUpCost}$`, {
        font: '24px customFont',
        fill: '#000'
    }).setOrigin(0.5).setDepth(3);

    // Vérification des conditions d'achat
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

    this.time.addEvent({
        delay: 100,
        callback: updateButtonState,
        loop: true
    });

    updateButtonState();

    // Apparition des pièces cachées toutes les 10s
    this.time.addEvent({
        delay: 20000,
        callback: () => spawnHiddenCoin(this),
        loop: true
    });

    // Création des panneaux de fin de partie
    GameState.gameOverPanel = createPanel(this, 'GAME OVER', '#FF0000');
    GameState.winPanel = createPanel(this, 'YOU WIN!', '#00FF00');

    // // Lancement du timer
    // this.time.addEvent({
    //     delay: 1000,
    //     callback: () => updateTimer(this),
    //     loop: true
    // });
}

update() {
}
}

