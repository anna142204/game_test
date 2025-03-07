import { GAME_KEY } from "../js/constants.js";

export class Start extends Phaser.Scene {
    constructor() {
        super({ key: 'Start' });
    }

    preload() {
        this.load.font('customFont', 'assets/SourGummy-VariableFont_wdth,wght.ttf');
        this.load.image('unit', 'assets/chat.png');
    }

    create() {
        // Calculer la taille initiale de la fenêtre
        this.updateUI(window.innerWidth);

        // Écouteur d'événement pour le redimensionnement
        window.addEventListener('resize', () => {
            this.updateUI(window.innerWidth);
        });
    }

    updateUI(width) {
        const height = window.innerHeight;
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Définir le facteur de mise à l'échelle basé sur la largeur de l'écran
        let scaleFactor;
        if (width < 768) {
            scaleFactor = 1.5;
        } else {
            scaleFactor = 1;
        }
console.log(scaleFactor)
        // Appliquer la mise à l'échelle
        this.cameras.main.setZoom(scaleFactor);

        // Titre du jeu
        this.add.text(centerX, centerY - 130 * scaleFactor, `${GAME_KEY}`, {
            font: `${80 * scaleFactor}px customFont`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6 * scaleFactor
        }).setOrigin(0.5);

        // Image principale
        this.add.image(centerX, centerY + 10 * scaleFactor, 'unit').setScale(scaleFactor);

        // Bouton "Infinity mode"
        const infiniModeBtn = this.add.rectangle(centerX - 100 * scaleFactor, centerY + 150 * scaleFactor, 180 * scaleFactor, 60 * scaleFactor, 0xfffd77, 0.8)
            .setStrokeStyle(3 * scaleFactor, 0x000000)
            .setInteractive()
            .setDepth(2)
            .on('pointerdown', () => {
                this.scene.start('Infini');
            });

        this.add.text(centerX - 100 * scaleFactor, centerY + 150 * scaleFactor, `Infinity mode`, {
            font: `${24 * scaleFactor}px customFont`,
            fill: '#000'
        }).setOrigin(0.5).setDepth(3);

        // Bouton "Level mode"
        const levelModeBtn = this.add.rectangle(centerX + 100 * scaleFactor, centerY + 150 * scaleFactor, 180 * scaleFactor, 60 * scaleFactor, 0xfffd77, 0.8)
            .setStrokeStyle(3 * scaleFactor, 0x000000)
            .setInteractive()
            .setDepth(2)
            .on('pointerdown', () => {
                this.scene.start('Game');
            });

        this.add.text(centerX + 100 * scaleFactor, centerY + 150 * scaleFactor, `Level mode`, {
            font: `${24 * scaleFactor}px customFont`,
            fill: '#000'
        }).setOrigin(0.5).setDepth(3);

        // Texte "made by Spilana"
        this.add.text(centerX, centerY * 1.8, "made by Spilana", {
            fontSize: `${16 * scaleFactor}px`,
            fill: '#ffffff',
        }).setOrigin(0.5);
    }
}