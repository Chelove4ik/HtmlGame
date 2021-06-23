import {Obstacle, Background} from './classes.js'
import {getRandomInt} from "./functions.js";

let countLoadedRes = 0  // количество загруженных изображений

let imgFon = new Image();
imgFon.src = 'src/image/background.jpg';

let imgAsteroid = new Image();
imgAsteroid.src = 'src/image/asteroid.png';

imgAsteroid.onload = () => {
    // arrayObstacles.push(new Obstacle(canvas.clientWidth, getRandomInt(canvas.clientHeight + 50) - 30, imgAsteroid));
    countLoadedRes++;
}

let nowTime = Date.now();
let lastTime, deltaTime;

let background = new Background(imgFon);

imgFon.onload = () => {
    countLoadedRes++;
}
let arrayObstacles = []

let timerId = setInterval(() => {
    if (countLoadedRes === 2) {  // кол-во изображений
        clearInterval(timerId);
        let createNewAsteroidTimerId = setTimeout(function createNewAsteroidTimer() {
            arrayObstacles.push(new Obstacle(canvas.clientWidth, getRandomInt(canvas.clientHeight + 50) - 30, imgAsteroid));
            createNewAsteroidTimerId = setTimeout(createNewAsteroidTimer, getRandomInt(10) * 1000);
        });
        game();
    }
});


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
}

function render() {
    background.draw();

    for (let obst of arrayObstacles) {
        obst.draw();
    }
}