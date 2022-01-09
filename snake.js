const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext('2d')
var init;
var isGameOver = false;
var isStop = false;
var level = 1;
window.onload = () => {
    gameLoop()
}

function gameLoop() {
    init = setInterval(show, 1000 / (10 * level)) // here 15 is our fps value
}

function show() {
    update()
    draw()
}

function update() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    snake.move()
    eatApple()
    checkHitWall()
    checkHitSnakeBody()
    updateLevel()
}

function eatApple() {
    if (snake.tail[snake.tail.length - 1].x == apple.x &&
        snake.tail[snake.tail.length - 1].y == apple.y) {
        snake.tail[snake.tail.length] = { x: apple.x, y: apple.y }
        apple = new Apple();
    }
}

function checkHitWall() {
    let headTail = snake.tail[snake.tail.length - 1]

    if (headTail.x == -snake.size) {
        headTail.x = canvas.width - snake.size
    } else if (headTail.x == canvas.width) {
        headTail.x = 0
    } else if (headTail.y == -snake.size) {
        headTail.y = canvas.height - snake.size
    } else if (headTail.y == canvas.height) {
        headTail.y = 0
    }
}

function checkHitSnakeBody() {
    let headTail = snake.tail[snake.tail.length - 1]
    for (let i = 0; i < snake.tail.length - 2; i++) {
        if (snake.tail[i].x == headTail.x && snake.tail[i].y == headTail.y) {
            isGameOver = true;
        }
    }
}

function updateLevel() {
    if ((snake.tail.length - 1) > 10 * level && (snake.tail.length - 1) % 10 == 0) {
        level++;
    }
}

function draw() {
    createRect(0, 0, canvas.width, canvas.height, "black")
    createRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < snake.tail.length; i++) {
        createRect(snake.tail[i].x + 2.5, snake.tail[i].y + 2.5,
            snake.size - 5, snake.size - 5, "white")
    }

    canvasContext.font = "20px Arial"
    canvasContext.fillStyle = "#00FF42"
    canvasContext.fillText("Score: " + (snake.tail.length - 1), canvas.width - 120, 18)

    canvasContext.fillText("Level: " + level, canvas.width - 300, 18)
    createRect(apple.x, apple.y, apple.size, apple.size, apple.color)
    if (isGameOver) {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height)
        createRect(0, 0, canvas.width, canvas.height, "black")
        canvasContext.font = "20px Arial"
        canvasContext.fillStyle = "#00FF42"
        canvasContext.fillText("GameOver:- High Socre: " + (snake.tail.length - 1), canvas.width / 4, canvas.height / 2)
        clearInterval(init);
    }
    if (isStop) {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height)
        createRect(0, 0, canvas.width, canvas.height, "black")
        canvasContext.font = "20px Arial"
        canvasContext.fillStyle = "#00FF42"
        canvasContext.fillText("Stoping, Click space to continue ! ", canvas.width / 4, canvas.height / 2)
        clearInterval(init);
    }
}

function createRect(x, y, width, height, color) {
    canvasContext.fillStyle = color
    canvasContext.fillRect(x, y, width, height)
}

window.addEventListener("keydown", (event) => {
    setTimeout(() => {
        if (event.keyCode == 37 && snake.rotateX != 1) {
            snake.rotateX = -1
            snake.rotateY = 0
        } else if (event.keyCode == 38 && snake.rotateY != 1) {
            snake.rotateX = 0
            snake.rotateY = -1
        } else if (event.keyCode == 39 && snake.rotateX != -1) {
            snake.rotateX = 1
            snake.rotateY = 0
        } else if (event.keyCode == 40 && snake.rotateY != -1) {
            snake.rotateX = 0
            snake.rotateY = 1
        } else if (event.keyCode == 32) {
            if (isStop) {
                isStop = false;
                gameLoop();
            } else {
                isStop = true;
            }


        }
    }, 1)
})

class Snake {
    constructor(x, y, size) {
        this.x = x
        this.y = y
        this.size = size
        this.tail = [{ x: this.x, y: this.y }]
        this.rotateX = 0
        this.rotateY = 1
    }

    move() {
        let newRect

        if (this.rotateX == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.rotateX == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.rotateY == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            }
        } else if (this.rotateY == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            }
        }

        this.tail.shift()
        this.tail.push(newRect)
    }
}

class Apple {
    constructor() {
        let isTouching

        while (true) {
            isTouching = false;
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size

            for (let i = 0; i < snake.tail.length; i++) {
                if (this.x == snake.tail[i].x && this.y == snake.tail[i].y) {
                    isTouching = true
                }
            }

            this.size = snake.size
            this.color = "red"

            if (!isTouching) {
                break;
            }
        }
    }
}

const snake = new Snake(20, 20, 20);
let apple = new Apple();
console.log(canvas.width, canvas.height)