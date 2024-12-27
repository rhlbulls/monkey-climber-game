import Phaser from "phaser";
import { preloadGameScene } from "./PreloadGameScene";
import { createGameScene } from "./CreateGameScene";
import { updateGameScene } from "./UpdateGameScene";

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
    this.instructionText = null;
    this.playerHealth = 100;
    this.bananaCounterText = null;
    this.aliens = null;
  }

  preload() {
    preloadGameScene(this)
  }

  create() {
    createGameScene(this)
  }

  update() {
    updateGameScene(this)
  }

}
