import { handlePlayerInput } from "../../objects/Player";
import { createGround } from "../../objects/Ground";
import { createPlatforms } from "../../objects/Platform";

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

export const initializeUI = (scene) => {
    scene.scoreText = scene.add.text(20, 30, "Score: 0", {
        fontSize: "32px",
        fill: "#FFD700",
        fontFamily: "'Press Start 2P', sans-serif",
        stroke: "#000",
        strokeThickness: 4,
    }).setShadow(2, 2, "#000", 3, true, true).setScrollFactor(0).setDepth(100);

    const storedHighScore = localStorage.getItem('highScore');
    scene.highestScore = storedHighScore ? parseInt(storedHighScore) : 0;

    scene.bestScoreText = scene.add.text(20, 70, `Best: ${scene.highestScore}`, {
        fontSize: "24px",
        fill: "#FFFFFF",
        fontFamily: "'Press Start 2P', sans-serif",
        stroke: "#000",
        strokeThickness: 3,
    }).setShadow(2, 2, "#000", 3, true, true).setScrollFactor(0).setDepth(100);

    scene.bananaCounterImage = scene.add.image(windowWidth - 150, 60, "banana")
        .setScale(0.5)
        .setScrollFactor(0)
        .setDepth(100);

    scene.bananaCounterText = scene.add.text(windowWidth - 100, 50, "X 0", {
        fontSize: "24px",
        fill: "#FFFFFF",
        fontFamily: "'Press Start 2P', sans-serif",
        stroke: "#000",
        strokeThickness: 3,
    }).setScrollFactor(0).setDepth(100);
};


export const updateGround = (scene) => {
    const threshold = 1000;
    if (scene.player.x + threshold > scene.lastGroundX) {
        const newGround = createGround(scene, scene.lastGroundX, windowHeight - 200, "ground", 2000, 100);
        scene.lastGroundX += 2000;
        scene.physics.add.collider(newGround, scene.player);
    }

    const leftThreshold = 1000;
    if (scene.player.x - leftThreshold < scene.initialGroundX) {
        const newGroundLeft = createGround(scene, scene.initialGroundX - 2000, windowHeight - 200, "ground", 2000, 100);
        scene.initialGroundX -= 2000;
        scene.physics.add.collider(newGroundLeft, scene.player);
    }
}

export const updatePlatforms = (scene) => {
    if (Math.abs(scene.player.y - scene.lastPlatformY) < 300) {
        createPlatforms(scene, windowWidth, windowHeight, scene.lastPlatformX, scene.totalPlatformsCreated);
        scene.physics.add.collider(scene.player, scene.platforms);
    }
}

export const updateScore = (scene) => {
    const heightAboveGround = Math.max(0, windowHeight - 237 - scene.player.y);
    let currentScore = Math.floor(heightAboveGround) - 11;
    if (currentScore < 0) {
        currentScore = 0
    }
    if (scene.scoreText) {
        scene.scoreText.setText(`Score: ${currentScore}`);
    }

    if (currentScore > scene.highestScore) {
        scene.highestScore = currentScore;

        localStorage.setItem('highScore', scene.highestScore);
        if (scene.bestScoreText) {
            scene.bestScoreText.setText(`Best: ${scene.highestScore}`);
        }
    }

    if (scene.bananaCounterText) {
        scene.bananaCounterText.setText(`X ${scene.bananaCounter}`);
    }
};



export const updateGameScene = (scene) => {
    if (scene.isFontLoaded && !scene.scoreText) {
        initializeUI(scene);
    }

    handlePlayerInput(scene, scene.player, scene.cursor);

    updateGround(scene);
    updatePlatforms(scene);
    updateScore(scene);
}