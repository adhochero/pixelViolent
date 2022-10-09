export class Projectile{
    constructor(game, xPos, yPos){
        this.game = game;
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = 8;
        this.height = 8;
        this.speed = 16;
        this.angle = this.game.player.toMouseAngle;
        this.markedForDeletion = false;
    }

    update(){
        this.xPos -= Math.cos(this.angle) * this.speed;
        this.yPos -= Math.sin(this.angle) * this.speed;
        
        if(this.yPos < 0 ||
            this.yPos > this.game.height ||
            this.xPos < 0 ||
            this.xPos > this.game.width
            ) this.markedForDeletion = true;
    }

    draw(context){
        context.fillStyle = 'black';
        context.fillRect(this.xPos  - this.width * 0.5, this.yPos - this.height * 0.5, this.width, this.height);
    }
}