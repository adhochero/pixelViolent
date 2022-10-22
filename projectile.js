export class Projectile{
    constructor(game, positionX, positionY, directionX, directionY){
        this.game = game;
        this.positionX = positionX;
        this.positionY = positionY;
        this.directionX = directionX;
        this.directionY = directionY;
        this.pushPower = 4;
        this.width = 8;
        this.height = 8;
        this.moveSpeed = 16;
        this.markedForDeletion = false;
    }

    update(){
        let angle = Math.atan2(this.directionY, this.directionX);
        this.positionX += Math.cos(angle) * this.moveSpeed;
        this.positionY += Math.sin(angle) * this.moveSpeed;
        
        if(this.positionY < this.game.myEntity.positionY - this.game.height / 2||
            this.positionY > this.game.myEntity.positionY + this.game.height / 2 ||
            this.positionX < this.game.myEntity.positionX - this.game.width / 2 ||
            this.positionX > this.game.myEntity.positionX + this.game.width / 2
            ) this.markedForDeletion = true;
    }

    draw(context){
        context.fillStyle = 'black';
        context.fillRect(this.positionX  - this.width * 0.5, this.positionY - this.height * 0.5, this.width, this.height);
    }
}