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
    
    this.load.image('player', '/OneTwoAssets/player_ship.png')
    this.load.image('alien', '/OneTwoAssets/alien.png')
    this.load.image('rocket', '/OneTwoAssets/rocket.png')
    console.log('Assets Loaded')
  }
}