export class UI{
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Helvetica';
        this.color = 'black';
    }

    draw(context){
        context.fillStyle = this.color;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.fillText('Score: '+this.game.score, 20, 40);
    }
}