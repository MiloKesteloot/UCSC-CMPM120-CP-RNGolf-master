class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    genString() {
        let pString = "n/a"
        if (this.shots != 0) {
            pString = ((this.yayShots / this.shots)*100).toFixed(0) + "%"
        }
        return "Shots: " + this.shots + ", Score: " + this.score + ", Accuracy: " + pString
    }

    create() {

        this.shots = 0
        this.yayShots = 0
        this.score = 0

        let scoreConfig = {
			fontFamily: 'Courier',
			fontSize: '28px',
			backgroundColor: '#F3B141',
			color: '#843605',
			align: 'right',
			padding: {
				top: 5,
				bottom: 5,
			},
		}

        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        this.text = this.add.text(10, 10, this.genString(), scoreConfig)


        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, 'cup')
        this.cup.body
            .setCircle(this.cup.width/4)
            .setOffset(this.cup.width/4)
            .setImmovable(true)
        
        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height/10, 'ball')
        this.ball.body
            .setCircle(this.ball.width/2)
            .setCollideWorldBounds(true)
            .setBounce(0.5)
            .setDamping(true)
            .setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height/4, "wall")
        this.wallA = wallA
        this.wallADirection = 1
        wallA
            .setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width/2))
            .setImmovable(true)

        let wallB = this.physics.add.sprite(0, height/2, "wall")
        wallB
            .setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width/2))
            .setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay
            .setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2))
            .setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirectionX = pointer.x <= this.ball.x ? 1 : -1
            let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(50, this.SHOT_VELOCITY_X) * shotDirectionX)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY)
            this.shots++
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            ball.setVelocityX(0)
            ball.setVelocityY(0)
            ball.setX(width / 2)
            ball.setY(height - height/10)
            this.yayShots++
            this.score++
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {
        const moveSpeed = 2
        this.wallA.setX(this.wallA.x + this.wallADirection * moveSpeed)
        if (this.wallA.x > width - this.wallA.width/2) this.wallADirection = -1
        if (this.wallA.x < this.wallA.width/2) this.wallADirection = 1

        this.text.text =  this.genString()
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[X] Make one obstacle move left/right and bounce against screen edges
[X] Create and display shot counter, score, and successful shot percentage
*/