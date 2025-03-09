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
        this.updateUI();

        // Gestion du redimensionnement
        this.scale.on('resize', (gameSize) => {
            this.updateUI(gameSize.width, gameSize.height);
        });
    
    }

    updateUI(width = this.scale.width, height = this.scale.height) {

        const centerX = width / 2;
        const centerY = height / 2;
        
        // Effacer les éléments existants avant de les recréer (utile en cas de resize)
        this.children.removeAll();

        // **Facteur d'échelle basé sur la hauteur de l'écran**
        let scaleFactor;
        if(width<=980){
            scaleFactor=2.1;
        }else{
            scaleFactor = 1.1;
        }
       

        // Titre du jeu
        this.add.text(centerX, centerY - 130 * scaleFactor, `${GAME_KEY}`, {
            font: `${80 * scaleFactor}px customFont`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6 * scaleFactor
        }).setOrigin(0.5);

        // Image centrale (ajustée en taille)
        this.add.image(centerX, centerY + 10 * scaleFactor, 'unit')
            .setScale(scaleFactor);

        // Boutons de mode de jeu
        this.createButton(centerX - 100 * scaleFactor, centerY + 150 * scaleFactor, 'Infinity mode', () => this.scene.start('Infini'), scaleFactor);
        this.createButton(centerX + 100 * scaleFactor, centerY + 150 * scaleFactor, 'Level mode', () => this.scene.start('Game'), scaleFactor);

        // Crédit
        this.add.text(centerX, height * 0.9, "made by Spilana", {
            fontSize: `${16 * scaleFactor}px`,
            fill: '#ffffff',
        }).setOrigin(0.5);
    }

    createButton(x, y, text, callback, scaleFactor) {
        const button = this.add.rectangle(x, y, 180 * scaleFactor, 60 * scaleFactor, 0xfffd77, 0.8)
            .setStrokeStyle(3 * scaleFactor, 0x000000)
            .setInteractive()
            .setDepth(2)
            .on('pointerdown', callback);

        const buttonText = this.add.text(x, y, text, {
            font: `${24 * scaleFactor}px customFont`,
            fill: '#000'
        }).setOrigin(0.5).setDepth(3);
    }
}
