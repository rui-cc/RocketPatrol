class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }

    preload(){
        //load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        //load title screen
        this.load.image('title', './assets/title.png');
    }

    create(){
        //title screen display
        this.title = this.add.tileSprite(0, 0, 640, 480, 'title').setOrigin(0,0);
        // menu display
        let menuConfig = {
            fontFamily: 'Serif',
            fontSize: '34px',
            backgroundColor: '#e6a5c4',
            color: '#482091',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        this.add.text(centerX, centerY - textSpacer, 'Shopping In Quarantine', menuConfig).setOrigin(0.5);
        menuConfig.fontFamily = 'Sans-serif';
        menuConfig.fontSize = '28px';
        menuConfig.backgroundColor = '#f7d1a6';
        this.add.text(centerX, centerY + textSpacer/2, 'Use ← → arrows or mouse to move', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer, 'Use (B) or click to buy)', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#ded197';
        menuConfig.color = '#000';
        this.add.text(centerX, centerY + textSpacer*2, 'Press ↑ for Easy or ↓ for Hard', menuConfig).setOrigin(0.5);

        //define keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keyUP)){
            //easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");           
        }
        if (Phaser.Input.Keyboard.JustDown(keyDOWN)){
            //hard mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
    }
}