/**
 * Preloader Scene that will import all of the images before starting the Game
 */
export class BootUp extends Phaser.Scene {
  constructor() {
    super({
      key: 'preloader'
    })
  }
  preload() {
    console.log('BootUp Preloader starting')
    this.load.on('complete', () => {
      this.scene.start('game')
      console.log('BootUp Preloader done')
    })

    this.load.image('background-black', '/assets/background-black.png')
    this.load.image('background-blue', '/assets/background-blue.png')
    this.load.image('background-purple', '/assets/background-purple.png')
    this.load.image('background-red', '/assets/background-red.png')
    this.load.image('player', '/assets/player_ship.png')
    this.load.image('alien', '/assets/alien.png')
    this.load.image('rocket', '/assets/rocket.png')
    console.log('assets Loaded')
  }
}
