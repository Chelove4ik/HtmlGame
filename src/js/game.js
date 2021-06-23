import {Obstacle, Background, Player} from './classes.js'
import {getRandomInt, spawnEnemiesFromLevel, menuClickM, menuClickT} from "./functions.js";
import {countLoadedRes, imgFon, imgAsteroid} from './images.js'


let nowTime = Date.now();
let lastTime, deltaTime;
let level = 1;
let score = 0;

let background = new Background(imgFon);

let arrayObstacles = [];
let arrayEnemies = [];
let arrayBullets = [];


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

let animateHelloScreen = true;
let animationGame, animateGameoverScreen;

function helloScreen() {
    animateGameoverScreen = false
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
    if (animateHelloScreen)
        requestAnimationFrame(helloScreen);
}

function gameoverScreen() {
    lastTime = nowTime;
    nowTime = Date.now();
    deltaTime = nowTime - lastTime;
    background.move(deltaTime)
    background.draw();

    canvas.removeEventListener("keydown", speedUpForPlayerListener);
    canvas.removeEventListener("keyup", speedDownForPlayerListener);
    canvas.removeEventListener("mousemove", mousemoveListener);
    canvas.removeEventListener("touchmove", touchmoveListener);

    canvas.addEventListener("mousedown", mousedownListener);
    context.font = "30px canis minor"
    context.fillText("ВЫ проиграли со счётом: " + score.toString(), 100, 100);
    context.fillText("Начать заново", 200, 300);
    if (animateGameoverScreen)
        requestAnimationFrame(gameoverScreen);
}

export function menuProcess(x, y) {
    let keyboard = 0.07 < x && x < 0.96 && 0.36 < y && y < 0.5;
    let mouse = 0.07 < x && x < 0.96 && 0.56 < y && y < 0.75;
    if (!(keyboard || mouse))
        return;

    canvas.removeEventListener("mousedown", menuClickM);
    canvas.removeEventListener("touchstart", menuClickT);
    player = new Player(3, 0, 0);
    animateHelloScreen = false;

    if (keyboard) {
        canvas.addEventListener("keydown", speedUpForPlayerListener);
        canvas.addEventListener("keyup", speedDownForPlayerListener);
    }
    if (mouse) {
        canvas.addEventListener("mousemove", mousemoveListener);
        canvas.addEventListener("touchmove", touchmoveListener);
    }
    startGame();
}

let createNewAsteroidTimerId;
function startGame() {
    createNewAsteroidTimerId = setTimeout(function createNewAsteroidTimer() {
        arrayObstacles.push(new Obstacle(canvas.clientWidth, getRandomInt(canvas.clientHeight + 50) - 30, imgAsteroid));
        createNewAsteroidTimerId = setTimeout(createNewAsteroidTimer, getRandomInt(10) * 1000);
    });
    spawnEnemiesFromLevel(level);
    animationGame = true;
    nowTime = Date.now();
    score = 0;
    game();
}

// Основной игровой цикл
function game() {
    lastTime = nowTime;
    nowTime = Date.now();
    deltaTime = nowTime - lastTime;

    console.log(player)

    update(deltaTime);
    render();

    if (player.hp === 0) {
        console.log('zeho hp')
        animationGame = false;
        animateGameoverScreen = true;
        gameoverScreen()
    }

    if (animationGame)
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
    player.checkColliders(arrayBullets);
    player.checkColliders(arrayEnemies);
    player.checkColliders(arrayObstacles);

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

    context.font = "20px canis minor";
    context.fillText("Lives: " + player.hp.toString(), 10, 30);

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

let speedUpForPlayerListener = (event) => {
    player.speedUp(event);
}
let speedDownForPlayerListener = (event) => {
    player.speedDown(event);
}
let mousemoveListener = (event) => {
    player.moveToCoords(event.offsetX, event.offsetY);
}
let touchmoveListener = (event) => {
    player.moveToCoords(event.touches[0].pageX - canvas.offsetLeft, event.touches[0].pageY - canvas.offsetTop);
}

let mousedownListener = (event) => {
    let x = event.offsetX / canvas.clientWidth;
    let y = event.offsetY / canvas.clientHeight;
    if (x > 0.2 && x < 0.53 && y > 0.44 && y < 0.52) {
        canvas.removeEventListener("mousedown", mousedownListener);
        arrayObstacles = [];
        arrayBullets = [];
        arrayEnemies = [];
        clearTimeout(createNewAsteroidTimerId);
        player.hp = 3;
        level = 1;
        canvas.addEventListener("mousedown", menuClickM)
        canvas.addEventListener("touchstart", menuClickT)
        animateHelloScreen = true;
        helloScreen();
    }
}
export {arrayEnemies, arrayBullets, arrayObstacles};