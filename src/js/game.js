import {Obstacle, Background} from './classes.js'
import {getRandomInt, spawnEnemiesFromLevel} from "./functions.js";
import {countLoadedRes, imgFon, imgAsteroid} from './images.js'


let nowTime = Date.now();
let lastTime, deltaTime;
let level = 1;

let background = new Background(imgFon);

let arrayObstacles = [];
let arrayEnemies = [];
let arrayBullets = []


let timerId = setInterval(() => {
    console.log(countLoadedRes)
    if (countLoadedRes === 12) {  // кол-во изображений
        startGame();
    }
});

function startGame() {
    clearInterval(timerId);
    let createNewAsteroidTimerId = setTimeout(function createNewAsteroidTimer() {
        arrayObstacles.push(new Obstacle(canvas.clientWidth, getRandomInt(canvas.clientHeight + 50) - 30, imgAsteroid));
        createNewAsteroidTimerId = setTimeout(createNewAsteroidTimer, getRandomInt(10) * 1000);
    });
    spawnEnemiesFromLevel(level);
    game();
}

// Основной игровой цикл
function game() {
    lastTime = nowTime;
    nowTime = Date.now();
    deltaTime = nowTime - lastTime;

    update(deltaTime);
    render();
    requestAnimationFrame(game);
}

function update(deltaTime) {
    // Обработка препятствий
    arrayObstacles.forEach((elem) => {
        elem.move(deltaTime);
    });
    arrayObstacles = arrayObstacles.filter((elem) => {
        return elem.xPos + elem.xSize > 0 && elem.yPos + elem.ySize > 0 && elem.yPos < canvas.clientHeight;
    });

    // Обработка фона
    background.move(deltaTime);

    // Обработка противников
    arrayEnemies.forEach((elem) => {
        elem.move(deltaTime);
        elem.fire(deltaTime);
    });
    arrayEnemies = arrayEnemies.filter((elem) => {
        return elem.hp > 0;
    });

    // Обработка пуль
    arrayBullets.forEach((elem) => {
        elem.move(deltaTime);
    });
    arrayBullets = arrayBullets.filter((elem) => {
        return elem.xPos + elem.xSize > 0 && elem.yPos + elem.ySize > 0 && elem.yPos < canvas.clientHeight;
    })


}

function render() {
    background.draw();

    arrayObstacles.forEach((elem) => {
        elem.draw();
    });
    arrayEnemies.forEach((elem) => {
        elem.draw();
    });
    arrayBullets.forEach((elem) => {
        elem.draw();
    })
}

export {arrayEnemies, arrayBullets, arrayObstacles};