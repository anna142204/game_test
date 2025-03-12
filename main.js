// main.js
import { Game } from './scenes/game.js';
import { Start } from './scenes/start.js';
import { Infini } from './scenes/infinity.js';

let game;

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    backgroundColor: "#292039",
    scene: [Start, Game, Infini]
};

function init() {
    game = new Phaser.Game(config);
}

init()
