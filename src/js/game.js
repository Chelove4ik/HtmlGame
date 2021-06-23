import {Obstacle, Background, Player} from './classes.js'
import {getRandomInt, spawnEnemiesFromLevel, menuClickM, menuClickT} from "./functions.js";
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
        clearInterval(timerId);
        canvas.addEventListener("mousedown", menuClickM)
        canvas.addEventListener("touchstart", menuClickT)
        helloScreen();
    }
});

let player;

let closeHelloScreen = false;
function helloScreen() {
    lastTime = nowTime;
    nowTime = Date.now();
    deltaTime = nowTime - lastTime;
    background.move(deltaTime)
    background.draw();
    context.font = "30px canis minor"
    context.fillStyle = "white"
    context.fillText("Выберите управление: ", 70, 100);
    context.fillText("Клавиатура(движение) + space(стрельба)", 70, 260)
    context.fillText("Свайпы/следование за мышью(движение)", 70, 380)
    context.fillText(" + автострельба", 70, 420)
    console.log("still here")
    if (!closeHelloScreen)
        requestAnimationFrame(helloScreen);
}

export function menuProcess(x, y) {
    let keyboard = 0.07 < x && x < 0.96 && 0.36 < y && y < 0.5;
    let mouse = 0.07 < x && x < 0.96 && 0.56 < y && y < 0.75;

    if (!(keyboard || mouse))
        return;

    canvas.removeEventListener("mousedown", menuClickM);
    canvas.removeEventListener("touchstart", menuClickT);
    player = new Player(3, 0, 0);
    closeHelloScreen = true;

    if (keyboard) {
        console.log('keyboard');
        canvas.addEventListener("keydown", (event) => {
            player.speedUp(event)
        });
        canvas.addEventListener("keyup", (event) => {
            player.speedDown(event)
        });
    }
    if (mouse) {
        console.log('mouse');
        canvas.addEventListener("mousemove", (event) => {
            player.moveToCoords(event.offsetX, event.offsetY);
        });
        canvas.addEventListener("touchmove", (event) => {
            player.moveToCoords(event.touches[0].pageX - canvas.offsetLeft, event.touches[0].pageY - canvas.offsetTop);
        });
    }
    startGame();
}

function startGame() {
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

    // Обработка игрока
    player.moveUntilStop(deltaTime);

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
    });


}

function render() {
    background.draw();

    player.draw();

    arrayEnemies.forEach((elem) => {
        elem.draw();
    });
    arrayBullets.forEach((elem) => {
        elem.draw();
    });

    arrayObstacles.forEach((elem) => {
        elem.draw();
    });
}

export {arrayEnemies, arrayBullets, arrayObstacles};