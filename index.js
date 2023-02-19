



const context = document.getElementById('backgroundCanvas').getContext('2d');
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;
console.log(context);


class Game {
    ctx;
    mouse;
    spaceship;

    /**
     * Player is an image declared in the html.
     */
    player = player;;
    constructor(ctx) {
        /**
         * Properties
         */
        this.ctx = ctx;
        this.mouse = { x: 0, y: 0 };
        this.spaceship = new Spaceship(this.mouse, this.player);

        /**
         * Event listeners
         */
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        })
        window.addEventListener('resize', (e) => {
            context.canvas.width = window.innerWidth;
            context.canvas.height = window.innerHeight;
        })

    }

    animate = (timeStamp) => {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.spaceship.draw(this.ctx);
        requestAnimationFrame(this.animate);
    }



}

class Mouse {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Spaceship {

    mouse;
    player;
    constructor(mouse, player) {
        this.mouse = mouse;
        this.player = player;
    }

    update = () => {

    }

    handleState = () => {

    }


    draw = (ctx) => {
        ctx.save();
        ctx.drawImage(this.player, this.mouse.x - (this.player.naturalWidth * .5), this.mouse.y, 99, 75);
        ctx.restore();
    }
}

const game = new Game(context);
game.animate(0);