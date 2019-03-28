import { WORLD_WIDTH, WORLD_HEIGHT, BULLET_VELOCITY } from '../constants'
/**
 * Class for Rocket like bullets that fire from the ship and remove themselves after going out of the world bounds
 * No need to overwrite contructor here same as regular Sprite
 * inspiration taken from: http://labs.phaser.io/edit.html?src=src\pools\seeded%20pool.js
 */
export class Rocket extends Phaser.GameObjects.Sprite {

  /**
   * Orients the rocket in the given rotation (in radians) and fires towards given coordinates
   * @param {Number} rotation
   * @param {Number} toX 
   * @param {Number} toY 
   */
  fire(rotation, toX, toY) {
    this.rotation = rotation
    this.scene.physics.moveTo(this, toX, toY, BULLET_VELOCITY)
  }

  /**
   * Update function necessary to run with the Game's Physics
   */
  update() {
    let isOutOfBounds = this.x < 0 || this.x > WORLD_WIDTH || this.y < 0 || this.y > WORLD_HEIGHT;
    if (isOutOfBounds) {
      this.destroy();
    }
  }
}