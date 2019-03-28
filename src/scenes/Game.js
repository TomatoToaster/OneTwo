import { Rocket, Alien } from '../sprites'
import { MAX_BULLETS, TRAVEL_TIME_MS, WORLD_HEIGHT, PLAYER_DEATH_TINT, ENEMY_WIN_TINT } from '../constants'

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
    // Creating the player ship and rotating it to face upwards in the beginning
    this.player = this.physics.add.sprite(400, 300, 'player')
    this.player.rotation = - Phaser.Math.PI2 / 4
    this.player.moveNext = true
    this.player.setCollideWorldBounds(true)
    console.log(this.player)

    // Initializing Score
    this.score = 0

    // Creating the group for the rocket bullets
    this.rockets = this.physics.add.group({
      classType: Rocket, 
      defaultKey: 'rocket',
      maxSize: MAX_BULLETS,
      runChildUpdate: true
    })

    // Creating the group for the enemy Aliens
    this.aliens = this.physics.add.group({
      classType: Alien,
      defaultKey: 'alien',
      runChildUpdate: true
    })

    // Adding overlap collider for player and any alien
    this.physics.add.overlap(this.player, this.aliens, playerHitByAlien, null, this);
    // Adding overlap collider for any alien and any rocket
    this.physics.add.overlap(this.aliens, this.rockets, alienHitByRocket, null, this);

    const alien = this.aliens.get(200, 400)
    alien.assignTarget(this.player)
    console.log(alien)

    // Setting text about bullet count and score
    this.bulletInfo = this.add.text(0, WORLD_HEIGHT - 15, 'Bullet Info', { fill: '#00ff00' });
    this.scoreText = this.add.text(0,0, 'Score: 0', {fill: '#00ff00'});

    // Logic for when the player clicks a button
    this.input.on('pointerdown', (pointer) => {
      const playerX = this.player.x
      const playerY = this.player.y
      const toX = pointer.downX;
      const toY = pointer.downY;
      // Logic for if a player should move next
      if (this.player.moveNext) {
        this.player.moveNext = false
        this.player.rotation = Phaser.Math.Angle.Between(playerX, playerY, toX, toY)
        this.physics.moveTo(this.player, toX, toY, null, TRAVEL_TIME_MS)
        setTimeout(() => {
          this.player.body.stop()
        }, TRAVEL_TIME_MS)
      }
      // Logic for if a player should shoot next
      else {
        this.player.moveNext = true;
        this.player.body.stop()
        this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, toX, toY)
        const rocket = this.rockets.get(playerX, playerY)
        if (rocket) {
          rocket.fire(this.player.rotation, toX, toY)
        }
      }
    })
  }

  update() {
    this.bulletInfo.setText([
      'Bullets Available: ' + this.rockets.getTotalFree()
    ]);
    this.scoreText.setText([
      'Score: ' + this.score
    ]);
  }
}


/**
 * Damage the player if they are hit by an Alien.
 * Currently freezes/ends the game
 * @param {ArcadeSprite} player 
 * @param {Alien} alien 
 */
function playerHitByAlien(player, alien) {
  this.scene.pause()
  player.setTint(PLAYER_DEATH_TINT)
  alien.setTint(ENEMY_WIN_TINT)
}

/**
 * Mark the alien as hit and destroy the rocket
 * @param {Alien} alien 
 * @param {Rocket} rocket 
 */
function alienHitByRocket(alien, rocket) {
  this.score += 1
  alien.gotHit()
  rocket.destroy()
}