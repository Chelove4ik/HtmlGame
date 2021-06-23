import {Enemy} from "./classes.js";
import {enemiesImagesArray} from "./images.js";
import {arrayEnemies} from "./game.js";

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
