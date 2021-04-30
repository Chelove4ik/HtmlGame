import {Obstacle, Background} from './classes.js'

let imgFon = new Image();
imgFon.src = 'src/image/background.jpg';

let imgAsteroid = new Image();
imgAsteroid.src = 'src/image/asteroid.png';

let arrayObstacles = [];
imgAsteroid.onload = () => {
    arrayObstacles.push(new Obstacle(800, 300, imgAsteroid));
}

let nowTime = Date.now();
let lastTime, deltaTime;

let background = new Background(imgFon);

imgFon.onload = () => {
    game();
}

// Основной игровой цикл
function game () {
    lastTime = nowTime;
    nowTime = Date.now();
    deltaTime = nowTime - lastTime;

    update(deltaTime);
    render();
    requestAnimationFrame(game);
}

function update(deltaTime) {
    for (let obst of arrayObstacles) {
        obst.move(deltaTime);
    }
    background.move(deltaTime);
}

function render() {
    background.draw();

    for (let obst of arrayObstacles) {
        obst.draw();
    }
}