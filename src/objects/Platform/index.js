export function createBanana(scene, x, y) {
    const banana = scene.add.image(x, y, "banana").setScale(0.5);

    scene.physics.world.enable(banana);
    banana.body.setAllowGravity(false);

    banana.body.setImmovable(true);

    scene.physics.add.collider(scene.player, banana, () => {
        banana.destroy();
        scene.bananaCounter++;
        if (scene.bananaCounterText) {
            scene.bananaCounterText.setText(`Bananas: ${scene.bananaCounter}`);
        }
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

function updateBananaCounterText(scene) {
    if (scene.bananaCounterText) {
        scene.bananaCounterText.setText(`Bananas: ${scene.bananaCounter}`);
    }
}

function createSlidingPlatform(scene, x, y, slideRange, slideSpeed) {
    const platform = scene.platforms.create(x, y, "platform")
        .setOrigin(0.5, 0.5);

    platform.initialX = x;
    platform.slideRange = slideRange;
    platform.slideSpeed = slideSpeed;
    platform.isSliding = true;

    scene.events.on('update', () => {
        const elapsed = scene.time.now;
        const slideOffset = Math.sin(elapsed * slideSpeed) * slideRange;

        platform.x = platform.initialX + slideOffset;
        platform.body.updateFromGameObject();
    });
}



function createPlatformAndBanana(scene, x, y, platformWidth, platformHeight) {
    const isSliding = Math.random() > 0.8;

    if (isSliding) {
        const slideRange = Math.random() * 100 + 50;
        const slideSpeed = 0.001 + Math.random() * 0.0005;
        createSlidingPlatform(scene, x, y, slideRange, slideSpeed);

    } else {
        scene.platforms.create(x, y, "platform")
            .setSize(platformWidth, platformHeight)
            .setOrigin(0.5, 0.5);

        if (Math.random() > 0.7) {
            createBanana(scene, x, y - 40);
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

        createPlatformAndBanana(scene, x, y, platformWidth, platformHeight);

        updateBananaCounterText(scene);

        if (i === totalPlatformsCreated + 9) {
            scene.lastPlatformY = y;
            scene.lastPlatformX = x;
        }
    }

    scene.totalPlatformsCreated += 10;
}
