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
        if (i === totalPlatformsCreated + 9) {
            scene.lastPlatformY = y;
            scene.lastPlatformX = x;
        }
    }
    scene.totalPlatformsCreated += 10;
    return platformGroup;
}
