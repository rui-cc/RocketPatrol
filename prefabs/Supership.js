// Supership prefab
class Supership extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); // add to existing scene, displayList, updateList
        // store pointValue
        this.points = pointValue;
    }

    update(){
        // move supership left
        this.x -= (game.settings.spaceshipSpeed + 1.5);
        // wraparound from left to right edge
        if (this.x <= 0-this.width){
            this.x = game.config.width;
        }
    }

    reset(){
        this.x = game.config.width;
    }
}