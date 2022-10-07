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
        
        if(this.yPos < 0) this.markedForDeletion = true;
    }

    draw(context){
        context.fillRect(this.xPos, this.yPos, this.width, this.height);
    }
}