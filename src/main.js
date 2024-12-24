import Phaser from "phaser";
import WebFontLoader from "webfontloader";
import { createPlayer, handlePlayerInput } from "./Player";
import { createGround } from "./Ground";
import { createPlatforms } from "./Platform";
import "./styles.scss";

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const sizes = {
  width: windowWidth,
  height: windowHeight,
};

const speedDown = 300;

function createGameScene() {
  return {
    player: null,
    ground: null,
    cursor: null,
    lastGroundX: 0,
    initialGroundX: 0,
    totalPlatformsCreated: 0,
    lastPlatformX: 0,
    lastPlatformY: 0,
    scoreText: null,
    highestScore: 0,
    bestScoreText: null,
    isFontLoaded: false,  // Flag to track font loading

    preload() {
      this.load.image("monkey_right_1", "/assets/right/monkey1.png");
      this.load.image("monkey_right_2", "/assets/right/monkey2.png");
      this.load.image("monkey_right_3", "/assets/right/monkey3.png");
      this.load.image("monkey_right_jump_1", "/assets/right/monkey7.png");
      this.load.image("monkey_right_jump_2", "/assets/right/monkey6.png");

      this.load.image("monkey_left_1", "/assets/left/monkey1.png");
      this.load.image("monkey_left_2", "/assets/left/monkey2.png");
      this.load.image("monkey_left_3", "/assets/left/monkey3.png");
      this.load.image("monkey_left_jump_1", "/assets/left/monkey7.png");
      this.load.image("monkey_left_jump_2", "/assets/left/monkey6.png");

      this.load.image("ground", "/assets/ground.png");
      this.load.image("platform", "/assets/platforms/platform.png");

      this.load.image("banana", "/assets/banana.png");

      // Load the font asynchronously
      WebFontLoader.load({
        google: {
          families: ['Press Start 2P'],
        },
        active: () => {
          // Set the font loaded flag to true
          this.isFontLoaded = true;
        },
      });
    },

    create() {
      this.highestScore = 0;
      this.bananaCounter = 0;  // Initialize banana counter

      this.lastPlatformX = windowWidth / 2;
      this.totalPlatformsCreated = 0;
      this.cameras.main.setBackgroundColor("#87CEEB");
      const groundWidth = 2000;
      const groundHeight = 100;

      this.ground = createGround(this, 0, windowHeight - 200, "ground", groundWidth, groundHeight);
      this.lastGroundX = groundWidth;
      this.initialGroundX = 0;

      this.player = createPlayer(this, 100, windowHeight - 233, "monkey_right_1");
      this.physics.add.collider(this.ground, this.player);
      this.cursor = this.input.keyboard.createCursorKeys();
      this.platforms = createPlatforms(this, windowWidth, windowHeight, this.lastPlatformX, this.totalPlatformsCreated);
      this.physics.add.collider(this.player, this.platforms);
      this.cameras.main.startFollow(this.player);
    },

    update() {
      // Only create score text after the font is loaded and ensure it's not created again
      if (this.isFontLoaded && !this.scoreText) {
        this.scoreText = this.add.text(20, 30, "Score: 0", {
          fontSize: "32px",
          fill: "#FFD700",
          fontFamily: "'Press Start 2P', sans-serif",
          stroke: "#000",
          strokeThickness: 4,
        })
          .setShadow(2, 2, "#000", 3, true, true)
          .setScrollFactor(0)
          .setDepth(100);

        // Create and always show the "Best" score text
        this.bestScoreText = this.add.text(20, 70, "Best: 0", {
          fontSize: "24px",
          fill: "#FFFFFF",
          fontFamily: "'Press Start 2P', sans-serif",
          stroke: "#000",
          strokeThickness: 3,
        })
          .setShadow(2, 2, "#000", 3, true, true)
          .setScrollFactor(0)
          .setDepth(100);

        // Add banana counter image and text
        this.bananaCounterImage = this.add.image(windowWidth - 150, 60, "banana")
          .setScale(0.5)
          .setScrollFactor(0)
          .setDepth(100);
        this.bananaCounterText = this.add.text(windowWidth - 100, 50, "X 0", {
          fontSize: "24px",
          fill: "#FFFFFF",
          fontFamily: "'Press Start 2P', sans-serif",
          stroke: "#000",
          strokeThickness: 3,
        })
          .setScrollFactor(0)
          .setDepth(100);
      }

      handlePlayerInput(this.player, this.cursor);

      const threshold = 1000;
      if (this.player.x + threshold > this.lastGroundX) {
        const newGround = createGround(this, this.lastGroundX, windowHeight - 200, "ground", 2000, 100);
        this.lastGroundX += 2000;
        this.physics.add.collider(newGround, this.player);
      }

      const leftThreshold = 500;
      if (this.player.x - leftThreshold < this.initialGroundX) {
        const newGroundLeft = createGround(this, this.initialGroundX - 2000, windowHeight - 200, "ground", 2000, 100);
        this.initialGroundX -= 2000;
        this.physics.add.collider(newGroundLeft, this.player);
      }

      if (Math.abs(this.player.y - this.lastPlatformY) < 300) {
        this.platforms = createPlatforms(this, windowWidth, windowHeight, this.lastPlatformX, this.totalPlatformsCreated);
        this.physics.add.collider(this.player, this.platforms);
      }

      // Update the score
      const heightAboveGround = Math.max(0, windowHeight - 237 - this.player.y);
      const currentScore = Math.floor(heightAboveGround);
      if (this.scoreText) {
        this.scoreText.setText(`Score: ${currentScore}`);
      }

      // Update the "Best" score if a new highest score is achieved
      if (currentScore > this.highestScore) {
        this.highestScore = currentScore;
        if (this.bestScoreText) {
          this.bestScoreText.setText(`Best: ${this.highestScore}`);
        }
      }

      // Update the banana counter
      if (this.bananaCounterText) {
        this.bananaCounterText.setText(`X ${this.bananaCounter}`);
      }
    }

  };
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: speedDown,
      },
      debug: true,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [createGameScene()],
};

const game = new Phaser.Game(config);
