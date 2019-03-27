import { Scene, Math } from 'phaser'

// Travel Time in milliseconds for the ship on click
const TRAVEL_TIME = 500

export class Game extends Scene {
  constructor() {
    super({
      key: 'game'
    })
  }

  create() {
    console.log('Game create');

    // Creating the player ship and rotating it to face upwards
    this.player = this.physics.add.sprite(400, 300, 'player')
    this.player.rotation = - Math.PI2 / 4
    this.player.moveNext = true
    this.player.setCollideWorldBounds(true)
    
    // Logic for when the player clicks a button
    this.input.on('pointerdown', (pointer) => {
      // console.log(pointer)
      // console.log(this.physics)
      // console.log(this.player)
      let playerX = this.player.x
      let playerY = this.player.y
      let toX = pointer.downX;
      let toY = pointer.downY;
      if (this.player.moveNext) {
        this.player.moveNext = false
        this.player.rotation = Math.Angle.Between(playerX, playerY, toX, toY)
        this.physics.moveTo(this.player, toX, toY, null, TRAVEL_TIME)
        setTimeout(() => {
          this.player.body.stop();
        }, TRAVEL_TIME)
      }
      else {
        this.player.moveNext = true;
        this.player.body.stop()
        this.player.rotation = Math.Angle.Between(this.player.x, this.player.y, toX, toY)
        let rocket = this.physics.add.image(playerX, playerY)
      }
    })
  }

}