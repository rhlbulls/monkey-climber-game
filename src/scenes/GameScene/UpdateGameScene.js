import { handlePlayerInput } from "../../objects/Player";
import { createGround } from "../../objects/Ground";
import { createPlatforms } from "../../objects/Platform";

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const createInstructionText = (scene) => {
    scene.highestScore = parseInt(localStorage.getItem('highScore')) || 0;

    if (scene.highestScore === 0) {
        const instructions = "- Move with arrow keys or WASD—space bar to jump\n- Collect bananas—you'll need them to crush enemies.\n- The higher you go, the more points you earn.\n- It gets tougher as you climb. Good luck!";

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


export const updateGameScene = (scene) => {
    if (scene.isFontLoaded && !scene.scoreText) {
        initializeUI(scene);
    }

    handlePlayerInput(scene, scene.player, scene.cursor);

    updateGround(scene);
    updatePlatforms(scene);
    updateScore(scene);
    updateDarkerBackground(scene);


}