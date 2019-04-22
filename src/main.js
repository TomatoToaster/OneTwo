import "phaser"
import { BootUp, Game } from './scenes'
import { WORLD_WIDTH, WORLD_HEIGHT } from './constants'

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [
    BootUp,
    Game
  ]
}

const game = new Phaser.Game(config)
