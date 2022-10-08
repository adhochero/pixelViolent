import { Player } from './player.js';
import { Input } from './input.js';
import { Enemy } from './enemy.js';

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
            this.keys = [];
            this.mouseX = 0;
            this.mouseY = 0;
            this.timer = 0;
            this.interval = 1000;
            this.enemies = [];
        }

        update(deltaTime){
            this.player.update();

            if(this.timer > this.interval){
                this.addEnemy();
                this.timer = 0;
            }else{
                this.timer += deltaTime;
            }

            this.enemies.forEach(enemy => {
                enemy.update();
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
        }

        draw(context){
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
        }

        addEnemy(){
            this.enemies.push(new Enemy(this))
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