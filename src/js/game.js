import {Obstacle, Background, Player, Enemy} from './classes.js'
import {getRandomInt, spawnEnemiesFromLevel, menuClickM, menuClickT, hasCollision} from "./functions.js";
import {countLoadedRes, imgFon, imgAsteroid, imgBoss, imgBulletBoss} from './images.js'


let nowTime = Date.now();
let lastTime, deltaTime;
let level = 1;
let score = 0;

let background = new Background(imgFon);

let arrayObstacles = [];
let arrayEnemies = [];
let arrayBullets = [];
let arrayMyBullets = [];

let timerId = setInterval(() => {
    console.log(countLoadedRes.toString() + '/12')
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

    context.font = "20px canis minor"
    context.fillText("Score: " + score.toString(), canvas.clientWidth - 150, 30, 145)
    if (animateHelloScreen)
        requestAnimationFrame(helloScreen);
}

function gameoverScreen() {
    canvas.style.cursor = "auto"
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
    canvas.style.cursor = "none"

    if (keyboard) {
        canvas.addEventListener("keydown", speedUpForPlayerListener);
        canvas.addEventListener("keyup", speedDownForPlayerListener);
    }
    if (mouse) {
        player.canFire = true;
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

    update(deltaTime);
    render();

    if (player.hp === 0) {
        animationGame = false;
        animateGameoverScreen = true;
        gameoverScreen()
    }

    if (arrayEnemies.length === 0) {
        level++;
        if (level % 3 === 0) {
            arrayEnemies.push(new Enemy(level, canvas.clientWidth, getRandomInt(canvas.clientHeight), Array(imgBoss, imgBulletBoss), 10));
            arrayEnemies[0].fireSpeed = Math.max(arrayEnemies[0].fireSpeed - 100 * level, 500);
            arrayEnemies[0].xSize *= 1.5;
            arrayEnemies[0].ySize *= 1.5;
        } else {
            spawnEnemiesFromLevel(level);
        }

        if (level % 3 === 1)
            player.hp++;
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
    player.fireUntilStop(deltaTime);
    player.checkColliders(arrayBullets);
    player.checkColliders(arrayEnemies);
    player.checkColliders(arrayObstacles);

    // Обработка противников
    arrayEnemies.forEach((elem) => {
        elem.move(deltaTime);
        elem.fire(deltaTime);
    });

    // Обработка пуль
    arrayBullets.forEach((elem) => {
        elem.move(deltaTime);
    });
    arrayBullets = arrayBullets.filter((elem) => {
        return elem.xPos + elem.xSize > 0;
    });
    arrayBullets = arrayBullets.filter((elem) => {
        return !hasCollision(player, elem);
    });

    arrayMyBullets.forEach((elem) => {
        elem.move(deltaTime);
    });
    arrayMyBullets = arrayMyBullets.filter((elem) => {
        return elem.xPos < canvas.clientWidth;
    })

    // ранил ли
    arrayEnemies.forEach((enemy, index) => {
        arrayMyBullets.filter((elem) => {
            if (hasCollision(enemy, elem)) {
                arrayEnemies[index].hp--;
                return false;
            }
            return true;
        });
    });

    // убил ли
    arrayEnemies = arrayEnemies.filter((elem) => {
        if (elem.hp <= 0) {
            score += elem.cost;
            return false
        }
        return true;
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
    arrayMyBullets.forEach((elem) => {
        elem.draw();
    });


    arrayObstacles.forEach((elem) => {
        elem.draw();
    });

    context.font = "20px canis minor";
    context.fillText("Lives: " + player.hp.toString(), 10, 30);

    context.fillText("Score: " + score.toString(), canvas.clientWidth - 150, 30, 145)
}

let speedUpForPlayerListener = (event) => {
    if (event.key === ' ')
        player.canFire = true;
    player.speedUp(event);
}
let speedDownForPlayerListener = (event) => {
    if (event.key === ' ')
        player.canFire = false;
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
        player.canFire = false;
        level = 1;
        canvas.addEventListener("mousedown", menuClickM)
        canvas.addEventListener("touchstart", menuClickT)
        animateHelloScreen = true;
        helloScreen();
    }
}
export {arrayEnemies, arrayBullets, arrayObstacles, arrayMyBullets};