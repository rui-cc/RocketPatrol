class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    preload(){
        //load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship1', './assets/ship3.png');
        this.load.image('spaceship2', './assets/ship2.png');
        this.load.image('spaceship3', './assets/ship1.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('UI', './assets/UIbg.png');
        this.load.image('super', './assets/super.png');
        //load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        //load background music
        this.load.audio('bg_music', './assets/bg.wav');
    }

    create(){
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        //white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xe6a5c4).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xe6a5c4).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xe6a5c4).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xe6a5c4).setOrigin(0, 0);
        //green UI background
        this.uibg = this.add.tileSprite(37, 42, 566, 64, 'UI').setOrigin(0,0);
        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2 - 8, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);
        //define keys
        keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        //add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship1', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship2', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship3', 0, 10).setOrigin(0, 0);

        //add 1 supership
        this.shipsuper = new Supership(this, game.config.width + 150, 150, 'super', 0, 50).setOrigin(0,0);
        
        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //score
        this.p1Score = 0;
        //this.maxScore = 0;

        //score display
        let scoreConfig = {
            fontFamily: 'Sans-Serif',
            fontSize: '28px',
            backgroundColor: '#f5ef89',
            color: '#000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 70
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        //this.scorehigh = this.add.text(500, 54, this.maxScore, scoreConfig);     
 
        //add music
        this.bgm = this.sound.add('bg_music', {config});
        this.bgm.play();

        //game over flag
        this.gameOver = false;

        //60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'Game Over', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(R) to Restart or ↑ for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            this.bgm.stop();      //bg music stop if game is over
        }, null, this);
    }

    update(){
        //check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyUP)){
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 3;
        this.p1Rocket.update();
        this.ship01.update(); // update spaceships (x3)
        this.ship02.update();
        this.ship03.update();
        this.shipsuper.update(); // update supership

        //check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if(this.checkCollision(this.p1Rocket,this.shipsuper)){  //check super ship collision
            this.p1Rocket.reset();
            this.shipExplode(this.shipsuper);
        }
        if(this.gameOver){
            this.p1Rocket.update();    //update rocket sprite
            this.ship01.update();      //update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.shipsuper.update();   //update supership
        }
    }

    checkCollision(rocket, ship){
        //simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y +ship.height && rocket.height + rocket.y > ship.y){
            return true;
        }else{
            return false;
        }
    }

    shipExplode(ship){
        //temporarily hide ship
        ship.alpha = 0;
        //create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');            //play explode animation
        boom.on('animationcomplete', () => {   //callback after animation
            ship.reset();                      //reset ship position
            ship.alpha = 1;                    //make ship visible again
            boom.destroy();                    //remove explosion sprite
        });
        //score increment and repaint
        if(!this.gameOver){
            this.p1Score += ship.points;
        } 
        //if(this.p1Score > this.maxScore){
            //this.maxScore = this.p1Score;
        //}
        this.scoreLeft.text = this.p1Score;
        //this.scorehigh.text = this.maxScore;
        this.sound.play('sfx_explosion');
    }
}