import Phaser from "phaser"
import { Preloader, Game } from './scenes'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [
    Preloader,
    Game
  ]
}

const game = new Phaser.Game(config)
