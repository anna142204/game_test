// main.js
import { Game } from './scenes/game.js';
import { Start } from './scenes/start.js';
import { Infini } from './scenes/infinity.js';

let game;

const config = {
    type: Phaser.AUTO,
   // In your game config:
scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'game-container', // ID of parent div
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800, // Base width
    height: 600 // Base height
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
