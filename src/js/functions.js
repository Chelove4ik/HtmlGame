import {Enemy} from "./classes.js";
import {enemiesImagesArray} from "./images.js";
import {arrayEnemies, menuProcess} from "./game.js";

export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export function spawnEnemiesFromLevel(level) {
    if (level < 3) {
        for (let i = 0; i < level + 1; ++i)
            arrayEnemies.push(new Enemy(1, canvas.clientWidth, getRandomInt(canvas.clientHeight), enemiesImagesArray[0]));
    } else if (level < 5) {
        for (let i = 0; i < level; ++i)
            arrayEnemies.push(new Enemy(2, canvas.clientWidth, getRandomInt(canvas.clientHeight), enemiesImagesArray[1]));
    } else if (level < 7) {
        for (let i = 0; i < level - 2; ++i)
            arrayEnemies.push(new Enemy(3, canvas.clientWidth, getRandomInt(canvas.clientHeight), enemiesImagesArray[2]));
    } else if (level < 9) {
        for (let i = 0; i < level / 2; ++i) {
            let rand = getRandomInt(3);
            arrayEnemies.push(new Enemy(rand + 1, canvas.clientWidth, getRandomInt(canvas.clientHeight), enemiesImagesArray[rand]));
        }
    } else {
        for (let i = 0; i < level / 2; ++i) {
            let rand = getRandomInt(3);
            arrayEnemies.push(new Enemy(rand + 1, canvas.clientWidth, getRandomInt(canvas.clientHeight), enemiesImagesArray[rand]));
        }
        setTimeout(() => {
            for (let i = 0; i < level / 2; ++i) {
                let rand = getRandomInt(3);
                arrayEnemies.push(new Enemy(rand + 1, canvas.clientWidth, getRandomInt(canvas.clientHeight), enemiesImagesArray[rand]));
            }
        }, 13 * 1000);
    }
}

export function menuClickM(event) {
    let x = event.offsetX / canvas.clientWidth;
    let y = event.offsetY / canvas.clientHeight;

    menuProcess(x, y);
}

export function menuClickT(event) {
    let x = (event.touches[0].pageX - canvas.offsetLeft) / canvas.clientWidth;
    let y = (event.touches[0].pageY - canvas.offsetTop) / canvas.clientHeight;

    menuProcess(x, y);
}

export function hasCollision(first, second) {
    return ((first.xPos > second.xPos && first.xPos < second.xPos + second.xSize) || (first.xPos + first.xSize < second.xPos + second.xSize && first.xPos + first.xSize > second.xPos)) && ((first.yPos > second.yPos && first.yPos < second.yPos + second.ySize) || (first.yPos + first.ySize < second.yPos + second.ySize && first.yPos + first.ySize > second.yPos));
}