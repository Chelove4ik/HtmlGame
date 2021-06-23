import {getRandomInt} from "./functions.js";
import {arrayBullets} from "./game.js";
import {imgPlayer} from "./images.js";

export class Obstacle {
    constructor(x, y, image) {
        this.xPos = x;
        this.yPos = y;
        this.xSpeed = -0.1;
        this.ySpeed = 0;
        this.xSize = 30 + getRandomInt(90);
        this.ySize = this.xSize.valueOf();  // TODO подумать над надобностью
        this.image = image;
    }

    draw() {
        context.drawImage(this.image, this.xPos, this.yPos, this.xSize, this.ySize);
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

export class Enemy {
    constructor(hp, x, y, images) {
        this.hp = hp;
        this.xPos = x;
        this.yPos = y;
        this.xSpeed = -(getRandomInt(100) + 1) / 3000 - 0.003;
        this.ySpeed = (getRandomInt(2000) + 1) / 30000 * (getRandomInt(2) === 0 ? -1 : 1);
        // this.xSize = canvas.clientWidth / 7;
        // this.ySize = canvas.clientHeight / 11;
        this.image = images[0];
        this.xSize = this.image.width * 1.5;
        this.ySize = this.image.height * 1.5;
        this.onField = false;
        this.fireSpeed = (getRandomInt(10) + 10) * 100;
        this.lastFire = 0;
        this.bulletImage = images[1];
    }

    move(delta) {
        this.xPos += delta * this.xSpeed;
        this.yPos += delta * this.ySpeed;

        if (this.yPos < 0) {
            this.yPos = Math.max(-this.yPos, 0);
            this.ySpeed *= -1;
        }
        if (this.yPos + this.ySize > canvas.clientHeight) {
            this.yPos = Math.min(canvas.clientHeight - (canvas.clientHeight - this.yPos), canvas.clientHeight - this.ySize)
            this.ySpeed *= -1;
        }
        if (this.xPos < canvas.clientWidth * 0.45) {
            this.xPos = Math.max(canvas.clientWidth * 0.45 - (canvas.clientWidth * 0.45 - this.xPos), canvas.clientWidth * 0.45);
            this.xSpeed *= -1;
            this.onField = true;
        }
        if (this.onField && this.xPos + this.xSize > canvas.clientWidth) {
            this.xPos = Math.min(canvas.clientWidth - (canvas.clientWidth - this.xPos), canvas.clientWidth - this.xSize);
            this.xSpeed *= -1
        }
    }

    draw() {
        context.drawImage(this.image, this.xPos, this.yPos, this.xSize, this.ySize);
    }

    getDamage() {
        this.hp--;
    }

    fire(delta) {
        this.lastFire += delta;
        if (this.lastFire > this.fireSpeed) {
            this.lastFire = 0;
            arrayBullets.push(new Bullet(this.xPos, this.yPos + this.ySize / 4, this.bulletImage));
        }
    }

}

export class Bullet {
    constructor(x, y, image) {
        this.xPos = x;
        this.yPos = y;
        this.xSize = image.width;
        this.ySize = image.height;
        this.xSpeed = -0.2;
        this.ySpeed = 0;  // TODO можно удалить
        this.image = image;
    }

    move(delta) {
        this.xPos += delta * this.xSpeed;
        this.yPos += delta * this.ySpeed;
    }

    draw() {
        context.drawImage(this.image, this.xPos, this.yPos, this.xSize, this.ySize);
    }
}

export class Player {
    constructor(hp, x, y) {
        this.hp = hp;
        this.xPos = x;
        this.yPos = y;
        this.xSize = imgPlayer.width * 1.5;
        this.ySize = imgPlayer.height * 1.5;
        this.fireSpeed = 1000;
        this.lastFire = 0;
        this.upSpeed = 0;
        this.downSpeed = 0;
        this.leftSpeed = 0;
        this.rightSpeed = 0;
        this.normalSpeed = 0.5;
        this.lastTakenDamage = 0;
    }

    speedUp(event) {
        if (Array('w', 'W', 'ArrowUp').indexOf(event.key) !== -1)
            this.upSpeed = this.normalSpeed;
        if (Array('s', 'S', 'ArrowDown').indexOf(event.key) !== -1)
            this.downSpeed = this.normalSpeed;
        if (Array('a', 'A', 'ArrowLeft').indexOf(event.key) !== -1)
            this.rightSpeed = this.normalSpeed;
        if (Array('d', 'D', 'ArrowRight').indexOf(event.key) !== -1)
            this.leftSpeed = this.normalSpeed;
    }

    speedDown(event) {
        if (Array('w', 'W', 'ArrowUp').indexOf(event.key) !== -1)
            this.upSpeed = 0;
        if (Array('s', 'S', 'ArrowDown').indexOf(event.key) !== -1)
            this.downSpeed = 0;
        if (Array('a', 'A', 'ArrowLeft').indexOf(event.key) !== -1)
            this.rightSpeed = 0;
        if (Array('d', 'D', 'ArrowRight').indexOf(event.key) !== -1)
            this.leftSpeed = 0;
    }

    moveUntilStop(delta) {
        this.xPos += (this.leftSpeed - this.rightSpeed) * delta;
        this.yPos += (this.downSpeed - this.upSpeed) * delta;

        if (this.xPos < 0)
            this.xPos = 0;
        if (this.yPos < 0)
            this.yPos = 0;
        if (this.yPos + this.ySize > canvas.clientHeight)
            this.yPos = canvas.clientHeight - this.ySize;
        if (this.xPos + this.xSize > canvas.clientWidth)
            this.xPos = canvas.clientWidth - this.xSize;
    }

    moveToCoords(newX, newY) {
        this.xPos = newX - this.xSize / 2;
        this.yPos = newY - this.ySize / 2;
    }

    getDamage() {
        if (Date.now() - this.lastTakenDamage > 3000) {
            this.hp--;
            this.lastTakenDamage = Date.now();
        }
    }

    draw() {
        context.drawImage(imgPlayer, this.xPos, this.yPos, this.xSize, this.ySize);
    }
}