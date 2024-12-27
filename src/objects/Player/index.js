export function createPlayer(scene, x, y, texture) {
    const player = scene.physics.add.sprite(x, y, texture);
    player.setOrigin(0.5, 0.5);
    player.body.allowGravity = true;
    player.speed = 350;
    player.movement = {
        rightMove: 0,
        leftMove: 0,
        upMove: 0,
        downMove: 0
    };
    player.isChangingTexture = false;
    player.isMovingLeft = false;
    player.isMovingRight = false;
    player.setSize(116, 74);
    scene.add.existing(player);

    return player;
}

function changeTextureSequentially(player, textures, interval) {
    if (player.isChangingTexture) return;

    player.isChangingTexture = true;
    let index = 0;

    const textureInterval = setInterval(() => {
        player.setTexture(textures[index]);
        index++;

        if (index >= textures.length) {
            clearInterval(textureInterval);
            player.isChangingTexture = false;
        }
    }, interval);
}

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

export function handlePlayerInput(scene, player, cursorKeys) {
    if (scene.playerHasDied) {
        return;
    }

    const { left, right, up } = cursorKeys;

    const jumpKey = scene.input.keyboard.addKey('W');
    const spaceKey = scene.input.keyboard.addKey('SPACE');
    const isJumping = up.isDown || jumpKey.isDown || spaceKey.isDown;

    if (isJumping && player.body.blocked.down) {
        player.setVelocityY(-player.speed * 0.85);
    }

    const leftKey = scene.input.keyboard.addKey('A');
    const rightKey = scene.input.keyboard.addKey('D');

    if (left.isDown || leftKey.isDown) {
        player.isMovingLeft = true;
        player.isMovingRight = false;
        player.setVelocityX(-player.speed);

        if (!player.body.blocked.down) {
            player.setTexture("monkey_left_jump_1");
        } else {
            changeTextureSequentially(player, ["monkey_left_1", "monkey_left_2", "monkey_left_3", "monkey_left_1"], 100);
        }
    }
    else if (right.isDown || rightKey.isDown) {
        player.isMovingRight = true;
        player.isMovingLeft = false;
        player.setVelocityX(player.speed);

        if (!player.body.blocked.down) {
            player.setTexture("monkey_right_jump_1");
        } else {
            changeTextureSequentially(player, ["monkey_right_1", "monkey_right_2", "monkey_right_3", "monkey_right_1"], 100);
        }
    }
    else {
        player.setVelocityX(0);
        if (player.body.blocked.down) {
            if (player.isMovingLeft) {
                player.setTexture("monkey_left_1");
            } else {
                player.setTexture("monkey_right_1");
            }
        }
    }
}

