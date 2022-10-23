import { Input } from './input.js';
import { UI } from './ui.js';
import { Environment } from './environment.js'
import { Entity } from './entity.js'

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
            this.environment = new Environment(this);

            this.entities = [];
            this.myEntity = new Entity(this);
            this.myEntity.isMine = true;
            this.entities.push(this.myEntity);

            this.input = new Input(this);
            this.ui = new UI(this);
            this.keys = [];
            this.mouseX = 0;
            this.mouseY = 0;
            this.score = 0;
            
            this.spawnTimer = 0;
            this.spawnInterval = 2000;
            
            this.followX = -this.myEntity.positionX + this.width / 2;
            this.followY = -this.myEntity.positionY + this.height / 2;
            this.followSpeed = 0.1;
        }

        update(deltaTime){
            if(this.spawnTimer > this.spawnInterval){
                this.addAIEntity();
                this.spawnTimer = 0;
            }else{
                this.spawnTimer += deltaTime;
            }

            this.entities.forEach(entity => {
                entity.update(deltaTime);

                //entities collision
                this.entities.forEach(otherEntity => {
                    if(entity === otherEntity) return;
                    if(this.checkCircleCollision(otherEntity, entity)){
                        let normal = {
                            x: (entity.positionX - otherEntity.positionX),
                            y: (entity.positionY - otherEntity.positionY)
                        };
                        entity.initilizePush(otherEntity.moveSpeed, normal.x, normal.y);
                    }
                });

                this.environment.walls.forEach(wall => {
                    //testing wall collision
                    if(this.checkCircleToRectCollision(entity, wall)){
                        // let velocityX = entity.inputSmoothingX * entity.moveSpeed;
                        // let velocityY = entity.inputSmoothingY * entity.moveSpeed;

                        // if(entity.positionX + velocityX > wall.positionX + wall.width * 0.5 ||
                        //     entity.positionX + velocityX < wall.positionX - wall.width * 0.5){
                        //     velocityX = -velocityX;
                        // }
                        // if(entity.positionY + velocityY > wall.positionY + wall.height * 0.5 ||
                        //     entity.positionY + velocityY < wall.positionY - wall.height * 0.5){
                        //     velocityY = -velocityY;
                        // }

                        // entity.positionX += velocityX;
                        // entity.positionY += velocityY;

                        let normal = {
                            x: (entity.positionX - wall.positionX),
                            y: (entity.positionY - wall.positionY)
                        };
                        entity.initilizePush(entity.moveSpeed, normal.x, normal.y);
                    }

                    //detroy projectiles on wall collision
                    entity.projectiles.forEach(projectile => {
                        if(this.checkCircleToRectCollision(projectile, wall)){
                            projectile.markedForDeletion = true;
                        }
                    })
                });

                if(!entity.isMine){
                    this.myEntity.projectiles.forEach(projectile => {
                        if(this.checkCircleCollision(projectile, entity)){
                            projectile.markedForDeletion = true;
                            entity.initilizePush(projectile.pushPower, projectile.directionX, projectile.directionY);
                            entity.lives--;
                            if(entity.lives <= 0){
                                entity.markedForDeletion = true;
                                this.score++;
                            }
                        }
                    })
                }
            });
            this.entities = this.entities.filter(entity => !entity.markedForDeletion);
        }

        draw(context){
            this.followX = this.lerp(this.followX, -this.myEntity.positionX + this.width / 2, this.followSpeed);
            this.followY = this.lerp(this.followY, -this.myEntity.positionY + this.height / 2, this.followSpeed);

            context.save();
            context.translate(this.followX, this.followY);

            this.environment.draw(context);
            this.entities.forEach(entity => {
                entity.draw(context);
            });
            
            context.restore();
            this.ui.draw(context);
        }

        addAIEntity(){
            let newEntity = new Entity(this)
            let spawnPoint = this.randomOnPerimeter(this.width, this.height, newEntity);
            newEntity.positionX = spawnPoint.positionX;
            newEntity.positionY = spawnPoint.positionY;
            newEntity.moveSpeed = 1;
            this.entities.push(newEntity);
        }

        randomOnPerimeter(width, height, entity){
            let perimeter = width * 2 + height * 2;
            let randomPoint = Math.random() * perimeter;
            let positionX;
            let positionY;
            if(randomPoint < width){
                positionX = randomPoint;
                positionY = 0 - entity.height;
            }else if(randomPoint < width + height){
                positionX = width + entity.width;
                positionY = randomPoint - width;
            }else if(randomPoint < width * 2 + height){
                positionX = randomPoint - (width + height);
                positionY = height + entity.height;
            }else if(randomPoint < width * 2 + height * 2){
                positionX = 0 - entity.width;
                positionY = randomPoint - (width * 2 + height);
            }
            positionX += this.myEntity.positionX - width / 2;
            positionY += this.myEntity.positionY - height / 2;
            return {positionX, positionY};
        }

        checkCircleCollision(cir1, cir2){
            //assumes x and y pos is center of circles
            let distanceX = cir1.positionX - cir2.positionX;
            let distanceY = cir1.positionY - cir2.positionY;
            let radiusSum = cir1.width * 0.5 + cir2.width * 0.5;

            return (distanceX * distanceX + distanceY * distanceY <= radiusSum * radiusSum)
        }

        checkRectCollision(rect1, rect2){
            //assumes x and y pos is center of rects
            return (rect1.positionX - rect1.width/2 < rect2.positionX + rect2.width/2 &&
            rect1.positionX + rect1.width/2 > rect2.positionX - rect2.width/2 &&
            rect1.positionY - rect1.height/2 < rect2.positionY + rect2.height/2 &&
            rect1.positionY + rect1.height/2 > rect2.positionY - rect2.height/2)
        }

        checkCircleToRectCollision(cir, rect){
            //assumes x and y pos is center
            let distanceX = Math.abs(cir.positionX - rect.positionX);
            let distanceY = Math.abs(cir.positionY - rect.positionY);

            if(distanceX > rect.width/2 + cir.width/2) return false;
            if(distanceY > rect.height/2 + cir.height/2) return false;

            if(distanceX <= rect.width/2) return true;
            if(distanceY <= rect.height/2) return true;

            let dx = distanceX - rect.width/2;
            let dy = distanceY - rect.height/2;
            return (dx * dx + dy * dy <= cir.width/2 * cir.width/2);
        }

        lerp(start, end, t){
            return (1 - t) * start + end * t;
        }

        dot(ax, ay, bx, by){
            return ax * bx + ay * by;
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