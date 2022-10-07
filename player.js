export class Player{
    constructor(game){
        this.game = game;
        this.image = document.getElementById('sphere');
        this.scale = 4;
        this.width = 12 * this.scale;
        this.height = 12 * this.scale;
        this.xPos = this.game.width * 0.5 - this.width * 0.5;
        this.yPos = this.game.height * 0.5 - this.height * 0.5;
        this.xDir = 0;
        this.yDir = 0;
        this.maxSpeed = 4;
        this.pushbackAmount = 10;
        this.pushback = 0;
        this.weight = 1;

        //TO DO: set this recoil pushback in a shoot function 
        window.addEventListener('click', e =>{
            this.pushback = this.pushbackAmount;
        })
    }

    update(){
        //input movement
        if(this.game.keys.includes('a') && !this.game.keys.includes('d')) this.xDir = -1;
        else if(this.game.keys.includes('d') && !this.game.keys.includes('a')) this.xDir = 1;
        else this.xDir = 0;

        if(this.game.keys.includes('w') && !this.game.keys.includes('s')) this.yDir = -1;
        else if(this.game.keys.includes('s') && !this.game.keys.includes('w')) this.yDir = 1;
        else this.yDir = 0;

        //solves diagonal movement speed discrepancy
        if(this.xDir !== 0 && this.yDir !== 0){
            this.xDir *= Math.SQRT1_2;
            this.yDir *= Math.SQRT1_2;
        }

        this.xPos += this.xDir * this.maxSpeed;
        this.yPos += this.yDir * this.maxSpeed;

        //pushback
        let dx = this.xPos - this.game.mouseX + this.width * 0.5;
        let dy = this.yPos - this.game.mouseY + this.height * 0.5;

        let angle = Math.atan2(dy, dx);

        this.xPos += Math.cos(angle) * this.pushback;
        this.yPos += Math.sin(angle) * this.pushback;

        if(this.pushback > 0) this.pushback -= this.weight;
        else this.pushback = 0;
    }

    draw(context){
        context.imageSmoothingEnabled = false;
        context.drawImage(this.image, this.xPos, this.yPos, this.width, this.height);
    }
}