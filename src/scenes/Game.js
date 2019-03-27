import { Rocket } from '../sprites'
import { MAX_BULLETS, TRAVEL_TIME_MS, BULLET_VELOCITY } from '../constants'

// Travel Time in milliseconds for the ship on click

/***
 * Main Scene where all the game logic happens
 */
export class Game extends Phaser.Scene {
  constructor() {
    super({
      key: 'game'
    })
  }

  create() {
    console.log('Game create');

    // Creating the player ship and rotating it to face upwards
    this.player = this.physics.add.sprite(400, 300, 'player')
    this.player.rotation = - Phaser.Math.PI2 / 4
    this.player.moveNext = true
    this.player.setCollideWorldBounds(true)

    // Creating the group for the rocket bullets
    this.rockets = this.physics.add.group({
      classType: Rocket, 
      defaultKey: 'rocket',
      maxSize: MAX_BULLETS,
      runChildUpdate: true
    })
    // seeing world text for the group
    this.info = this.add.text(0, 0, 'Click to add objects', { fill: '#00ff00' });

    // Logic for when the player clicks a button
    this.input.on('pointerdown', (pointer) => {
      let playerX = this.player.x
      let playerY = this.player.y
      let toX = pointer.downX;
      let toY = pointer.downY;
      // Logic for if a player should move next
      if (this.player.moveNext) {
        this.player.moveNext = false
        this.player.rotation = Phaser.Math.Angle.Between(playerX, playerY, toX, toY)
        this.physics.moveTo(this.player, toX, toY, null, TRAVEL_TIME_MS)
        setTimeout(() => {
          this.player.body.stop()
        }, TRAVEL_TIME_MS)
      }
      // Logic for if a player should shoot
      else {
        this.player.moveNext = true;
        this.player.body.stop()
        this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, toX, toY)
        const rocket = this.rockets.get(playerX, playerY)
        if (rocket) {
          console.log(rocket)
          rocket.rotation = this.player.rotation
          this.physics.moveTo(rocket, toX, toY, BULLET_VELOCITY)
        }
      }
    })
  }

  update() {
    this.info.setText([
      'Bullets Available: ' + this.rockets.getTotalFree()
    ]);
  }

}