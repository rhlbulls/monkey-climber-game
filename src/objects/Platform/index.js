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

// Function to calculate the X position for a new platform
function calculatePlatformX(lastX, windowWidth, platformWidth) {
    // Generate random offset for X position within windowWidth range
    let randomOffset = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 100 + 300);
    let x = lastX + randomOffset;

    // Ensure x is within window bounds, accounting for the platform width
    x = Math.max(platformWidth / 2, Math.min(x, windowWidth - platformWidth / 2));

    return x;
}

// Function to adjust X position to avoid consecutive platforms having the same X
function adjustForConsecutivePlatforms(x, lastX, platformWidth) {
    if (Math.abs(x - lastX) < platformWidth) {
        // Adjust the x position slightly
        x += Math.random() > 0.5 ? platformWidth : -platformWidth;
    }
    return x;
}

// Function to create a single platform and optionally a banana
function createPlatformAndBanana(scene, x, y, platformWidth, platformHeight) {
    scene.platforms.create(x, y, "platform")
        .setSize(platformWidth, platformHeight)
        .setOrigin(0.5, 0.5);

    // Optionally create a banana with a certain probability
    if (Math.random() > 0.7) {
        createBanana(scene, x, y - 40);
    }
}

// Function to update the banana counter text if it exists
function updateBananaCounterText(scene) {
    if (scene.bananaCounterText) {
        scene.bananaCounterText.setText(`Bananas: ${scene.bananaCounter}`);
    }
}

// Main function to create platforms
export function createPlatforms(scene, windowWidth, windowHeight, lastX, totalPlatformsCreated) {
    const platformWidth = 150;
    const platformHeight = 23;
    const minHorizontalSpacing = platformWidth + 50;
    const verticalSpacing = 100;

    for (let i = totalPlatformsCreated; i < totalPlatformsCreated + 10; i++) {
        const y = windowHeight - (300 + i * verticalSpacing);

        // Calculate and adjust the X position for the platform
        let x = calculatePlatformX(lastX, windowWidth, platformWidth);
        
        // Ensure minimum horizontal spacing between platforms
        if (Math.abs(x - lastX) < minHorizontalSpacing) {
            x = lastX + Math.sign(x - lastX) * minHorizontalSpacing;
        }

        // Adjust for consecutive platforms having the same X
        x = adjustForConsecutivePlatforms(x, lastX, platformWidth);

        lastX = x;

        // Create platform and possibly a banana
        createPlatformAndBanana(scene, x, y, platformWidth, platformHeight);

        // Update banana counter text
        updateBananaCounterText(scene);

        if (i === totalPlatformsCreated + 9) {
            scene.lastPlatformY = y;
            scene.lastPlatformX = x;
        }
    }

    scene.totalPlatformsCreated += 10;
}
