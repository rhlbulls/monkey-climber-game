import { createGround } from "../../objects/Ground";
import { createPlayer } from "../../objects/Player";
import { createPlatforms } from "../../objects/Platform";

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

export const createGameScene = (scene) => {
    scene.platforms = scene.physics.add.staticGroup()
    scene.highestScore = 0;

    scene.lastPlatformX = 100;
    scene.totalPlatformsCreated = 0;
    const baseColor = "#87CEEB"; // Light blue base color
    scene.cameras.main.setBackgroundColor(baseColor);
    const groundWidth = 2000;
    const groundHeight = 100;

    scene.ground = createGround(scene, 0, windowHeight - 200, "ground", groundWidth, groundHeight);
    scene.lastGroundX = groundWidth;
    scene.initialGroundX = 0;

    scene.player = createPlayer(scene, 100, windowHeight - 233, "monkey_right_1");
    scene.physics.add.collider(scene.ground, scene.player);
    scene.cursor = scene.input.keyboard.createCursorKeys();
    createPlatforms(scene, windowWidth, windowHeight, scene.lastPlatformX, scene.totalPlatformsCreated);
    scene.physics.add.collider(scene.player, scene.platforms);
    scene.cameras.main.startFollow(scene.player);
};
