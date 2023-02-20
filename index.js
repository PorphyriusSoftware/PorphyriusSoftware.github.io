/**
 * Start once document has loaded
 */
const start = () => {



    const context = document.getElementById('backgroundCanvas').getContext('2d');
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;


    class Game {
        ctx;
        mouse;
        spaceship;

        /**
         * Player, playerLeft, playerRight are images declared in the html.
         */
        player = player;
        playerLeft = playerLeft
        playerRight = playerRight;

        /**
         * particleBoop is a wav audio file declared in the html.
         */
        particleBoop = particleBoop;

        /**
         * nebula, speedLine, starBackground, starBig, starSmall, meteorBig, meteorSmall are images declared in the html.
         */
        nebula = nebula;
        speedLine = speedLine;
        // starBackground = starBackground;
        starBig = starBig;
        starSmall = starSmall;
        meteorBig = meteorBig;
        meteorSmall = meteorSmall;
        star1 = star1;
        star2 = star2;
        star3 = star3;
        star4 = star4;


        spaceshipParticles = [];
        backGroundElements = [];
        amountOfBackgroundElements = 20;
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

            if (this.getRandomInt(500) > 450 && this.backGroundElements.length < this.amountOfBackgroundElements) {
                this.backGroundElements.push(new BackgroundElement(this, this.speedLine, this.starBig, this.starSmall, this.meteorBig, this.meteorSmall, this.star1, this.star2, this.star3, this.star4)
                );

            }

            this.backGroundElements = this.filterByActive(this.backGroundElements);
            /**
             * Sort them by speed, that way faster objects are drawn in front od slower objects. 
             * This creates depth
             */
            this.backGroundElements.sort((a,b)=> a.speedFactor-b.speedFactor);
            this.drawArray(this.backGroundElements, timeDifference);

            this.spaceshipParticles = this.filterByActive(this.spaceshipParticles);

            this.drawArray(this.spaceshipParticles, timeDifference);


            this.spaceship.update(timeDifference);
            this.spaceship.draw(this.ctx);





            requestAnimationFrame(this.animate);
        }


        getRandomInt = (max) => {
            return Math.floor(Math.random() * max);
        }

        filterByActive = (array) => {
            return array.filter((p) => {
                return p.active;
            });
        }

        drawArray = (array, timeDifference) => {
            array
                .forEach((p) => {
                    p.update(timeDifference);
                    p.draw(this.ctx);
                });
        }


    }

    class BackgroundElement {
        game;
        images = [];
        image;
        x;
        y;
        active = true;
        index;
        updateFrequency;
        frequencyCounter = 0;
        speedFactor;
        shouldRotate = false;
        shouldBlink = false;
        opacityBlink = 1;
        angle = Math.floor(Math.random() * 360);
        angleIncrement;
        constructor(game, speedLine, starBig, starSmall, meteorBig, meteorSmall, star1, star2, star3, star4) {
            this.game = game;
            this.images.push(speedLine);
            this.images.push(starBig);
            this.images.push(starSmall);
            this.images.push(meteorBig);
            this.images.push(meteorSmall);
            this.images.push(star1);
            this.images.push(star2);
            this.images.push(star3);
            this.images.push(star4);
            this.index = this.game.getRandomInt(this.images.length);
            this.image = this.images[this.index];
            this.x = this.game.getRandomInt(this.game.ctx.canvas.width);
            this.y = 0 - this.image.naturalHeight;
            this.updateFrequency = 10

            switch (this.index) {

                case 0:
                    this.speedFactor = 40;//speedline
                    break;
                case 1:
                    this.speedFactor = 10;//starbig
                    break;
                case 2:
                    this.speedFactor = 5;//starsmall
                    break;
                case 3:
                    this.speedFactor = 3;//meteorbig
                    this.shouldRotate = true;
                    this.angleIncrement = 1;
                    break;
                case 4:
                    this.speedFactor = 1;//meteorsmall
                    this.shouldRotate = true;
                    this.angleIncrement = 1;
                    break;
                case 5:
                    this.speedFactor = 5;//star1
                    this.shouldRotate = true;
                    this.shouldBlink = true;
                    this.angleIncrement = 3;
                    break;
                case 6:
                    this.speedFactor = 3;//star2
                    this.shouldRotate = true;
                    this.shouldBlink = true;
                    this.angleIncrement = 4;
                    break;
                case 7:
                    this.speedFactor = 2;//star3
                    this.shouldRotate = true;
                    this.shouldBlink = true;
                    this.angleIncrement = 2;
                    break;
                case 8:
                    this.speedFactor = 1;//star4
                    this.shouldRotate = true;
                    this.shouldBlink = true;
                    this.angleIncrement = 1;
                    break;

            }
        }



        update = (timeDifference) => {
            if (this.frequencyCounter > this.updateFrequency) {
                this.y = this.y + (1 * this.speedFactor);
                this.frequencyCounter = 0;
            } else {
                this.frequencyCounter += timeDifference;
            }

            if (this.y > this.game.ctx.canvas.height) {
                this.active = false;
            }

        }

        draw = (ctx) => {
            ctx.save();
            if (this.shouldRotate) {
                /**
                 * If we need to rotate, we move the 'pencil' to this x.y
                 * rotate the canvas
                 * and draw the image offsetting it by it's width and height
                 */
                ctx.translate(this.x, this.y);
                ctx.rotate(Math.PI / 180 * (this.angle += this.angleIncrement));
                if(this.shouldBlink){
                    /**
                     * if we need to blink, we reduce the opacity until it reaches below 0.1 and then we bump it up.
                     */
                    ctx.globalAlpha = this.opacityBlink-=0.03;
                    if(this.opacityBlink<0.1){
                        this.opacityBlink=1;
                    }
                }
                ctx.drawImage(this.image, -this.image.naturalWidth * .5, -this.image.naturalHeight * .5, this.image.naturalWidth, this.image.naturalHeight);
            } else {
                /**
                 * normally drawing the image
                 */
                ctx.drawImage(this.image, this.x, this.y, this.image.naturalWidth, this.image.naturalHeight);
            }

            ctx.restore();
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
            ctx.drawImage(this.image, this.mouse.x - (this.image.naturalWidth * .5), this.mouse.y, this.image.naturalWidth, this.image.naturalHeight);
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
                    /**
                     * Stop the sound after this timout, and restart the position of the audio
                     */
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
}

document.addEventListener("DOMContentLoaded", start);