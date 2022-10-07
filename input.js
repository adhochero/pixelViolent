export class Input{
    constructor(game){
        this.game = game;
        window.addEventListener('keydown', e => {
            if((e.key === 'w' || 
                e.key === 'a' ||
                e.key === 's' ||
                e.key === 'd'
                ) && this.game.keys.indexOf(e.key) === -1){
                this.game.keys.unshift(e.key);
            }
        });
        window.addEventListener('keyup', e => {
            if(this.game.keys.indexOf(e.key) > -1){
                this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
            }
        });

        window.addEventListener('mousemove', function(e){
            let mousePos = getMousePos(canvas, e);
            game.mouseX = mousePos.x;
            game.mouseY = mousePos.y;
        });
        const getMousePos = (canvas, e) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
                y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
            }
        }

        window.addEventListener('click', e =>{
            this.game.player.pushback = this.game.player.pushbackAmount;
            this.game.player.shoot();
        })
    }
}