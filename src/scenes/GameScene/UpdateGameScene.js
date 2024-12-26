import Phaser from "phaser";
import { handlePlayerInput } from "../../objects/Player";
import { createGround } from "../../objects/Ground";
import { createPlatforms } from "../../objects/Platform";

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const HEALTH_BAR_X = 70;
const HEALTH_BAR_Y = windowHeight - 70;
const HEALTH_BAR_WIDTH = 200;
const HEALTH_BAR_HEIGHT = 20;
const BORDER_RADIUS = 4;
const HEALTH_BAR_DEPTH = 90;
const HEART_ICON_X = 50;
const HEART_ICON_Y = windowHeight - 50;
const BORDER_THICKNESS = 6;

const createPlayerHealthBar = (scene) => {
    scene.add.image(HEART_ICON_X, HEART_ICON_Y, "heart").setScale(1)
        .setScrollFactor(0)
        .setDepth(100);

    scene.healthBarBorder = scene.add.graphics()
        .setScrollFactor(0)
        .setDepth(HEALTH_BAR_DEPTH);
    scene.healthBarBorder.lineStyle(BORDER_THICKNESS, 0x000000, 1);
    scene.healthBarBorder.strokeRoundedRect(HEALTH_BAR_X, HEALTH_BAR_Y, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT, BORDER_RADIUS); // Rounded corners

    scene.healthBarBackground = scene.add.graphics()
        .setScrollFactor(0)
        .setDepth(HEALTH_BAR_DEPTH);
    scene.healthBarBackground.fillStyle(0x000000, 1);
    scene.healthBarBackground.fillRoundedRect(HEALTH_BAR_X, HEALTH_BAR_Y, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT, BORDER_RADIUS); // Rounded corners

    scene.healthBar = scene.add.graphics()
        .setScrollFactor(0)
        .setDepth(HEALTH_BAR_DEPTH);
    scene.healthBar.fillStyle(0xFF0000, 1);
    scene.healthBar.fillRoundedRect(HEALTH_BAR_X, HEALTH_BAR_Y, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT, BORDER_RADIUS);
};

export const updateHealthBar = (scene) => {
    const healthWidth = ((scene.playerHealth / 100) * HEALTH_BAR_WIDTH) + 10;
    const clampedHealthWidth = Phaser.Math.Clamp(healthWidth, 0, HEALTH_BAR_WIDTH);

    scene.healthBar?.clear();
    scene.healthBar?.fillStyle(0xc0200f, 1);
    scene.healthBar?.fillRoundedRect(HEALTH_BAR_X, HEALTH_BAR_Y, clampedHealthWidth, HEALTH_BAR_HEIGHT, BORDER_RADIUS); // Fill with rounded corners  
};


const createInstructionText = (scene) => {
    scene.highestScore = parseInt(localStorage.getItem('highScore')) || 0;

    if (scene.highestScore === 0) {
        const instructions = "- Move with arrow keys or WASD—space bar to jump\n- Collect bananas—you'll need them to crush enemies.\n- Press E or left-click to throw bananas. \n- The higher you go, the more points you earn!";

        // Create the instruction text object but keep it empty initially
        scene.instructionText = scene.add.text(
            scene.cameras.main.width / 2, // Horizontally center
            scene.cameras.main.height + 100, // Near the bottom of the screen
            '', // Start with an empty string for typewriter effect
            {
                fontSize: '16px',
                fill: '#ffffff',
                fontFamily: "'Press Start 2P', sans-serif",
                lineSpacing: 10
            }
        )
            .setDepth(100) // Ensure it's on top of other elements
            .setOrigin(0.5, 1); // Center horizontally and align to the bottom

        let currentText = ''; // Track the current text
        let index = 0; // Track the current character index
        const typingSpeed = 50; // Time between each character (in ms)

        scene.time.addEvent({
            delay: typingSpeed,
            callback: () => {
                if (index < instructions.length) {
                    currentText += instructions.charAt(index);
                    scene.instructionText.setText(currentText);

                    // Keep the text horizontally centered
                    scene.instructionText.x = 0;

                    index++;
                }
            },
            loop: true,
        });
    }

}

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

    createPlayerHealthBar(scene);

    createInstructionText(scene)
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
        const newGroundLeft = createGround(scene, scene.initialGroundX - 1900, windowHeight - 200, "ground", 2000, 100);
        scene.initialGroundX -= 2000;
        scene.physics.add.collider(newGroundLeft, scene.player);
    }
}

export const updatePlatforms = (scene) => {
    if (Math.abs(scene.player.y - scene.lastPlatformY) < 300) {
        createPlatforms(scene, windowWidth, windowHeight, scene.lastPlatformX, scene.totalPlatformsCreated);
        scene.physics.add.collider(scene.player, scene.platforms);
    }

    // if player not on platform remove lastplatformx - used for placing on moving platforms
    if (!scene.physics.collide(scene.player, scene.platforms)) {
        if (scene.player.onPlatform && !scene.player.body.touching.down) {
            scene.player.onPlatform = false;
            scene.player.lastPlatformX = null;
        }
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


const updateDarkerBackground = (scene) => {
    const playerY = window.innerHeight - 237 - scene.player.y;
    const minY = 100;
    const maxY = 1000;
    let darkenFactor = (playerY - minY) / (maxY - minY);
    darkenFactor = darkenFactor * 0.001;
    const darkenedColor = `rgba(135, 206, 235, ${1 - darkenFactor})`;
    scene.cameras.main.setBackgroundColor(darkenedColor);
}

const updateFallDamage = (scene) => {
    const velocityThreshold = 200;
    const maxVelocity = 2000;
    const maxDamage = 100;

    if (scene.player.body.touching.down && scene.player.prevVelocityY > velocityThreshold) {
        const damageFactor = Phaser.Math.Clamp(
            (scene.player.prevVelocityY - velocityThreshold) / (maxVelocity - velocityThreshold),
            0,
            1
        );
        const damage = Math.round(damageFactor * maxDamage);

        scene.playerHealth = Math.max(0, scene.playerHealth - damage);
    }
    scene.player.prevVelocityY = scene.player.body.velocity.y;
}

export const resetAfterDeath = (scene) => {
    setTimeout(() => {
        scene.isFontLoaded = false;
        scene.scoreText = null;
        scene.scene.restart(); // Re-start the scene
        scene.playerHasDied = false;
    }, 2000);
}

const checkPlayerAlive = (scene) => {
    if (scene.playerHealth <= 0 && !scene.playerHasDied) {
        scene.playerHasDied = true;

        if (scene.player.isMovingRight) {
            scene.player.setTexture("death_monkey_right");
        } else {
            scene.player.setTexture("death_monkey_left");
        }

        scene.player.body.setVelocity(0, 0);
        scene.player.setActive(false);
        resetAfterDeath(scene);
    }
};

export const updateGameScene = (scene) => {
    if (scene.isFontLoaded && !scene.scoreText) {
        initializeUI(scene);
    }
    if (scene.isFontLoaded && scene.scoreText) {
        updateScore(scene);
    }
    handlePlayerInput(scene, scene.player, scene.cursor);
    updateGround(scene);
    updatePlatforms(scene);

    updateDarkerBackground(scene);
    updateFallDamage(scene);
    updateHealthBar(scene);
    checkPlayerAlive(scene); // Now safe to call repeatedly
};
