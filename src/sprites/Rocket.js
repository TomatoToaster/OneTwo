import { WORLD_WIDTH, WORLD_HEIGHT } from '../constants'
/**
 * Class for Rocket like bullets that fire from the ship and remove themselves after going out of the world bounds
 * No need to overwrite contructor here same as regular Sprite
 * inspiration taken from: http://labs.phaser.io/edit.html?src=src\pools\seeded%20pool.js
 */
export class Rocket extends Phaser.GameObjects.Sprite {

  update() {
    let isOutOfBounds = this.x < 0 || this.x > WORLD_WIDTH || this.y < 0 || this.y > WORLD_HEIGHT;
    if (isOutOfBounds) {
      this.destroy();
    }
  }
}