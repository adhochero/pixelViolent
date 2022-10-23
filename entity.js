import { Projectile } from "./projectile.js";

export class Entity{
    constructor(game){
        this.game = game;
        this.image = document.getElementById('sphere');
        this.scale = 3;
        this.width = this.image.width * this.scale;
        this.height = this.image.height * this.scale;
        this.positionX = this.game.width * 0.5;
        this.positionY = this.game.height * 0.5;
        this.lastPosition = {x: 0, y:0};
        this.velocity = {x: 0, y:0};
        this.inputDirectionX = 0;
        this.inputDirectionY = 0;
        this.inputSmoothingX = 0;
        this.inputSmoothingY = 0;
        this.inputResponsivness = 4;
        this.moveSpeed = 4;

        //for pushes
        this.initialPushForce = 0;
        this.currentPushForce = 0;
        this.pushDirectionX = 0;
        this.pushDirectionY = 0;
        this.pushTimer = 0;
        this.pushRecoverySpeed = 4;

        this.isMine = false;
        this.markedForDeletion = false;
        this.lives = 3;
        this.projectiles = [];
    }

    update(deltaTime){
        if(this.isMine){
            //input movement
            if(this.game.keys.includes('a') && !this.game.keys.includes('d')) this.inputDirectionX = -1;
            else if(this.game.keys.includes('d') && !this.game.keys.includes('a')) this.inputDirectionX = 1;
            else this.inputDirectionX = 0;

            if(this.game.keys.includes('w') && !this.game.keys.includes('s')) this.inputDirectionY = -1;
            else if(this.game.keys.includes('s') && !this.game.keys.includes('w')) this.inputDirectionY = 1;
            else this.inputDirectionY = 0;

            //solves diagonal movement speed discrepancy
            if(this.inputDirectionX !== 0 && this.inputDirectionY !== 0){
                this.inputDirectionX *= Math.SQRT1_2;
                this.inputDirectionY *= Math.SQRT1_2;
            }

            //smooth input movement using lerp
            this.inputSmoothingX = this.lerp(this.inputSmoothingX, this.inputDirectionX, this.inputResponsivness * deltaTime/1000);
            this.inputSmoothingY = this.lerp(this.inputSmoothingY, this.inputDirectionY, this.inputResponsivness * deltaTime/1000);            

            this.positionX += this.inputSmoothingX * this.moveSpeed;
            this.positionY += this.inputSmoothingY * this.moveSpeed;

            this.velocity.x = this.positionX - this.lastPosition.x;
            this.velocity.y = this.positionY - this.lastPosition.y;
            this.lastPosition.x = this.positionX;
            this.lastPosition.y = this.positionY;
        }
        else{ 
            //AI Entity stuff
            let directionX = this.game.myEntity.positionX - this.positionX;
            let directionY = this.game.myEntity.positionY - this.positionY;

            let angle = Math.atan2(directionY, directionX);

            //move to follow
            this.positionX += Math.cos(angle) * this.moveSpeed;
            this.positionY += Math.sin(angle) * this.moveSpeed;
        }

        this.updatePush(deltaTime);
        
        //projectiles
        this.projectiles.forEach(projctile => {
            projctile.update();
        });
        this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
    }

    draw(context){
        context.imageSmoothingEnabled = false;
        context.drawImage(
            this.image,
            this.positionX - this.width * 0.5,
            this.positionY - this.height * 0.5,
            this.width,
            this.height);

        //lives
        context.fillStyle = 'grey';
        context.font = '20px Helvetica';
        context.fillText(this.lives, this.positionX - 14, this.positionY + 4);

        //projectiles
        this.projectiles.forEach(projctile => {
            projctile.draw(context);
        });
        this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
    }

    shoot(){
        console.log('BANG!');

        let recoil = 4;
        let aimDirectionX = this.game.mouseX - this.game.width / 2;
        let aimDirectionY = this.game.mouseY - this.game.height / 2;

        this.initilizePush(recoil, -aimDirectionX, -aimDirectionY);
        this.projectiles.push(new Projectile(this.game, this.positionX, this.positionY, aimDirectionX, aimDirectionY));
    }

    //to be called e.g. entity.initilizePush(force, dx, dy);
    initilizePush(initialPushForce, pushDirectionX, pushDirectionY){
        this.initialPushForce = initialPushForce;
        this.currentPushForce = this.initialPushForce;
        this.pushDirectionX = pushDirectionX;
        this.pushDirectionY = pushDirectionY;
        this.pushTimer = 0;
    }

    updatePush(deltaTime){
        //TODO: combine multiple push direciton/angles
        let angle = Math.atan2(this.pushDirectionY, this.pushDirectionX);

        if(this.currentPushForce > 0){ 
            this.pushTimer += this.pushRecoverySpeed * deltaTime/1000;
            if(this.pushTimer > 1) this.pushTimer = 1;
            this.currentPushForce = this.lerp(this.initialPushForce, 0, this.pushTimer);
      
            this.positionX += Math.cos(angle) * this.currentPushForce;
            this.positionY += Math.sin(angle) * this.currentPushForce;
        }
        else {
            this.pushTimer = 0;
            this.currentPushForce = 0;
        }
    }

    lerp(start, end, t){
        return  (1 - t) * start + end * t;
    }
}