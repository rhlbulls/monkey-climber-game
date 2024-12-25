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

export function createPlatforms(scene, windowHeight, lastX, totalPlatformsCreated) {

    const platformWidth = 150; 
    const platformHeight = 23; 

    const minHorizontalSpacing = platformWidth + 50; 

    const verticalSpacing = 100;
    for (let i = totalPlatformsCreated; i < totalPlatformsCreated + 10; i++) { 
        const y = windowHeight - (300 + i * verticalSpacing); 

        let randomOffset = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 100 + 300);
        let x = lastX + randomOffset;

        if (Math.abs(x - lastX) < minHorizontalSpacing) {
            x = lastX + Math.sign(randomOffset) * minHorizontalSpacing;
        }

        lastX = x; 

        scene.platforms.create(x, y, "platform").setSize(platformWidth, platformHeight).setOrigin(0.5, 0.5);

        if (Math.random() > 0.7) {  
            createBanana(scene,x, y - 40); 
        }

        if (i === totalPlatformsCreated + 9) {
            scene.lastPlatformY = y;
            scene.lastPlatformX = x;
        }
    }
    scene.totalPlatformsCreated += 10;
}
