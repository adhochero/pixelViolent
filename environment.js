export class Environment{
    constructor(game){
        this.game = game;
        this.walls = [];

        for(let i = 0; i < 1; i++){
            let wall = {
                positionX: 50,
                positionY: 50,
                width: 100,
                height: 100,
                color: 'black'
            }
            this.walls.push(wall);
        }
    }

    draw(context){
        for(let i = 0; i < this.walls.length; i++){
            context.fillStyle = this.walls[i].color;
            context.fillRect(
                this.walls[i].positionX - this.walls[i].width/2,
                this.walls[i].positionY - this.walls[i].height/2,
                this.walls[i].width,
                this.walls[i].height);
        }  
    }

}









// const TextMap = [
//     'W W W W W W W W W W W W W W W W W W W W',
//     'W       W                             W',
//     'W   E   W           E           E     W',
//     'W   E   W                             W',
//     'W       W           E     W W W W W W W',
//     'W     W W                             W',
//     'W                   E                 W',
//     'W         E E                   E     W',
//     'W                                     W',
//     'W W W W W W W W W W W W W W           W',
//     'W                         W           W',
//     'W     E     E             W     E     W',
//     'W                   E     W           W',
//     'W W W W W W W             W           W',
//     'W                         W     E     W',
//     'W               W W W W W W           W',
//     'W   P                     W           W',
//     'W                   E                 W',
//     'W         W W W                   E   W',
//     'W           W       E                 W',
//     'W W W W W W W W W W W W W W W W W W W W'
//   ];

// let mapProcessor = new MapProcessor();
// mapProcessor.generate();

// var playerPosition = mapProcessor.getPlayerPosition();
// var player = new Player(playerPosition.x, playerPosition.y);

// for (var i = 0; i < mapProcessor.getEnemyPositions().length; i++) {
//   var enemyPosition = mapProcessor.getEnemyPositions()[i];
//   var enemy = new Enemy(enemyPosition.x, enemyPosition.y);
//   entities.push(enemy);
//   enemies.push(enemy);
// }

// entities.push(player);

// for (var i = 0; i < mapProcessor.getWallPositions().length; i++) {
//   var wallPosition = mapProcessor.getWallPositions()[i];
//   var wall = new Wall(wallPosition.x, wallPosition.y);
//   entities.push(wall);
//   walls.push(wall);
// }

// let MapProcessor = () => {
//     this.playerPosition = { x: 0, y: 0 };
//     this.enemyPositions = [];
//     this.wallPositions = [];
  
//     this.generate = function () {
//         for (var y = 0; y < TextMap.length; y++) {
//             var row = TextMap[y];
  
//             for (var x = 0; x < row.length; x += 2) {
//                 var char = row[x];
//                 var realX = x / 2;
  
//                 switch (char) {
//                     case 'W': this.wallPositions.push({ x: realX, y: y }); break;
//                     case 'E': this.enemyPositions.push({ x: realX, y: y }); break;
//                     case 'P': this.playerPosition = { x: realX, y: y }; break;
//                 }
//             }
//         } 
//     };
// }