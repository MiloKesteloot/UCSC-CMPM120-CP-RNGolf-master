// Code Practice: RNGolf
// Name: Milo Kesteloot
// Date: 1/29/2025
// FINISHED ALL FOUR EXTRA CHALLANGES

'use strict'

let config = {

    type: Phaser.AUTO,
    width: 640,
    height: 960,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: [ Play ],
}

let game = new Phaser.Game(config)

let { width, height } = game.config