import WebFontLoader from "webfontloader";

export const preloadGameScene = (scene) => {
    scene.load.image("monkey_right_1", "/assets/right/monkey1.png");
    scene.load.image("monkey_right_2", "/assets/right/monkey2.png");
    scene.load.image("monkey_right_3", "/assets/right/monkey3.png");
    scene.load.image("monkey_right_jump_1", "/assets/right/monkey7.png");
    scene.load.image("monkey_right_jump_2", "/assets/right/monkey6.png");

    scene.load.image("monkey_left_1", "/assets/left/monkey1.png");
    scene.load.image("monkey_left_2", "/assets/left/monkey2.png");
    scene.load.image("monkey_left_3", "/assets/left/monkey3.png");
    scene.load.image("monkey_left_jump_1", "/assets/left/monkey7.png");
    scene.load.image("monkey_left_jump_2", "/assets/left/monkey6.png");

    scene.load.image("ground", "/assets/ground.png");
    scene.load.image("platform", "/assets/platforms/platform.png");
    scene.load.image("banana", "/assets/banana.png");
    scene.load.image("heart", "/assets/heart.png");

    scene.load.image("death_monkey_right", "/assets/right/monkey8.png");
    scene.load.image("death_monkey_left", "/assets/left/monkey8.png")

    scene.load.image("alien_right_1", "/assets/right/alien/alien1.png");
    scene.load.image("alien_right_2", "/assets/right/alien/alien2.png");
    scene.load.image("alien_right_3", "/assets/right/alien/alien3.png");
    scene.load.image("alien_right_4", "/assets/right/alien/alien4.png");

    scene.load.image("alien_left_1", "/assets/left/alien/alien1.png");
    scene.load.image("alien_left_2", "/assets/left/alien/alien2.png");
    scene.load.image("alien_left_3", "/assets/left/alien/alien3.png");
    scene.load.image("alien_left_4", "/assets/left/alien/alien4.png");

    WebFontLoader.load({
        google: {
            families: ['Press Start 2P'],
        },
        active: () => {
            scene.isFontLoaded = true;
        },
    });
}