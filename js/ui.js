// js/ui.js
import { GameState } from "./GameState.js";
import { GAME_KEY } from "./constants.js";

export function updateCoinsDisplay() {
    GameState.coinsText.setText(`${GameState.coins}$`);
}

export function updateTimer(scene) {
    if (!GameState.gameActive || scene.scene.key === 'Infini') return;
    GameState.timeLeft--;
    GameState.timeText.setText(`Time: ${GameState.timeLeft}s`);
    if (GameState.timeLeft <= 0) {
        showPanel(scene, GameState.gameOverPanel);
    }
}

export function createPanel(scene, title, theme, scaleFactor) {
    const panel = scene.add.group();
    
    const overlay = scene.add.rectangle(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY,
        scene.cameras.main.width,
        scene.cameras.main.height,
        0x000000, 0.8
    ).setDepth(10);
    
    const titleText = scene.add.text(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY - 100 * scaleFactor,
        title,
        {
            font: `${80 * scaleFactor}px customFont`,
            fill: theme.gameOverText,
            stroke: '#000000',
            strokeThickness: 8 * scaleFactor
        }
    ).setOrigin(0.5).setDepth(10);
    
    const finalScoreText = scene.add.text(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY - 20 * scaleFactor,
        'Score: 0',
        {
            font: `${40 * scaleFactor}px customFont`,
            fill: '#FFFFFF'
        }
    ).setOrigin(0.5).setDepth(10);
    
    const highScoreText = scene.add.text(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY + 50 * scaleFactor,
        'Highscore: 0',
        {
            font: `${40 * scaleFactor}px customFont`,
            fill: '#FFFFFF'
        }
    ).setOrigin(0.5).setDepth(10);
    
    const replayButton = scene.add.rectangle(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY + 130 * scaleFactor,
        200 * scaleFactor, 60 * scaleFactor, 
        theme.gameOverButton, 0.8
    ).setStrokeStyle(3 * scaleFactor, 0x000000).setInteractive().setDepth(10);
    
    const replayText = scene.add.text(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY + 130 * scaleFactor,
        'REJOUER',
        {
            font: `${30 * scaleFactor}px customFont`,
            fill: '#000000'
        }
    ).setOrigin(0.5).setDepth(10);
    
    replayButton.on('pointerdown', () => {
        resetGame(scene);
    });
    
    panel.add(overlay);
    panel.add(titleText);
    panel.add(finalScoreText);
    panel.add(replayButton);
    panel.add(replayText);
    panel.add(highScoreText);
    panel.finalScoreText = finalScoreText;
    panel.highScoreText = highScoreText;
    panel.setVisible(false);
    
    return panel;
}
export function showPanel(scene, panel) {
const HIGH_SCORE_KEY = `${GAME_KEY}_highScore`;

    GameState.gameActive = false;
    let highScore = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || "0");

    if (GameState.actualMaxLevel > highScore) {
        highScore = GameState.actualMaxLevel;  
        localStorage.setItem(HIGH_SCORE_KEY, highScore);
    }

    if (GameState.timer) {
        GameState.timer.remove();
    }

    panel.finalScoreText.setText(`Score: ${GameState.actualMaxLevel}`);
    panel.highScoreText.setText(`Highscore: ${highScore}`);
    panel.setVisible(true);

    scene.tweens.add({
        targets: panel.getChildren(),
        alpha: { from: 0, to: 1 },
        ease: 'Power3',
        duration: 800,
        stagger: 100
    });
}

export function spawnHiddenCoin(scene) {
    if (!GameState.gameActive) return;
    const centerX = scene.cameras.main.centerX;
    const centerY = scene.cameras.main.centerY;
    const range = 200;
    const x = Phaser.Math.Between(centerX - range, centerX + range);
    const y = Phaser.Math.Between(centerY - range, centerY + range);
    const coin = scene.add.image(x, y, 'coin')
        .setScale(GameState.scaleFactor)
        .setInteractive()
        .setDepth(4);
    coin.on('pointerdown', () => {
        if (!GameState.gameActive) return;
        // scene.sound.play('coinSound');
        GameState.coins += 50;
        updateCoinsDisplay();
        coin.destroy();
        const index = GameState.hiddenCoins.indexOf(coin);
        if (index > -1) {
            GameState.hiddenCoins.splice(index, 1);
        }
    });
    GameState.hiddenCoins.push(coin);
    scene.time.delayedCall(5000, () => {
        if (GameState.hiddenCoins.includes(coin)) {
            coin.destroy();
            const index = GameState.hiddenCoins.indexOf(coin);
            if (index > -1) {
                GameState.hiddenCoins.splice(index, 1);
            }
        }
    });
}

export function resetGame(scene) {
    scene.scene.restart(); 
}