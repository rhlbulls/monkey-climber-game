export function createBanana(scene, x, y) {
    const banana = scene.add.image(x, y, "banana").setScale(0.5);

    scene.physics.world.enable(banana);
    banana.body.setAllowGravity(false);

    banana.body.setImmovable(true);

    scene.physics.add.collider(scene.player, banana, () => {
        banana.destroy();
        scene.bananaCounter++;
    });
}

export function createHeart(scene, x, y) {
    const heart = scene.add.image(x, y, "heart").setScale(0.75);

    scene.physics.world.enable(heart);
    heart.body.setAllowGravity(false);
    heart.body.setImmovable(true);

    heart.flipState = 0;
    heart.flipSpeed = 100;

    heart.bounceSpeed = 0.01;
    heart.bounceHeight = 5;
    heart.initialY = y;

    scene.physics.add.collider(scene.player, heart, () => {
        heart.destroy();
        scene.playerHealth = Math.min(scene.playerHealth + 10, 100);
    });

    scene.events.on('update', () => {
        if (scene.time.now % (heart.flipSpeed * 1000) < heart.flipSpeed * 500) {
            if (heart.flipState === 0) {
                heart.setFlipX(true);
                heart.flipState = 1;
            }
        } else {
            if (heart.flipState === 1) {
                heart.setFlipX(false);
                heart.flipState = 0;
            }
        }

        heart.y = heart.initialY + Math.sin(scene.time.now * heart.bounceSpeed) * heart.bounceHeight;
    });
}

function calculatePlatformX(lastX, windowWidth, platformWidth) {
    let randomOffset = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 100 + 300);
    let x = lastX + randomOffset;
    x = Math.max(platformWidth / 2, Math.min(x, windowWidth - platformWidth / 2));

    return x;
}

function adjustForConsecutivePlatforms(x, lastX, platformWidth) {
    if (Math.abs(x - lastX) < platformWidth) {
        x += Math.random() > 0.5 ? platformWidth : -platformWidth;
    }
    return x;
}

function createSlidingPlatform(scene, x, y, slideRange, slideSpeed) {
    const platform = scene.platforms.create(x, y, "platform")
        .setOrigin(0.5, 0.5);

    platform.initialX = x;
    platform.slideRange = slideRange;
    platform.slideSpeed = slideSpeed;

    scene.events.on('update', () => {
        const elapsed = scene.time.now;
        const slideOffset = Math.sin(elapsed * slideSpeed) * slideRange;

        platform.setX(platform.initialX + slideOffset);
    });
}

function createAlien(scene, x, y, platformWidth, slideSpeed) {
    const alien = scene.add.sprite(x, y - 10, "alien_right_1").setScale(0.5);

    alien.direction = Math.random() > 0.5 ? "right" : "left";
    alien.speed = Math.random() * 50 + 50 + slideSpeed;
    alien.platformWidth = platformWidth;

    const animationFrames = {
        right: ["alien_right_1", "alien_right_2", "alien_right_3", "alien_right_4"],
        left: ["alien_left_1", "alien_left_2", "alien_left_3", "alien_left_4"],
    };

    let currentFrame = 0;
    const frameRate = 4;
    let frameCounter = 0;

    const leftLimit = x - platformWidth / 2 - 50;
    const rightLimit = x + platformWidth / 2 + 50;

    alien.setOrigin(0.5, 1);

    scene.physics.world.enable(alien);
    alien.body.setAllowGravity(false);
    alien.body.setImmovable(true);

    const tween = scene.tweens.add({
        targets: alien,
        x: { from: leftLimit, to: rightLimit },
        duration: (rightLimit - leftLimit) * 700 / alien.speed,
        yoyo: true,
        repeat: -1,
        ease: "Linear",
        onYoyo: () => {
            alien.direction = "left";
        },
        onRepeat: () => {
            alien.direction = "right";
        },
        onUpdate: () => {
            frameCounter++;
            if (frameCounter >= frameRate) {
                frameCounter = 0;
                currentFrame = (currentFrame + 1) % 4;
                alien.setTexture(animationFrames[alien.direction][currentFrame]);
            }
        },
        onStart: () => {
            alien.y = y - 10;
        },
    });

    alien.destroyAlien = () => {
        tween.stop();
        alien.destroy();
    };

    scene.aliens.add(alien);

    scene.physics.add.collider(scene.player, alien, () => {
        if (scene.playerHealth > 0) {
            scene.playerHealth -= 5;
        }

        const pushDirection = alien.direction === "right" ? 50 : -50;

        scene.tweens.add({
            targets: scene.player,
            x: scene.player.x + pushDirection,
            duration: 300,
            ease: "Power2",
        });
    });
}

function createPlatformAndItem(scene, x, y, platformWidth, platformHeight, totalPlatformsCreated) {
    const maxDifficulty = 10;
    const difficultyFactor = (totalPlatformsCreated ?? 0 / maxDifficulty) * 0.01;

    const isSliding = Math.random() > 0.8 - difficultyFactor * 0.1;

    const slideRange = ((Math.random()) * 100 + 50) + difficultyFactor;
    const slideSpeed = ((0.001 + Math.random() + difficultyFactor) * 0.001);
    if (isSliding) {

        createSlidingPlatform(scene, x, y, slideRange, slideSpeed);

    } else {
        scene.platforms.create(x, y, "platform")
            .setSize(platformWidth, platformHeight)
            .setOrigin(0.5, 0.5);

        if (Math.random() > 0.5 + difficultyFactor) {
            createBanana(scene, x, y - 40);
        }
        else if (Math.random() > 0.9 - difficultyFactor) {
            createHeart(scene, x, y - 40);
        } else if (Math.random() > 0.5 - difficultyFactor) {
            createAlien(scene, x, y, platformWidth, slideSpeed);
        }
    }
}

export function createPlatforms(scene, windowWidth, windowHeight, lastX, totalPlatformsCreated) {
    const platformWidth = 150;
    const platformHeight = 23;
    const minHorizontalSpacing = platformWidth + 50;
    const verticalSpacing = 100;

    for (let i = totalPlatformsCreated; i < totalPlatformsCreated + 10; i++) {
        const y = windowHeight - (300 + i * verticalSpacing);

        let x = calculatePlatformX(lastX, windowWidth, platformWidth);

        if (Math.abs(x - lastX) < minHorizontalSpacing) {
            x = lastX + Math.sign(x - lastX) * minHorizontalSpacing;
        }

        x = adjustForConsecutivePlatforms(x, lastX, platformWidth);

        lastX = x;

        createPlatformAndItem(scene, x, y, platformWidth, platformHeight, totalPlatformsCreated);

        if (i === totalPlatformsCreated + 9) {
            scene.lastPlatformY = y;
            scene.lastPlatformX = x;
        }
    }

    scene.totalPlatformsCreated += 10;
}
