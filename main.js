// main.js
import { Game } from './scenes/game.js';
import { Start } from './scenes/start.js';
import { Infini } from './scenes/infinity.js';

let game;

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: false, 
    scale: {
        mode: Phaser.Scale.RESIZE, 
        autoCenter: Phaser.Scale.CENTER_BOTH, 
    },
    backgroundColor: "#292039",
    scene: [Start, Game, Infini]
};
window.addEventListener("resize", () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

function init() {
    game = new Phaser.Game(config);
}

init()
