// main.js
import { Game } from './scenes/game.js';
import { Start } from './scenes/start.js';
import { Infini } from './scenes/infinity.js';
import { BootScene } from './scenes/BootScene.js';


let game;

const config = {
    type: Phaser.AUTO,

    parent: 'game-container',
    width: '100%',
    height: '100%',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    render: {
        pixelArt: false,
        antialias: true,
        resolution: window.devicePixelRatio || 1 
    },

    scene: [BootScene, Start, Infini, Game,]
};

function init() {
    game = new Phaser.Game(config);
}

init()
