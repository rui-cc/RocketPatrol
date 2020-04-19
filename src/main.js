// Name: Rui Chen
// Points Breakdown: Total-100
//    (10)Add your own (copyright-free) background music to the Play scene
//    (10)Allow the player to control the Rocket after it's fired
//    (15)Replace the UI borders with new artwork
//    (15)Create a new title screen
//    (25)Create a new spaceship type (w/ new artwork) that's smaller, 
//        moves faster, and is worth more points
//    (25)Create new artwork for all of the in-game assets (rocket, 
//        spaceships, explosion)
// Music: Super Mario(Chinese Version) by a unknown musician.
// New artworks are all drawn by myself.

let config ={
    tyoe: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play]
}

let game = new Phaser.Game(config);

//define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000
}

//reserve keyboard vars
let keyB, keyLEFT, keyRIGHT, keyR, keyUP, keyDOWN;
