export function createPlayer(scene, x, y, texture) {
    const player = scene.physics.add.sprite(x, y, texture);

    // Set player properties
    player.setOrigin(0.5, 0.5);
    player.body.allowGravity = true;
    player.setCollideWorldBounds(true);

    player.speed = 350;
    player.width = 200;
    player.height = 200;
    player.movement = {
        rightMove: 0,
        leftMove: 0,
        upMove: 0,
        downMove: 0
    };
    player.isChangingTexture = false;
    player.isMovingLeft = false;
    player.isMovingRight = false;

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

export function handlePlayerInput(player, cursorKeys) {
    const { left, right, up, down } = cursorKeys;

    if (!player.body.blocked.down) {
        if (left.isDown && player.isMovingLeft) {
            player.setTexture("monkey_left_jump_1");
        } else if (right.isDown) {
            player.setTexture("monkey_right_jump_1");
        }
    } else {
        if (up.isDown) {
            player.setVelocityY(-player.speed * 0.65);
        } else if (down.isDown) {
            player.setVelocityY(player.speed * 0.65);
        } else if (left.isDown) {
            player.isMovingLeft = true;
            player.isMovingRight = false;
            player.setVelocityX(-player.speed);

            changeTextureSequentially(player, ["monkey_left_1", "monkey_left_2", "monkey_left_3", "monkey_left_1"], 100);
        } else if (right.isDown) {
            player.isMovingRight = true;
            player.isMovingLeft = false;
            player.setVelocityX(player.speed);

            changeTextureSequentially(player, ["monkey_right_1", "monkey_right_2", "monkey_right_3", "monkey_right_1"], 100);
        } else {
            player.setVelocityX(0);

            if (player.isMovingLeft) {
                player.setTexture("monkey_left_1");
            } else {
                player.setTexture("monkey_right_1");
            }
        }
    }
}
