import { ENEMY_ROTATION_SPEED, ENEMY_SPEED } from '../constants'

const ENEMY_ROTATION_SPEED_IN_DEGREES = Phaser.Math.RadToDeg(ENEMY_ROTATION_SPEED)

const TOLERANCE = 0.01 * ENEMY_ROTATION_SPEED
const sin = Math.sin, cos = Math.cos, atan2 = Math.atan2

/**
 * Enemy Sprite that tries to follow the player by slowly rotating their path towards them
 * Inspiration taken from samme through https://codepen.io/samme/pen/JBwWLN?editors=0010
 */
export class Alien extends Phaser.GameObjects.Sprite {

  /**
   * Assigns a new target for the Alien to follow
   * @param {ArcadeSprite} target 
   */
  assignTarget(target) {
    this.target = target
    this.body.setCollideWorldBounds(true)
  }

  /**
   * Update function necessary to run with the Game's Physics
   */
  update() {
    // Only move the Alien if it has been assigned a valid target
    if (this.target) {
      this.targetFollow()
      this.scene.physics.velocityFromRotation(this.rotation, ENEMY_SPEED, this.body.velocity)
    }
  }

  /**
   * Makes this Alien follow the assigned target
   */
  targetFollow() {
    const angleToPointer = Phaser.Math.Angle.BetweenPoints(this, this.target)
    let angleDelta = angleToPointer - this.rotation
    
    angleDelta = atan2(sin(angleDelta), cos(angleDelta))

    if (Phaser.Math.Within(angleDelta, 0, TOLERANCE)) {
      this.body.rotation = angleToPointer
      this.body.setAngularVelocity(0)
    } else {
      this.body.setAngularVelocity(Math.sign(angleDelta) * ENEMY_ROTATION_SPEED_IN_DEGREES)
    }
  }

}