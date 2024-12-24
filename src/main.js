import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import "./styles/styles.scss";

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const config = {
  type: Phaser.WEBGL,
  width: windowWidth,
  height: windowHeight,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [GameScene],
};

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config);
