
export function createPlayer(scene, x, y, texture) {
    const player = scene.physics.add.sprite(x, y, texture);

    // Set player properties
    player.setOrigin(0.5, 0.5);
    player.body.allowGravity = true;
    player.setCollideWorldBounds(true);

    player.speed = 350;
    player.width = 200;
    player.height = 200;
    player.rightMove = 0;
    player.leftMove = 0;
    player.upMove = 0
    player.downMove = 0;
    scene.add.existing(player);

    return player;
}

export function handlePlayerInput(player, cursorKeys) {
    if (!player.body.blocked.down) {
        if (cursorKeys.left.isDown && player.isMovingLeft) {
            player.setTexture("monkey_left_jump_1");
        } else if (cursorKeys.right.isDown) {
            player.setTexture("monkey_right_jump_1");
        }
    }
    else if (player.body.blocked.down) {
        if (cursorKeys.up.isDown) {
            player.setVelocityY(-player.speed*0.65);
        } else if (cursorKeys.down.isDown) {
            player.setVelocityY(player.speed*0.65);
        } else if (cursorKeys.left.isDown) {
            player.isMovingLeft = true;
            player.isMovingRight = false;
            if (!player.isChangingTexture) {
                player.isChangingTexture = true;
                setTimeout(() => {
                    player.setTexture("monkey_left_1");
                }, 0);

                setTimeout(() => {
                    player.setTexture("monkey_left_2");
                }, 100);

                setTimeout(() => {
                    player.setTexture("monkey_left_3");
                }, 200);

                setTimeout(() => {
                    player.setTexture("monkey_left_1");
                    player.isChangingTexture = false;
                }, 300);
            }

            player.setVelocityX(-player.speed);
        } else if (cursorKeys.right.isDown) {
            player.isMovingRight = true;
            player.isMovingLeft = false;
            if (!player.isChangingTexture) {
                player.isChangingTexture = true;

                setTimeout(() => {
                    player.setTexture("monkey_right_1");
                }, 0);

                setTimeout(() => {
                    player.setTexture("monkey_right_2");
                }, 100);

                setTimeout(() => {
                    player.setTexture("monkey_right_3");
                }, 200);

                setTimeout(() => {
                    player.setTexture("monkey_right_1");
                    player.isChangingTexture = false;
                }, 300);
            }
            player.setVelocityX(player.speed);
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
