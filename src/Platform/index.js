export function createBanana(scene, x, y) {
    // Create a static banana (no physics)
    const banana = scene.add.image(x, y, "banana").setScale(0.5);

    // Add a physics collider so the player can interact with it
    scene.physics.world.enable(banana);
    banana.body.setAllowGravity(false); // Disable gravity for the banana

    // Set the banana as a static object, so it doesn't move with gravity or physics forces
    banana.body.setImmovable(true);

    // Collision with player
    scene.physics.add.collider(scene.player, banana, () => {
        banana.destroy(); // Remove the banana completely from the scene
        scene.bananaCounter++; // Increment the banana counter
        if (scene.bananaCounterText) {
            scene.bananaCounterText.setText(`Bananas: ${scene.bananaCounter}`);
        }
    });
}

export function createPlatforms(scene, windowWidth, windowHeight, lastX, totalPlatformsCreated) {
    const platformGroup = scene.physics.add.staticGroup(); // Create a static group for platforms
    const platformWidth = 150; // Width of the platform
    const platformHeight = 23; // Height of the platform

    // Minimum horizontal distance to avoid stacking
    const minHorizontalSpacing = platformWidth + 50; // Ensure no horizontal stacking

    // Constant vertical spacing
    const verticalSpacing = 100;
    for (let i = totalPlatformsCreated; i < totalPlatformsCreated + 10; i++) { // Adjust the count to generate more or fewer platforms
        const y = windowHeight - (300 + i * verticalSpacing); // Staggered height

        // Randomly choose horizontal spacing and direction (left or right)
        let randomOffset = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 100 + 300);
        let x = lastX + randomOffset;

        // Adjust X to maintain minimum horizontal spacing
        if (Math.abs(x - lastX) < minHorizontalSpacing) {
            x = lastX + Math.sign(randomOffset) * minHorizontalSpacing;
        }

        lastX = x; // Update lastX to current x for the next platform

        // Add platform to the group
        platformGroup.create(x, y, "platform").setSize(platformWidth, platformHeight).setOrigin(0.5, 0.5);

        // Randomly place bananas on some platforms
        if (Math.random() > 0.7) {  // 50% chance to place a banana on a platform
            createBanana(scene,x, y - 40); // Adjust the y offset to position the banana on the platform
        }

        if (i === totalPlatformsCreated + 9) {
            scene.lastPlatformY = y;
            scene.lastPlatformX = x;
        }
    }
    scene.totalPlatformsCreated += 10;
    return platformGroup;
}
