import Phaser from "phaser";
import WebFontLoader from "webfontloader";
import { createPlayer, handlePlayerInput } from "../../objects/Player";
import { createGround } from "../../objects/Ground";
import { createPlatforms } from "../../objects/Platform";

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

    WebFontLoader.load({
      google: {
        families: ['Press Start 2P'],
      },
      active: () => {
        this.isFontLoaded = true;
      },
    });
  }

  create() {
    this.highestScore = 0;

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

    const leftThreshold = 500;
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
