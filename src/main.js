import Phaser from "phaser";
import { createPlayer, handlePlayerInput } from "./Player";
import { createGround } from "./Ground";
import { createBackground } from "./Background";
import "./styles.scss";

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const sizes = {
  width: windowWidth,
  height: windowHeight
};

const speedDown = 300;

function createGameScene() {
  return {
    player: null,
    ground: null,
    cursor: null,

    preload() {
      this.load.image("monkey_right_1", "/assets/right/monkey1.png");
      this.load.image("monkey_right_2", "/assets/right/monkey2.png");
      this.load.image("monkey_right_3", "/assets/right/monkey3.png");
      this.load.image("monkey_right_jump_1","/assets/right/monkey7.png");
      this.load.image("monkey_right_jump_2","/assets/right/monkey6.png")

      this.load.image("monkey_left_1", "/assets/left/monkey1.png");
      this.load.image("monkey_left_2", "/assets/left/monkey2.png");
      this.load.image("monkey_left_3", "/assets/left/monkey3.png");
      this.load.image("monkey_left_jump_1","/assets/left/monkey7.png");
      this.load.image("monkey_left_jump_2","/assets/left/monkey6.png")

      this.load.image("ground", "/assets/ground.png");
      this.load.image("bg", "/assets/bg.png");

      this.load.image("stone1", "/assets/stones/stones1.png");
      this.load.image("stone2", "/assets/stones/stones2.png");
      this.load.image("stone3", "/assets/stones/stones3.png");
      this.load.image("stone4", "/assets/stones/stones4.png");
      this.load.image("stone5", "/assets/stones/stones5.png");



    },

    create() {
      this.bg = createBackground(this, 0, 0, "bg");
      this.ground = createGround(this, 0, windowHeight - 200, "ground");
      this.player = createPlayer(this, 100, windowHeight - 300, "monkey_right_1");
      this.physics.add.collider(this.ground, this.player, null, null, this);
      this.cursor = this.input.keyboard.createCursorKeys();      
    },

    update() {
      handlePlayerInput(this.player, this.cursor);
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
        debug: true
      }
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [createGameScene()]
};

const game = new Phaser.Game(config);
