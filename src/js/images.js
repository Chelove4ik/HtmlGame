let imgFon = new Image();
imgFon.src = 'src/image/background.jpg';

let imgAsteroid = new Image();
imgAsteroid.src = 'src/image/asteroid.png';

let imgPlayer = new Image();
imgPlayer.src = 'src/image/Ship1.png';

let imgEnemy1 = new Image();
imgEnemy1.src = 'src/image/Ship2.png';
let imgEnemy2 = new Image();
imgEnemy2.src = 'src/image/Ship3.png';
let imgEnemy3 = new Image();
imgEnemy3.src = 'src/image/Ship4.png';

let imgBoss = new Image();
imgBoss.src = 'src/image/Ship6.png';

let imgBulletPlayer = new Image();
imgBulletPlayer.src = 'src/image/shot1.png';
let imgBullet1 = new Image();
imgBullet1.src = 'src/image/shot2.png';
let imgBullet2 = new Image();
imgBullet2.src = 'src/image/shot3.png';
let imgBullet3 = new Image();
imgBullet3.src = 'src/image/shot4.png';
let imgBulletBoss = new Image();
imgBulletBoss.src = 'src/image/shot6.png';


let countLoadedRes = 0  // количество загруженных изображений

Array(imgFon, imgAsteroid, imgPlayer, imgEnemy1, imgEnemy2, imgEnemy3, imgBoss, imgBulletPlayer, imgBullet1, imgBullet2, imgBullet3, imgBulletBoss).forEach(item => {
    item.onload = () => {
        countLoadedRes++;
    };
});

let enemiesImagesArray = Array(Array(imgEnemy1, imgBullet1), Array(imgEnemy2, imgBullet2), Array(imgEnemy3, imgBullet3));

export {countLoadedRes, enemiesImagesArray, imgPlayer, imgBulletPlayer, imgBoss, imgBulletBoss, imgFon, imgAsteroid}
