import { Rocket, Alien } from '../sprites'
import { 
  MAX_BULLETS, TRAVEL_TIME_MS, WORLD_HEIGHT, PLAYER_DEATH_TINT,
  ENEMY_WIN_TINT, WORLD_WIDTH, FACE_DOWN, FACE_RIGHT, FACE_LEFT,
  FACE_UP, LEVEL_2_SCORE, LEVEL_3_SCORE, LEVEL_4_SCORE, GAME_TEXT_OFFSET
} from '../constants'

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
    this.backgrounds = addBackgrounds(this)
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

    spawnNewAlien(this)

    // Setting text about, level, bullet count, and score
    this.level = 1
    this.levelText = this.add.text(WORLD_WIDTH - 68 - GAME_TEXT_OFFSET, GAME_TEXT_OFFSET, 'Level ' + this.level, { fill: '#00ff00'})
    this.bulletInfo = this.add.text(GAME_TEXT_OFFSET, WORLD_HEIGHT - 15 - GAME_TEXT_OFFSET, 'Bullet Info', { fill: '#00ff00' });
    this.scoreText = this.add.text(GAME_TEXT_OFFSET, GAME_TEXT_OFFSET, 'Score: 0', {fill: '#00ff00'});

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
    this.levelText.setText([
      'Level ' + this.level
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
  alien.gotHit()
  rocket.destroy()
  updateScore(this)
  spawnNewAlien(this)
}

/**
 * Adds a new alien to the game (assuming aliens has been instantiated as a group)
 * Randomly chooses a location on one of the Game's edges to spawn alien
 * Also orients alien
 * @param {Game} game 
 */
function spawnNewAlien(game) {
  const seed = Math.floor(Math.random() * 4)
  let x, y, rotation
  if (seed == 0) {
    x = 0
    y = Phaser.Math.Between(0, WORLD_HEIGHT)
    rotation = FACE_RIGHT
  } else if (seed == 1) {
    x = Phaser.Math.Between(0, WORLD_WIDTH)
    y = 0
    rotation = FACE_DOWN
  } else if (seed == 2) {
    x = WORLD_WIDTH
    y = Phaser.Math.Between(0, WORLD_HEIGHT)
    rotation = FACE_LEFT
  } else {
    x = Phaser.Math.Between(0, WORLD_WIDTH)
    y = WORLD_HEIGHT
    rotation = FACE_UP
  }
  const alien = game.aliens.get(x,y)
  alien.rotation = rotation
  alien.assignTarget(game.player, game.score)
}

/**
 * Adds backgrounds into the game in reverse level order so that when the the
 * first level is destroyed, the image underneath will be revealed
 * @param {Game} game 
 * @return {Array} array of images to be deleted with destroy()
 */
function addBackgrounds(game) {
  let level4 = game.add.image(WORLD_WIDTH/2, WORLD_HEIGHT/2, 'background-red')
  let level3 = game.add.image(WORLD_WIDTH/2, WORLD_HEIGHT/2, 'background-purple')
  let level2 = game.add.image(WORLD_WIDTH/2, WORLD_HEIGHT/2, 'background-blue')
  let level1 = game.add.image(WORLD_WIDTH/2, WORLD_HEIGHT/2, 'background-black')
  return [ level1, level2, level3, level4 ]
}


/**
 * Update the score and perform actions that are sensitive to its change
 * @param {Game} game 
 */
function updateScore(game) {
  const newScore = game.score + 1
  game.score = newScore
  if (newScore == LEVEL_2_SCORE) {
    game.level = 2
    game.backgrounds[0].destroy()
  }
  else if (newScore == LEVEL_3_SCORE) {
    game.level = 3
    game.backgrounds[1].destroy()
  }
  else if (newScore == LEVEL_4_SCORE) {
    game.level = 4
    game.backgrounds[2].destroy()
  }
}