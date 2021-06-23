import {Obstacle, Background} from './classes.js'
import {getRandomInt, spawnEnemiesFromLevel} from "./functions.js";

let countLoadedRes = 0  // количество загруженных изображений

let imgFon = new Image();
imgFon.src = 'src/image/background.jpg';

let imgAsteroid = new Image();
imgAsteroid.src = 'src/image/asteroid.png';

let imgEnemy1 = new Image();
imgEnemy1.src = 'src/image/Ship2.png'
let imgEnemy2 = new Image();
imgEnemy2.src = 'src/image/Ship3.png'
let imgEnemy3 = new Image();
imgEnemy3.src = 'src/image/Ship4.png'

let imgBoss = new Image();
imgBoss.src = 'src/image/Ship6.png'

Array(imgFon, imgAsteroid, imgEnemy1, imgEnemy2, imgEnemy3, imgBoss).forEach(item => {
    item.onload = () => {
        countLoadedRes++;
    };
});

let enemiesImagesArray = Array(imgEnemy1, imgEnemy2, imgEnemy3);

let nowTime = Date.now();
let lastTime, deltaTime;
let level = 1;

let background = new Background(imgFon);

let arrayObstacles = [];
let arrayEnemies = [];


let timerId = setInterval(() => {
    if (countLoadedRes === 6) {  // кол-во изображений
        startGame();
    }
});

function startGame() {
    clearInterval(timerId);
    let createNewAsteroidTimerId = setTimeout(function createNewAsteroidTimer() {
        arrayObstacles.push(new Obstacle(canvas.clientWidth, getRandomInt(canvas.clientHeight + 50) - 30, imgAsteroid));
        createNewAsteroidTimerId = setTimeout(createNewAsteroidTimer, getRandomInt(10) * 1000);
    });
    spawnEnemiesFromLevel(arrayEnemies, enemiesImagesArray, level);
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
    });
    // arrayEnemies = arrayEnemies.filter((elem) => {
    //     return elem.xPos + elem.xSize > 0 && elem.yPos + elem.ySize > 0 && elem.yPos < canvas.clientHeight;
    // });
}

function render() {
    background.draw();

    arrayObstacles.forEach((elem) => {
        elem.draw();
    });
    arrayEnemies.forEach((elem) => {
        elem.draw();
    });
}