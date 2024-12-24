import Phaser from "phaser";
import { handlePlayerInput } from "../../objects/Player";
import { createGround } from "../../objects/Ground";
import { createPlatforms } from "../../objects/Platform";
import { preloadGameScene } from "./PreloadGameScene";
import { createGameScene } from "./CreateGameScene";

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.player = null;
    this.ground = null;
    this.cursor = null;
    this.lastGroundX = 0;
    this.initialGroundX = 0;
    this.totalPlatformsCreated = 0;
    this.lastPlatformX = 0;
    this.lastPlatformY = 0;
    this.scoreText = null;
    this.highestScore = 0;
    this.bestScoreText = null;
    this.isFontLoaded = false;
    this.bananaCounter = 0;
  }

  preload() {
    preloadGameScene(this)
  }

  create() {
    createGameScene(this)
  }

  update() {
    if (this.isFontLoaded && !this.scoreText) {
      this.initializeUI();
    }

    handlePlayerInput(this.player, this.cursor);

    this.updateGround();
    this.updatePlatforms();
    this.updateScore();
  }

  initializeUI() {
    this.scoreText = this.add.text(20, 30, "Score: 0", {
      fontSize: "32px",
      fill: "#FFD700",
      fontFamily: "'Press Start 2P', sans-serif",
      stroke: "#000",
      strokeThickness: 4,
    }).setShadow(2, 2, "#000", 3, true, true).setScrollFactor(0).setDepth(100);

    this.bestScoreText = this.add.text(20, 70, "Best: 0", {
      fontSize: "24px",
      fill: "#FFFFFF",
      fontFamily: "'Press Start 2P', sans-serif",
      stroke: "#000",
      strokeThickness: 3,
    }).setShadow(2, 2, "#000", 3, true, true).setScrollFactor(0).setDepth(100);

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
    }).setScrollFactor(0).setDepth(100);
  }

  updateGround() {
    const threshold = 1000;
    if (this.player.x + threshold > this.lastGroundX) {
      const newGround = createGround(this, this.lastGroundX, windowHeight - 200, "ground", 2000, 100);
      this.lastGroundX += 2000;
      this.physics.add.collider(newGround, this.player);
    }

    const leftThreshold = 1000;
    if (this.player.x - leftThreshold < this.initialGroundX) {
      const newGroundLeft = createGround(this, this.initialGroundX - 2000, windowHeight - 200, "ground", 2000, 100);
      this.initialGroundX -= 2000;
      this.physics.add.collider(newGroundLeft, this.player);
    }
  }

  updatePlatforms() {
    if (Math.abs(this.player.y - this.lastPlatformY) < 300) {
      this.platforms = createPlatforms(this, windowWidth, windowHeight, this.lastPlatformX, this.totalPlatformsCreated);
      this.physics.add.collider(this.player, this.platforms);
    }
  }

  updateScore() {
    const heightAboveGround = Math.max(0, windowHeight - 237 - this.player.y);
    const currentScore = Math.floor(heightAboveGround);

    if (this.scoreText) {
      this.scoreText.setText(`Score: ${currentScore}`);
    }

    if (currentScore > this.highestScore) {
      this.highestScore = currentScore;
      if (this.bestScoreText) {
        this.bestScoreText.setText(`Best: ${this.highestScore}`);
      }
    }

    if (this.bananaCounterText) {
      this.bananaCounterText.setText(`X ${this.bananaCounter}`);
    }
  }
}
