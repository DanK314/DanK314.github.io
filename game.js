const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext('2d');
const SW = canvas.width;
const SH = canvas.height;
const FPS = 80;
const BGImg = new Image();
let BGLoaded = false
BGImg.src = 'JaSAG.png';
BGImg.onload = function() { 
        BGLoaded = true
};
const gameAudio = new Audio('JaSAG-BGM.mp3');
gameAudio.loop = true
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Player {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.w = 30;
        this.h = 30;
        this.vy = 0;
        this.gravity = 0.5;
        this.ground = SH - this.h;
        this.isOnGround = false;
        this.jumpStrength = -12;
    }
    draw(ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    move(dx, dy){
        this.x += dx;
        this.y += dy;
        if(this.x < 0){this.x = 0;}
        if(this.x + this.w > SW){this.x = SW - this.w;}
        if(this.y < 0){this.y = 0;}
        if(this.y + this.h > SH){this.y = SH - this.h;}
    }
    update() {
        this.vy += this.gravity;
        this.y += this.vy;
        if (this.y >= this.ground) {
            this.y = this.ground;
            this.vy = 0;
            this.isOnGround = true;
        } else {
            this.isOnGround = false;
        }
    }
    jump() {
        if (this.isOnGround) {
            this.vy = this.jumpStrength;
            this.isOnGround = false;
        }
    }
}
class Obstacle {
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    draw(ctx){
        ctx.fillStyle = "#f00";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    check(P){
        return (this.x < P.x + P.w &&
                this.x + this.w > P.x &&
                this.y < P.y + P.h &&
                this.y + this.h > P.y
        );
    }
    move() {
        throw new Error('You should override move() method.');
    }
}
class LaserBox extends Obstacle {
    constructor(x,y,w,h,way,speed){
        super(x,y,w,h);
        this.way = way;
        this.speed = speed;
    }
    move(SW) {
        if ((this.x + this.w >= SW) || (this.x <= 0)){
            this.way *= -1;
        }
        this.x += this.way * this.speed;
    }
}
class Laser extends Obstacle {
    constructor(w){
        super(0,0,w,SH);
        this.timer = 0;
    }
    move() {
        if(this.timer === 0){
            this.x = rand(0,SW-this.w);
        }
        if(this.timer === 200){
            this.timer = -1;
        }
        this.timer ++;
    }
    draw(ctx){
        if(this.timer >= 150){
            ctx.fillStyle = 'rgba(255,0,0,1)';
        }else{
            ctx.fillStyle = 'rgba(255,0,0,0.3)';
        }
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    check(P){
        if(this.timer >= 150){
            return (this.x < P.x + P.w &&
                this.x + this.w > P.x &&
                this.y < P.y + P.h &&
                this.y + this.h > P.y
            );
        }else{
            return false;
        }
    }
}
class FLB extends Obstacle {
    constructor(w,h) {
        super(-w,SH-h,w,h);
        this.timer = 0;
        this.way = 1
    }
    move(){
        if(this.timer === 0){
            if(rand(0,1) === 0){
                this.x = -this.w;
                this.way = 1;
            }else{
                this.x = SW;
                this.way = -1;
            }
        }
        if(this.timer >= 150){
            this.x += 15 * this.way;
        }
        if(this.timer === 200){
            this.timer = -101;
        }
        this.timer ++
    }
    draw(ctx){
        if(this.timer >= 150){
            ctx.fillStyle = 'rgba(255,0,0,1)';
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }else if(this.timer >= 130){
            ctx.fillStyle = 'rgba(255,0,0,0.7)';
            ctx.fillRect(0, SH-this.h, SW, this.h);
        }else if(this.timer >= 0){
            ctx.fillStyle = 'rgba(255,0,0,0.3)';
            ctx.fillRect(0, SH-this.h, SW, this.h);
        }
    }
        
}

let score = 0;
let tick = 0;
let player;
let obstacles = [];
let Scene = 0;
let RP = false;
let LP = false;

window.addEventListener('keydown', e => {
    if(Scene === 0){
        if(e.key === 'Enter'){
            gameAudio.play();
            reset();
            Scene = 1;
        }
    }else if(Scene === 1){
        switch (e.key) {
            case 'ArrowUp':
                player.jump();
                break;
        
            case 'ArrowRight':
                RP = true;
                break;

            case 'ArrowLeft':
                LP = true;
                break;
            }
    }else{
        if(e.key.toLowerCase() === 'r'){
            Scene = 0
        }
    }
});

window.addEventListener('keyup', e => {
    if(Scene === 1){
        if(e.key === 'ArrowRight') {
            RP = false;
        }
        if(e.key === 'ArrowLeft') {
            LP = false;
        }
    }
})

function reset(){
    score = 0;
    tick = 0;
    player = new Player(SW/2, 0);
    RP = false
    LP = false
    obstacles = [];
}

function gameLoop(){
    if(Scene === 0){
        ctx.clearRect(0,0,SW,SH);
        ctx.globalAlpha = 0.5;
        ctx.drawImage(BGImg, 0, 0);
        ctx.globalAlpha = 1;
        ctx.font = '40px Arial';
        ctx.fillStyle = '#000000ff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText("Just A Simple", (SW/2)-50, 50);

        ctx.fillStyle = '#0000ffff';
        ctx.fillText("Avoiding Game", (SW/2)+50, 100);

        ctx.fillStyle = '#000000ff';
        ctx.font = '30px Arial';
        ctx.fillText("Press Enter to Start", (SW/2), SH * (5/6));
    }else if(Scene === 1){
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#9DE4FCFF';
        ctx.fillRect(0,0,SW,SH);

        player.update();
        if(RP) {
            player.move(5,0);
        }
        if(LP) {
            player.move(-5,0);
        }
        player.draw(ctx);

        for (const obstacle of obstacles){
        obstacle.move(SW);
        obstacle.draw(ctx);
        }

        if(tick === 0){
            obstacles.push(new LaserBox(SW/2, SH-30, 30, 30, 1, 3));
        }else if(tick === 500) {
            obstacles.push(new Laser(5));
        }else if(tick === 1000) {
            obstacles.push(new Laser(5));
        }else if(tick >= 2000) {
            if(tick % 2000 === 0) {
                obstacles.push(new FLB(30,30));
            }else if(tick % 1000 === 0) {
                obstacles.push(new Laser(5));
            }
        }

        for (const obstacle of obstacles){
            if(obstacle.check(player)){
                Scene = 2;
            }
        }

        tick++;
        score++;
    }else{
        gameAudio.pause();
        gameAudio.currentTime = 0;
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#000F';
        ctx.fillRect(0,0,SW,SH);
        ctx.font = '40px Arial';
        ctx.fillStyle = '#FFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText("Game Over...", (SW/2), 50);
        ctx.font = '30px Arial';
        ctx.fillText("Score : " + score, (SW/2), 100);
        ctx.fillText("Press R to Restart", (SW/2), SH * (5/6));
    }
}

reset();
setInterval(gameLoop, 1000 / FPS);
