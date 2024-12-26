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
    scene.load.image("heart","/assets/heart.png");
    WebFontLoader.load({
        google: {
            families: ['Press Start 2P'],
        },
        active: () => {
            scene.isFontLoaded = true;
        },
    });
}