



const context = document.getElementById('backgroundCanvas').getContext('2d');
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;


class Game {
    ctx;
    mouse;
    spaceship;

    /**
     * Player, playerLeft, playerRight is an image declared in the html.
     */
    player = player;
    playerLeft = playerLeft
    playerRight = playerRight;
    
    /**
     * particleBoop is a wav audio file declared in the html.
     */
    particleBoop = particleBoop;
    spaceshipParticles = [];
    lastTime = 0;
    constructor(ctx) {
        /**
         * Properties
         */
        this.ctx = ctx;
        this.mouse = { x: 0, y: 0 };
        this.spaceship = new Spaceship(this, this.mouse, this.player, this.playerLeft, this.playerRight, this.particleBoop);

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


        let timeDifference = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.spaceshipParticles = this.spaceshipParticles
            .filter((p) => {
                return p.active;
            });

        this.spaceshipParticles
            .forEach((p) => {
                p.update(timeDifference);
                p.draw(this.ctx);
            });

        this.spaceship.update(timeDifference);
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
    game;
    mouse;
    player;
    playerLeft;
    playerRight;
    x;
    y;
    image;
    timer = 0;
    timerUpperLimit = 150;
    particleBoop;
    constructor(game, mouse, player, playerLeft, playerRight, particleBoop) {
        this.game = game;
        this.mouse = mouse;
        this.player = player;
        this.playerLeft = playerLeft;
        this.playerRight = playerRight
        this.image = player;//initial state;
        this.particleBoop = particleBoop
    }


    handleState = (state) => {
        switch (state) {
            case 'stopped':
                this.image = this.player;
                break;
            case 'left':
                this.image = this.playerLeft;
                break;
            case 'right':
                this.image = this.playerRight;
                break;
            default:
                this.image = this.player;
                break;

        }


        let x = this.mouse.x;
        let y = this.mouse.y + this.image.naturalHeight;
        this.game.spaceshipParticles.push(new Particle(x, y, state, this.particleBoop));


    }

    getMovingState() {
        if (this.mouse.x > this.x) {
            return 'right';
        }

        if (this.mouse.x < this.x) {
            return 'left';
        }

        return 'stopped'
    }

    update = (timeDifference) => {
        if (this.timer > this.timerUpperLimit) {
            const state = this.getMovingState();
            this.handleState(state);
            this.timer = 0;
        } else {
            this.timer += timeDifference;
        }

    }



    draw = (ctx) => {
        ctx.save();
        ctx.drawImage(this.image, this.mouse.x - (this.image.naturalWidth * .5), this.mouse.y, 99, 75);
        ctx.restore();
        /**
         * capture the last X,Y position
         */
        this.x = this.mouse.x;
        this.y = this.mouse.x;
    }
}

class Particle {
    x;
    y;
    state;
    active = true;
    size = 20;
    timer = 0;
    timerUpperLimit = 50;
    color = 'white';

    constructor(x, y, state, particleBoop) {
        this.x = x;
        this.y = y;
        this.state = state;
        try {
            const shouldPlay = document.querySelector('#soundOn').checked;
            if (shouldPlay) {
                particleBoop.volume = 0.01;
                particleBoop.play();
                setTimeout(() => {
                    particleBoop.pause();
                    particleBoop.load();
                }, 700);
            }

        } catch (e) {
            /**
            * should never get here
            */
            console.log(e);

        }
    }

    update = (timeDifference) => {


        if (this.timer > this.timerUpperLimit) {
            this.y = this.y + 5;
            this.size--;

            if (this.size < 1) {
                this.active = false;
            }
        } else {
            this.timer += timeDifference;
        }

    }

    getColor = () => {
        switch (this.state) {
            case 'stopped':
                return 'white';
            case 'left':
                return 'red';
            case 'right':
                return 'blue'
            default:
                return 'yellow';
        }
    }

    draw = (ctx) => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.getColor();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

const game = new Game(context);
game.animate(0);