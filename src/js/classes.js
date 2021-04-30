export class Obstacle {
    constructor(x, y, image) {
        this.xPos = x;
        this.yPos = y;
        this.xSpeed = -.1;
        this.ySpeed = 0;
        this.size = 20 + getRandomInt(100);
        this.image = image;
    }

    draw() {
        context.drawImage(this.image, this.xPos, this.yPos, this.size, this.size);
    }

    move(delta) {
        this.xPos += delta * this.xSpeed;
        this.yPos += delta * this.ySpeed;
    }
}

export class Background {
    constructor(image) {
        this.xPos = 0;
        this.image = image;
        this.xSpeed = -0.01;
    }

    move(delta) {
        this.xPos = (this.xPos + delta * this.xSpeed) % this.image.width;
    }

    draw() {
        let numImages = Math.ceil(canvas.clientWidth / this.image.width) + 1;
        for (let i = 0; i < numImages; ++i) {
            context.drawImage(this.image, this.xPos + i * this.image.width, 0, this.image.width, this.image.height);
        }
    }
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
