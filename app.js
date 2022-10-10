import { Player } from './player.js';
import { Input } from './input.js';
import { Enemy } from './enemy.js';
import { UI } from './ui.js';

window.addEventListener('load', function(){
    //canvas setup
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 666;
    canvas.height = 500;

    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new Input(this);
            this.ui = new UI(this);
            this.keys = [];
            this.mouseX = 0;
            this.mouseY = 0;
            this.timer = 0;
            this.interval = 1000;
            this.enemies = [];
            this.score = 0;
        }

        update(deltaTime){
            this.player.update(deltaTime);

            if(this.timer > this.interval){
                this.addEnemy();
                this.timer = 0;
            }else{
                this.timer += deltaTime;
            }

            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if(this.checkCircleCollision(this.player, enemy)){
                    enemy.markedForDeletion = true;
                    this.player.lives--;
                    if(this.player.lives <= 0){
                        this.player.lives = 0;
                        setTimeout(()=>{
                            alert('GAME OVER!');
                            window.location.reload();
                        }, 250)
                    }
                }
                this.player.projectiles.forEach(projectile => {
                    if(this.checkCircleCollision(projectile, enemy)){
                        projectile.markedForDeletion = true;
                        enemy.lives--;
                        enemy.pushAngle = projectile.angle;
                        enemy.pushback = enemy.pushbackAmount;
                        enemy.pushTimer = 0;
                        if(enemy.lives <= 0){
                            enemy.markedForDeletion = true;
                            this.score++;
                        }
                    }
                })
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
        }

        draw(context){
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.ui.draw(context);
        }

        addEnemy(){
            this.enemies.push(new Enemy(this));
        }

        checkCircleCollision(cir1, cir2){
            let xDistance = cir1.xPos - cir2.xPos;
            let yDistance = cir1.yPos - cir2.yPos;
            let radiusSum = cir1.width * 0.5 + cir2.width * 0.5;

            if(xDistance * xDistance + yDistance * yDistance <= radiusSum * radiusSum){
                return true;
            }
            return false;
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    //animation loop
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        context.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(context);
        requestAnimationFrame(animate);
    }

    animate(0);

});