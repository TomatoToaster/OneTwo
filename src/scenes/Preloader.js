/**
 * Preloader Scene that will import all of the images before starting the Game
 */
export class Preloader extends Phaser.Scene {
  constructor() {
    super({
      key: 'preloader'
    })
  }
  preload() {
    this.load.image('player', '/assets/player_ship.png')
    this.load.image('alien', '/assets/alien.png')
    this.load.image('rocket', '/assets/rocket.png')
    console.log('Preloader preload')
  }

  create() {
    this.scene.start('game');
    console.log('Preloader create')
  }
}