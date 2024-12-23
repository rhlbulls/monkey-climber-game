export function createPlatforms(scene, windowWidth, windowHeight) {
    const platformGroup = scene.physics.add.staticGroup(); // Create a static group for platforms
    const platformWidth = 150; // Width of the platform
    const platformHeight = 23; // Height of the platform

    // Generate platforms dynamically
    let lastX = windowWidth / 2; // Starting X position at the center
    for (let i = 0; i < 10; i++) { // Adjust the count to generate more or fewer platforms
        // Randomly choose vertical spacing between 100 and 200
        const verticalSpacing = Math.random() * 10 + 110; // Random vertical spacing between 100 and 200
        const y = windowHeight - (300 + i * verticalSpacing); // Staggered height

        // Randomly choose horizontal spacing between 200 and 350, and direction (left or right)
        const randomOffset = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 100 + 210); // Random offset between 200 and 350

        let x = lastX + randomOffset; // Add random offset to last X position
        
        // Ensure the x position stays within window bounds
        x = Math.max(platformWidth / 2, Math.min(windowWidth - platformWidth / 2, x));

        lastX = x; // Update lastX to current x for the next platform

        // Add platform to the group
        platformGroup.create(x, y, "platform").setSize(platformWidth, platformHeight).setOrigin(0.5, 0.5);
    }

    return platformGroup;
}
