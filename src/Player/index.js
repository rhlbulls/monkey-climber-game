
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
    if (cursorKeys.up.isDown && player.body.blocked.down) {

        player.setVelocityY(-player.speed / 2); // Jump when on the ground
        // Delay texture change with a setTimeout for each step

    } else if (cursorKeys.down.isDown) {
        player.setVelocityY(player.speed / 2);

    } else if (cursorKeys.left.isDown) {
        if (!player.isChangingTexture) {
            player.isChangingTexture = true; // Set flag to indicate texture change in progress

            // Delay texture change with a setTimeout for each step
            setTimeout(() => {
                player.setTexture("monkey_left_1");
            }, 0);  // Immediate setTexture change

            setTimeout(() => {
                player.setTexture("monkey_left_2");
            }, 100); // Change after 300ms

            setTimeout(() => {
                player.setTexture("monkey_left_3");
            }, 200); // Change after 600ms

            setTimeout(() => {
                player.setTexture("monkey_left_1");
                player.isChangingTexture = false; // Reset texture change flag
            }, 300); // Change back after 900ms
        }

        player.setVelocityX(-player.speed);
    } else if (cursorKeys.right.isDown) {
        if (!player.isChangingTexture) {
            player.isChangingTexture = true; // Set flag to indicate texture change in progress

            // Delay texture change with a setTimeout for each step
            setTimeout(() => {
                player.setTexture("monkey_right_1");
            }, 0);  // Immediate setTexture change

            setTimeout(() => {
                player.setTexture("monkey_right_2");
            }, 100); // Change after 300ms

            setTimeout(() => {
                player.setTexture("monkey_right_3");
            }, 200); // Change after 600ms

            setTimeout(() => {
                player.setTexture("monkey_right_1");
                player.isChangingTexture = false; // Reset texture change flag
            }, 300); // Change back after 900ms
        }
        player.setVelocityX(player.speed);
    } else {
        player.setVelocityX(0);
    }
}
