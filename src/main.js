import Phaser from "phaser";
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

// Update the Game Scene with Infinite Ground
function createGameScene() {
  return {
    player: null,
    ground: null,
    cursor: null,
    lastGroundX: 0, // To track the position of the last ground segment

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
    },

    create() {
      this.cameras.main.setBackgroundColor("#87CEEB"); // Set background color to sky blue
      const groundWidth = 2000;
      const groundHeight = 100;
      this.ground = createGround(this, 0, windowHeight - 200, "ground", groundWidth, groundHeight);
      this.lastGroundX = groundWidth; // Set initial last ground position
      this.player = createPlayer(this, 100, windowHeight - 300, "monkey_right_1");
      this.physics.add.collider(this.ground, this.player);
      this.cursor = this.input.keyboard.createCursorKeys();
      this.platforms = createPlatforms(this, windowWidth, windowHeight);
      this.physics.add.collider(this.player, this.platforms);
      this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    },

    update() {
      handlePlayerInput(this.player, this.cursor);

      // Check if the player is approaching the edge of the last ground segment
      const threshold = 1000; // Distance before creating the next segment
      if (this.player.x + threshold > this.lastGroundX) {
        const newGround = createGround(this, this.lastGroundX, windowHeight - 200, "ground", 2000, 100);
        this.lastGroundX += 2000; // Update the last ground's position
        this.physics.add.collider(newGround, this.player); // Add collision with new ground
      }
      
    },
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
