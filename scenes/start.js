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
        
            let scaleFactor;
            if (width < 990) { 
                scaleFactor = 1.5; 
            } else {
                scaleFactor = 1.1;  
            }
        
            // this.cameras.main.setZoom(scaleFactor);
            if (this.uiGroup) {
                this.uiGroup.clear(true, true);
            } else {
                this.uiGroup = this.add.group();
            }

        const title = this.add.text(centerX, centerY - 130 * scaleFactor, `${GAME_KEY}`, {
            font: `${80 * scaleFactor}px customFont`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6 * scaleFactor
        }).setOrigin(0.5);
        this.uiGroup.add(title);

        const logo = this.add.image(centerX, centerY + 10 * scaleFactor, 'unit').setScale(scaleFactor);
        this.uiGroup.add(logo);

        const infiniModeBtn = this.add.rectangle(centerX - 100 * scaleFactor, centerY + 150 * scaleFactor, 180 * scaleFactor, 60 * scaleFactor, 0xfffd77, 0.8)
            .setStrokeStyle(3 * scaleFactor, 0x000000)
            .setInteractive()
            .setDepth(2)
            .on('pointerdown', () => {
                this.scene.start('Infini');
            });
            this.uiGroup.add(infiniModeBtn);
        const infiniModeBtnText = this.add.text(centerX - 100 * scaleFactor, centerY + 150 * scaleFactor, `Infinity mode`, {
            font: `${24 * scaleFactor}px customFont`,
            fill: '#000'
        }).setOrigin(0.5).setDepth(3);
        this.uiGroup.add(infiniModeBtnText);

        // Bouton "Level mode"
        const levelModeBtn = this.add.rectangle(centerX + 100 * scaleFactor, centerY + 150 * scaleFactor, 180 * scaleFactor, 60 * scaleFactor, 0xfffd77, 0.8)
            .setStrokeStyle(3 * scaleFactor, 0x000000)
            .setInteractive()
            .setDepth(2)
            .on('pointerdown', () => {
                this.scene.start('Game');
            });
            this.uiGroup.add(levelModeBtn);

        const levelModeBtnText = this.add.text(centerX + 100 * scaleFactor, centerY + 150 * scaleFactor, `Level mode`, {
            font: `${24 * scaleFactor}px customFont`,
            fill: '#000'
        }).setOrigin(0.5).setDepth(3);
        this.uiGroup.add(levelModeBtnText);

        // Texte "made by Spilana"
        const signature = this.add.text(centerX, centerY * 1.8, "made by Spilana", {
            fontSize: `${16 * scaleFactor}px`,
            fill: '#ffffff',
        }).setOrigin(0.5);
        this.uiGroup.add(signature);
    }
}
