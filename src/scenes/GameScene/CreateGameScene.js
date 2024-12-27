import { createGround } from "../../objects/Ground";
import { createPlayer } from "../../objects/Player";
import { createPlatforms } from "../../objects/Platform";

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
export function throwBanana(scene, targetX, targetY) {
    if (scene.bananaCounter <= 0) return;

    scene.bananaCounter--;
    scene.bananaCounterText.setText(`X ${scene.bananaCounter}`);

    const banana = scene.physics.add.sprite(scene.player.x, scene.player.y, 'banana').setScale(0.5);

    banana.body.setAllowGravity(true);

    const mouseWorldPos = scene.cameras.main.getWorldPoint(targetX, targetY);
    const mouseWorldX = mouseWorldPos.x;
    const mouseWorldY = mouseWorldPos.y;

    const dx = mouseWorldX - scene.player.x;
    const dy = mouseWorldY - scene.player.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const velocityX = (dx / distance) * 700;
    const velocityY = (dy / distance) * 700;

    banana.body.setVelocity(velocityX, velocityY);

    banana.rotation = Math.atan2(dy, dx);

    scene.time.addEvent({
        delay: 3000,
        callback: () => banana.destroy(),
        callbackScope: scene
    });

    scene.physics.add.collider(banana, scene.aliens, (banana, alien) => {
        alien.destroyAlien();
        banana.destroy();
    });
}

export const createGameScene = (scene) => {
    scene.bananaCounter = 0;
    scene.playerHealth = 100;
    scene.platforms = scene.physics.add.group({
        immovable: true,
        allowGravity: false,
    });
    scene.highestScore = 0;
    scene.aliens = scene.physics.add.group({ 
        immovable: true,
        allowGravity: false,
    });

    scene.lastPlatformX = 100;
    scene.totalPlatformsCreated = 0;
    const baseColor = "#87CEEB";
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
    scene.physics.add.collider(scene.player, scene.platforms, (player, platform) => {
        if (player.body.touching.down && platform.body.touching.up) {
            if (!player.onPlatform) {
                player.lastPlatformX = platform.x;
                player.onPlatform = true;
            }
            const platformDeltaX = platform.x - player.lastPlatformX;

            player.x += platformDeltaX;

            player.lastPlatformX = platform.x;
        }
    });
    scene.cameras.main.startFollow(scene.player);

    scene.input.on('pointerdown', (pointer) => {
        if (scene.bananaCounter > 0) {
            throwBanana(scene, pointer.x, pointer.y);
        }
    });
};
