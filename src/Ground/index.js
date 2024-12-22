
export function createGround(scene, x, y, texture) {
  const ground = scene.physics.add.staticImage(x, y, texture);
  ground.setOrigin(0, 0);
  ground.setScale(1, 1);
  ground.refreshBody();

  return ground;
}
