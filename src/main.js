import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import "./styles/styles.scss";

// Function to check if the user is on a phone
const isPhone = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

// If the user is on a phone, display the message
if (isPhone()) {
  const message = `
    <div style="position: fixed;width:80%; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: Arial, sans-serif; color: white; background-color: rgba(0, 0, 0, 0.7); padding: 20px; text-align: center; font-size: 20px; border-radius: 10px;">
      <p><strong>Mobile Version Coming Soon</strong></p>
      <p>Currently, this version of the game is not available on mobile devices. We are actively working on a mobile version, and it will be released soon. Please check back later for updates. Thank you for your patience and understanding!🌳🐒</p>
    </div>
  `;
  document.body.innerHTML = message;
} else {
  // Game configuration if not on a phone
  const config = {
    type: Phaser.WEBGL,
    width: windowWidth,
    height: windowHeight,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 300 },
        debug: false,
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
}
