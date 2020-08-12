let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 320,
    physics: {
        default: 'arcade'
    },
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update
    },
    audio: {         
        disableWebAudio: true     
    }
};

// Déclaration de nos variables globales
var game = new Phaser.Game(config);
var playerFrog, mumFrog, deadFrog;
var frogSpeed;
var cars;
var carSpeed;
var myHeart, heartScale;
var down, up, left, right;
var carName;

//
function init() {
     frogSpeed= 16;
     carSpeed = 100;
     heartScale = 0.1;
     cars = new Array();
     carName = ["f1", "car", "snowcar"]; 
}

function preload() {
    this.load.image('frog', './assets/images/Frog.png');
    this.load.image('heart', './assets/images/heart.png');
    this.load.image('f1', './assets/images/F1-1.png');
    this.load.image('car', './assets/images/car.png');
    this.load.image('snowcar', './assets/images/snowCar.png');
    this.load.image('background', './assets/images/FroggerBackground.png');
    this.load.image('mumfrog', './assets/images/MumFrog.png');
    this.load.image('deadfrog', './assets/images/deadFrog.png');
    this.load.audio('smashedFrog', './assets/audio/smashed.wav'); 
    this.load.audio('frogSound', './assets/audio/coaac.wav');
    this.load.audio('trafic', './assets/audio/trafic.wav');
}

function create() {
    this.add.sprite(240, 160, 'background');
    myHeart = this.add.sprite(1000, 160, 'heart');
    mumFrog = this.add.sprite((Math.round(Math.random()*29)+1)*16, 8, 'mumfrog');
    playerFrog = this.physics.add.image(240, 312, 'frog');
    
    for(let i=0; i<36; i++) {
        let car = this.physics.add.image(80*(i%6)+Phaser.Math.Between(0, 30) , (Math.floor(i/6)*40)+60, carName[Phaser.Math.Between(0,2)]);
        if(i<18) {
            car.setVelocity(-carSpeed, 0);
            car.setAngle(180);
        }
        else car.setVelocity(carSpeed, 0);
        cars.push(car);
    }
    down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    let traficSound = this.sound.add('trafic');
    traficSound.play({             
                     loop: true         
                     });
}

function update() {
    cursors = this.input.keyboard.createCursorKeys();
    
    if (Phaser.Input.Keyboard.JustDown(down)&&(playerFrog.y<310)){
        playerFrog.setAngle(180);
        playerFrog.y += frogSpeed;
        let frogSound = this.sound.add('frogSound');
        frogSound.play();
    }
    
    if (Phaser.Input.Keyboard.JustDown(up)&&(playerFrog.y>10)){
        playerFrog.setAngle(0);
        playerFrog.y -= frogSpeed;
        let frogSound = this.sound.add('frogSound');
        frogSound.play(); 
    }
    if (Phaser.Input.Keyboard.JustDown(left)&&(playerFrog.x>0)){
        playerFrog.setAngle(-90);
        playerFrog.x -= frogSpeed;
        let frogSound = this.sound.add('frogSound');
        frogSound.play();
    }
    
    if (Phaser.Input.Keyboard.JustDown(right)&&(playerFrog.x<480)){
        playerFrog.setAngle(90);
        playerFrog.x += frogSpeed;
        let frogSound = this.sound.add('frogSound');
        frogSound.play();
    }
    
    for(let i=0; i<cars.length; i++) {
        if(cars[i].x>500) cars[i].x = -16;
        if(cars[i].x<-20) cars[i].x = 499;
    }

     for(let i=0; i<cars.length; i++) {
        if(Phaser.Geom.Intersects.RectangleToRectangle(playerFrog.getBounds(),  cars[i].getBounds())) {
            this.add.sprite(playerFrog.x, playerFrog.y, 'deadfrog');
            playerFrog.x=-100;
            let smashedSound = this.sound.add('smashedFrog');
            smashedSound.play();
            let timer = this.time.addEvent({     
                delay: 4000, 
                callback: function(){this.scene.restart();},
                callbackScope: this,     
                repeat: 0 });
        };
     }
    
    if(Phaser.Geom.Intersects.RectangleToRectangle(playerFrog.getBounds(),mumFrog.getBounds())) {
        myHeart.x=240;
        frogSpeed = 0;
        myHeart.setScale(heartScale, heartScale);
        heartScale += 0.01;
        if(heartScale>2) this.scene.restart();
    };
    
    
}
