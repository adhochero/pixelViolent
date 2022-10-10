export class Enemy{
    constructor(game){
        this.game = game;
        this.image = document.getElementById('sphere');
        this.scale = 4;
        this.width = 12 * this.scale;
        this.height = 12 * this.scale;
        this.perimeter = this.game.width * 2 + this.game.height * 2;
        this.randomPoint = Math.random() * this.perimeter;
        this.xPos;
        this.yPos;
        if(this.randomPoint < this.game.width){
            this.xPos = this.randomPoint;
            this.yPos = 0 - this.height;
        }else if(this.randomPoint < this.game.width + this.game.height){
            this.xPos = this.game.width + this.width;
            this.yPos = this.randomPoint - this.game.width;
        }else if(this.randomPoint < this.game.width * 2 + this.game.height){
            this.xPos = this.randomPoint - (this.game.width + this.game.height);
            this.yPos = this.game.height + this.height;
        }else if(this.randomPoint < this.game.width * 2 + this.game.height * 2){
            this.xPos = 0 - this.width;
            this.yPos = this.randomPoint - (this.game.width * 2 + this.game.height);
        }
        this.speed = 1;
        this.lives = 3;
        this.pushAngle;
        this.pushbackAmount = 4; //amount of force
        this.pushback = 0;
        this.pushTimer = 0;
        this.pushInterval = 4; //recovery speed
        this.markedForDeletion = false;
    }

    update(deltaTime){
        let dx = this.game.player.xPos - this.xPos;
        let dy = this.game.player.yPos - this.yPos;

        let angle = Math.atan2(dy, dx);

        this.xPos += Math.cos(angle) * this.speed;
        this.yPos += Math.sin(angle) * this.speed;
        
        //pushback
        if(this.pushback > 0){ 
            this.pushTimer += this.pushInterval * deltaTime/1000;
            this.pushback = this.lerp(this.pushbackAmount, 0, this.pushTimer);

            this.xPos -= Math.cos(this.pushAngle) * this.pushback;
            this.yPos -= Math.sin(this.pushAngle) * this.pushback;
        }
        else {
            this.pushTimer = 0;
            this.pushback = 0;
        }

    }

    draw(context){
        context.imageSmoothingEnabled = false;
        context.drawImage(this.image, this.xPos - this.width * 0.5, this.yPos - this.height * 0.5, this.width, this.height);
        
        //lives
        context.fillStyle = 'grey';
        context.font = '20px Helvetica';
        context.fillText(this.lives, this.xPos - 14, this.yPos + 4);
    }
    
    lerp(start, end, t){
        return  (1 - t) * start + end * t;
    }
}