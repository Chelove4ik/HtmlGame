let canvas = document.getElementById('game');
let context = canvas.getContext('2d');

let imgFon = new Image();
imgFon.src = 'src/image/background.jpg';

imgFon.onload = () => {
    game();
}

// Основной игровой цикл
function game () {
    update();
    render();
    requestAnimationFrame(game);
}

function update() {

}

function render() {
    context.drawImage(imgFon, 0, 0, canvas.clientWidth, canvas.clientHeight);
}