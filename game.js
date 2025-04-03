const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: { 
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let hook, fishGroup, shurikenGroup;
let gamePhase = 0;
let caughtFish = [];
let score = 0;
let scoreText;

function preload() {
    this.load.image('hook', 'assets/hook.png');
    this.load.image('fish', 'assets/fish.png');
    this.load.image('shuriken', 'assets/shuriken.png');
    this.load.image('background', 'assets/background.png');
}

function create() {
    // Background
    this.add.image(400, 300, 'background');
    
    // Hook setup
    hook = this.physics.add.sprite(400, 0, 'hook');
    hook.setCollideWorldBounds(true);

    // Fish group
    fishGroup = this.physics.add.group();
    createFish.call(this);

    // Shuriken group
    shurikenGroup = this.physics.add.group();

    // Score display
    scoreText = this.add.text(16, 16, 'Score: 0', { 
        fontSize: '32px', 
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
    });

    // Collision setup
    this.physics.add.overlap(hook, fishGroup, catchFish, null, this);
    this.physics.add.overlap(shurikenGroup, fishGroup, sliceFish, null, this);
}

function update() {
    // Casting phase
    if (gamePhase === 0) {
        if (this.input.activePointer.isDown) {
            hook.setVelocityY(300);
        } else {
            gamePhase = 1;
            hook.setVelocityY(-300);
        }
    }

    // Reeling phase
    if (gamePhase === 1) {
        if (hook.y <= 0) {
            gamePhase = 2;
            launchFish.call(this);
        }
    }

    // Slicing phase
    if (gamePhase === 2 && this.input.activePointer.isDown) {
        const shuriken = shurikenGroup.create(400, 550, 'shuriken');
        this.physics.moveTo(shuriken, this.input.x, this.input.y, 600);
    }
}

function createFish() {
    for (let i = 0; i < 10; i++) {
        let fish = fishGroup.create(
            Phaser.Math.Between(0, 800),
            Phaser.Math.Between(200, 550),
            'fish'
        );
        fish.setVelocityX(Phaser.Math.Between(-50, 50));
        fish.setBounce(1, 0);
        fish.setCollideWorldBounds(true);
    }
}

function catchFish(hook, fish) {
    fish.disableBody(true, true);
    caughtFish.push(fish);
}

function sliceFish(shuriken, fish) {
    shuriken.disableBody(true, true);
    fish.disableBody(true, true);
    score += 100;
    scoreText.setText(`Score: ${score}`);
    
    if (fishGroup.countActive(true) === 0) {
        resetGame.call(this);
    }
}

function resetGame() {
    gamePhase = 0;
    caughtFish = [];
    hook.setPosition(400, 0);
    createFish.call(this);
}

function launchFish() {
    caughtFish.forEach(fish => {
        fish.enableBody(true, hook.x, hook.y, true, true);
        fish.setVelocity(
            Phaser.Math.Between(-200, 200),
            Phaser.Math.Between(-400, -300)
        );
    });
}