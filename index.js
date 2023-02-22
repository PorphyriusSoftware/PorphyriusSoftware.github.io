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
         * Player, playerLeft, playerRight, laserGreen, laserGreenShot are images declared in the html.
         */
        player = player;
        playerLeft = playerLeft
        playerRight = playerRight;
        laserGreen = laserGreen;
        laserGreenShot = laserGreenShot;



        /**
         * speedLine, starBackground, starBig, starSmall, meteorBig, meteorSmall are images declared in the html.
         */
        speedLine = speedLine;
        starBig = starBig;
        starSmall = starSmall;
        meteorBig = meteorBig;
        meteorSmall = meteorSmall;
        star1 = star1;
        star2 = star2;
        star3 = star3;
        star4 = star4;

        /**
         * enemy, enemyShip, enemyUFO are images declared in the html.
         */
        enemy = enemy;
        enemyShip = enemyShip;
        enemyUFO = enemyUFO;
        laserRed = laserRed;
        laserRedShot = laserRedShot;



        spaceshipParticles = [];
        backGroundElements = [];
        spaceshipLaser = [];
        enemiesLaser = [];
        enemies = [];
        amountOfBackgroundElements = 20;
        lastTime = 0;
        amountOfEnemies = 1;

        score = 0;
        maxScore = 0;
        gameOver = false;
        gameStarted = false;
        display;
        finished;
        constructor(ctx) {
            /**
             * Properties
             */
            this.ctx = ctx;
            this.mouse = { x: 0, y: 0 };
            this.finished = new Audio('./sound/se_bomb3.mp3');
            this.spaceship = new Spaceship(this, this.mouse, this.player, this.playerLeft, this.playerRight, this.laserGreen, this.laserGreenShot);

            this.display = new Display(this);

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

            window.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (!this.gameOver) {
                        this.gameStarted = !this.gameStarted;
                    } else {
                        this.resetGame();
                        this.gameStarted = true;
                        this.gameOver = false;

                    }
                }

            });

        }

        resetGame = () => {
            this.amountOfEnemies = 1;
            this.score = 0;
            this.enemies = [];
            this.spaceshipParticles = [];
            this.spaceshipLaser = [];
            this.enemies = [];
            this.enemiesLaser = [];
        }

        animate = (timeStamp) => {
            let timeDifference = timeStamp - this.lastTime;
            this.lastTime = timeStamp;

            if (!this.gameOver && this.gameStarted) {



                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

                /**
                 * Randomly add background elements
                 */
                if (this.getRandomInt(500) > 450 && this.backGroundElements.length < this.amountOfBackgroundElements) {
                    this.backGroundElements.push(new BackgroundElement(this, this.speedLine, this.starBig, this.starSmall, this.meteorBig, this.meteorSmall, this.star1, this.star2, this.star3, this.star4)
                    );

                }

                /**
                 * Randomly add enemies
                 */

                this.amountOfEnemies = this.calculateAmountOfEnemies();
                console.log(this.amountOfEnemies);
                if (this.getRandomInt(500) > 480 && this.enemies.length < this.amountOfEnemies) {
                    this.enemies.push(new Enemy(this, this.enemy, this.enemyShip, this.enemyUFO, this.laserRed, this.laserRedShot));
                    console.log(this.enemies.length);
                }

                this.backGroundElements = this.filterByActive(this.backGroundElements);
                /**
                 * Sort them by speed, that way faster objects are drawn in front od slower objects. 
                 * This creates depth
                 */
                this.backGroundElements.sort((a, b) => a.speedFactor - b.speedFactor);
                this.drawArray(this.backGroundElements, timeDifference);

                this.spaceshipParticles = this.filterByActive(this.spaceshipParticles);

                this.drawArray(this.spaceshipParticles, timeDifference);

                this.spaceshipLaser = this.filterByActive(this.spaceshipLaser);
                this.drawArray(this.spaceshipLaser, timeDifference);

                this.enemies = this.filterByActive(this.enemies);
                this.drawArray(this.enemies, timeDifference);

                this.enemiesLaser = this.filterByActive(this.enemiesLaser);
                this.drawArray(this.enemiesLaser, timeDifference);

                this.spaceship.update(timeDifference);
                this.spaceship.draw(this.ctx);


            }
            /**
             * Display always updates and draws
             */
            this.display.update(timeDifference);
            this.display.draw(this.ctx);
            requestAnimationFrame(this.animate);
        }

        /**
         * Amount of enemies allowed depends on the score. 
         */
        calculateAmountOfEnemies = () => {
            return (Math.floor(this.score * .025)) + 1;
        }

        detectCollision(owner, arr) {
            let i = 0;
            let collision = false;
            while (i < arr.length && !collision) {

                if (!arr[i].collided) {
                    if (owner.x > (arr[i].drawingX + arr[i].image.naturalWidth) ||
                        (owner.x + owner.width) < arr[i].drawingX ||
                        owner.y > (arr[i].drawingY + arr[i].image.naturalHeight) ||
                        (owner.y + owner.height) < arr[i].drawingY
                    ) {
                        //no colission
                    } else {
                        collision = true;
                        arr[i].collide();

                    }
                }
                i++;

            }
            return collision;
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

        increaseScore = (points) => {            // console.log('increasing: '+points);
            this.score += points;
            this.maxScore = Math.max(this.maxScore, this.score);
        }

        decreaseScore = (points) => {
            this.score -= points;
            if (this.score < 0) {
                setTimeout(() => {
                    this.gameOver = true;

                    finished.volume = .3;
                    finished.play();
                    this.display.draw(this.ctx);
                }, 300);

            }
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
                if (this.shouldBlink) {
                    /**
                     * if we need to blink, we reduce the opacity until it reaches below 0.1 and then we bump it up.
                     */
                    ctx.globalAlpha = this.opacityBlink -= 0.03;
                    if (this.opacityBlink < 0.1) {
                        this.opacityBlink = 1;
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
        laserGreen;
        laserGreenShot;
        laserTimer = 0;
        laserFrequencyFactor = .5;
        x;
        y;
        image;
        timer = 0;
        timerUpperLimit = 150;
        hit;
        previousX = 0;
        previousY = 0;
        width;
        height;
        constructor(game, mouse, player, playerLeft, playerRight, laserGreen, laserGreenShot) {
            this.game = game;
            this.mouse = mouse;
            this.player = player;
            this.playerLeft = playerLeft;
            this.playerRight = playerRight
            this.image = player;//initial state;
            this.laserGreen = laserGreen;
            this.laserGreenShot = laserGreenShot
            this.hit = new Audio('./sound/se_taanbobobo.mp3');

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


            this.x = this.getRealX();
            this.y = this.getRealY();
            this.width = this.image.naturalWidth;
            this.height = this.image.naturalHeight;

            this.game.spaceshipParticles.push(new Particle(this.mouse.x, this.mouse.y + this.image.naturalHeight, state));


        }

        getMovingState() {
            if (this.mouse.x > this.previousX) {
                return 'right';
            }

            if (this.mouse.x < this.previousX) {
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

            if (this.laserTimer > this.timerUpperLimit) {
                /**
                 * Shooting laser
                 */
                this.game.spaceshipLaser.push(new Laser(this.game, this.laserGreen, this.mouse.x, this.mouse.y, false, this.laserGreenShot, false));
                this.laserTimer = 0;
            } else {
                this.laserTimer += timeDifference * this.laserFrequencyFactor;
            }

            /**
                 * Detect collision with lasers
                 */
            let collision = this.game.detectCollision(this, this.game.enemiesLaser);
            if (collision) {
                this.game.decreaseScore(20);
                try {
                    const shouldPlay = document.querySelector('#soundOn').checked;
                    if (shouldPlay) {
                        this.hit.volume = 0.3;
                        this.hit.play();
                    }

                } catch (e) {
                    /**
                    * should never get here
                    */
                    console.log(e);

                }

            }

        }

        getRealX = () => {
            return this.mouse.x - (this.image.naturalWidth * .5);
        }

        getRealY = () => {
            return this.mouse.y;
        }


        draw = (ctx) => {
            ctx.save();
            this.x = this.getRealX();
            this.y = this.getRealY();
            // console.log(this.image);
            ctx.drawImage(this.image, this.x, this.y, this.image.naturalWidth, this.image.naturalHeight);
            ctx.restore();
            /**
             * capture the last X,Y position
             */
            this.previousX = this.mouse.x;
            this.previousY = this.mouse.y;
        }
    }

    class Laser {
        game;
        image;
        x;
        y;
        timer = 0;
        timerUpperLimit = 50;
        active = true;
        isEnemy;
        drawingX;
        drawingY;
        collided = false;
        collisionCounter = 0;
        collisionCounterLimit = 5;
        collidedImage;
        width = 10;
        height = 100;
        randomShooting = false;
        shootingAngle = 0;
        constructor(game, image, x, y, isEnemy, collidedImage, randomShooting) {

            this.game = game;
            this.image = image;
            this.width = image.naturalWidth;
            this.height = image.naturalHeight;
            this.x = x;
            this.y = y;
            this.isEnemy = isEnemy;
            this.collidedImage = collidedImage;
            this.randomShooting = randomShooting;

            if (randomShooting) {
                this.shootingAngle = this.game.getRandomInt(360);
            }


        }

        update = (timeDifference) => {

            if (this.collided) {
                this.collisionCounter++
                if (this.collisionCounter > this.collisionCounterLimit) {
                    this.active = false;
                }
            }

            if (this.timer > this.timerUpperLimit) {
                if (this.isEnemy) {

                    //Enemy laser
                    this.y = this.y + 3;
                    if (this.y > this.game.ctx.canvas.height + this.image.naturalHeight) {
                        this.active = false;
                    }

                    /**
                     * for random lasers shoot up
                     */
                    if (this.y < 0 - this.image.naturalHeight) {
                        this.active = false;
                    }

                    if (this.x > 10000 || this.x < -10000) {
                        this.active = false;
                    }

                    if (this.randomShooting) {
                        this.x += Math.cos(this.shootingAngle * (Math.PI / 180)) * 3;
                        this.y += Math.sin(this.shootingAngle * (Math.PI / 180)) * 3;
                    }


                } else {

                    //Player laser
                    this.y = this.y - 5;
                    if (this.y < 0 - this.image.naturalHeight) {
                        this.active = false;
                    }
                }



            } else {
                this.timer += timeDifference;
            }
        }

        draw = (ctx) => {
            ctx.save();
            this.drawingX = this.x - (this.image.naturalWidth * .5);
            this.drawingY = this.y;
            ctx.drawImage(this.image, this.drawingX, this.drawingY, this.image.naturalWidth, this.image.naturalHeight);
            ctx.restore();
        }

        collide = () => {
            this.collided = true;
            this.image = this.collidedImage;
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

        constructor(x, y, state) {
            this.x = x;
            this.y = y;
            this.state = state;
            try {
                const shouldPlay = document.querySelector('#soundOn').checked;
                if (shouldPlay) {
                    let particleBoop = new Audio('./sound/se_shot1.mp3');
                    particleBoop.volume = 0.01;
                    particleBoop.play();

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

                if (this.size < 2) {
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

    class Enemy {
        game;
        x;
        y;
        timer = 0;
        timerUpperLimit = 50;
        width = 200;
        height = 100;
        active = true;
        angle = 0;
        images = [];
        image;
        index;
        speedFactorY;
        isSpiral = false;
        isExp = false;
        death;
        laserTimer = 0;
        laserFrequencyFactor = .05;
        laserRed;
        laserRedShot;
        shouldShoot = false;
        randomShooting = false;
        scorePoints = 0;
        constructor(game, enemy, enemyShip, enemyUFO, laserRed, laserRedShot) {
            this.game = game;
            this.images.push(enemy);
            this.images.push(enemyShip);
            this.images.push(enemyUFO);
            this.index = this.game.getRandomInt(this.images.length);
            this.image = this.images[this.index];
            this.image = this.images[this.index];
            this.x = this.game.getRandomInt(this.game.ctx.canvas.width);
            this.y = 0 - this.image.naturalHeight;
            this.death = new Audio('./sound/se_dead4.mp3');
            this.laserRed = laserRed;
            this.laserRedShot = laserRedShot;
            switch (this.index) {
                case 0:
                    this.speedFactorY = 1;
                    this.isSpiral = true;
                    this.scorePoints = 10;
                    break;
                case 1:
                    this.speedFactorY = 5;
                    this.shouldShoot = true;
                    this.scorePoints = 5;
                    break;
                case 2:
                    this.speedFactorY = 1;
                    this.isExp = true;
                    this.shouldShoot = true;
                    this.randomShooting = true;
                    this.scorePoints = 5;
                    break;
            }

        }

        update = (timeDifference) => {


            if (this.shouldShoot) {
                if (this.laserTimer > this.timerUpperLimit) {
                    /**
                     * Shooting laser
                     */
                    this.game.enemiesLaser.push(new Laser(this.game, this.laserRed, this.x, this.y, true, this.laserRedShot, this.randomShooting));
                    this.laserTimer = 0;
                } else {
                    this.laserTimer += timeDifference * this.laserFrequencyFactor;
                }
            }




            if (this.timer > this.timerUpperLimit) {
                this.y += 1 * this.speedFactorY;
                /**
                 * Override Y value to make them spiral 'enemy'
                 */
                if (this.isSpiral) {
                    this.y += 30 * Math.sin(this.angle);
                }
                /**
                 * X goes wobly to the sides
                 */
                this.x += 50 * Math.cos(this.angle += .5);

                /**
                 * If experimental is on
                 */
                if (this.isExp) {
                    /**
                     * X can go left right
                     */
                    this.x += (Math.random() * this.game.getRandomInt(this.game.ctx.canvas.width) * .01) - this.game.getRandomInt(this.game.ctx.canvas.width) * .01;

                    /**
                     * If the object went too far up reset it
                     */
                    if (this.y < 0 - this.image.naturalHeight) {
                        this.y = 0;
                    }
                    /**
                     * set the way random up and down
                     */
                    this.y += Math.random() * 20 - 10;
                }
                /**
                 * Detect collision with lasers
                 */
                let collision = this.game.detectCollision(this, this.game.spaceshipLaser);
                if (collision) {
                    this.game.increaseScore(this.scorePoints);
                    try {
                        const shouldPlay = document.querySelector('#soundOn').checked;
                        if (shouldPlay) {
                            this.death.volume = 0.1;
                            this.death.play();

                        }

                    } catch (e) {
                        /**
                        * should never get here
                        */
                        console.log(e);

                    }

                }

                /**
                 * Mark as inactive on collision or out of canvas
                 */
                if (this.y > this.game.ctx.canvas.height ||
                    this.x < -100 ||
                    this.x > this.game.ctx.canvas.width + 100 ||
                    collision) {
                    this.active = false;
                }
                this.timer = 0;
            } else {
                this.timer += timeDifference;
            }

        }

        // detectCollision() {
        //     let i = 0;
        //     let arr = this.game.spaceshipLaser;
        //     let collision = false
        //     // console.log(arr);
        //     while (i < arr.length && !collision) {

        //         if (!arr[i].collided) {
        //             if (this.x > (arr[i].drawingX + arr[i].image.naturalWidth) ||
        //                 (this.x + this.width) < arr[i].drawingX ||
        //                 this.y > (arr[i].drawingY + arr[i].image.naturalHeight) ||
        //                 (this.y + this.height) < arr[i].drawingY
        //             ) {
        //                 //no colission
        //             } else {
        //                 collision = true;
        //                 arr[i].collide();

        //             }
        //         }
        //         i++;

        //     }
        //     return collision;
        // }

        draw = (ctx) => {
            ctx.save();
            ctx.drawImage(this.image, this.x, this.y, this.image.naturalWidth, this.image.naturalHeight);
            ctx.restore();
        }


    }

    class Display {
        game;
        opacityBlink;
        timer = 0;
        timerUpperLimit = 200;
        constructor(game) {
            this.game = game;
            this.opacityBlink = 1;
        }


        update = (timeDifference) => {
            if (this.timer > this.timerUpperLimit) {
                this.opacityBlink -= 0.05
                if (this.opacityBlink < 0.001) {
                    this.opacityBlink = 1;
                }
                this.timer = 0;
            } else {
                this.timer += timeDifference;
            }

        }

        draw = (ctx) => {
            ctx.save();



            if (!this.game.gameStarted) {
                ctx.beginPath();
                ctx.globalAlpha = this.opacityBlink;
                /**
                 * Looks like global alpha does not work with fill text in this case. is it the font size? the font? who knows...
                 */
                ctx.fillStyle = `rgba(${255 * this.opacityBlink},${255 * this.opacityBlink},${255 * this.opacityBlink},${this.opacityBlink})`;
                // console.log(this.opacityBlink);
                ctx.font = '100px Reggae One';

                const maxText = ctx.measureText('Press Enter...');
                ctx.fillText('Press Enter...', (ctx.canvas.width * .5) - maxText.width * .5, (ctx.canvas.height * .5));


                ctx.beginPath();
                ctx.font = '50px Reggae One';
                const minText = ctx.measureText('IF YOU DARE');

                ctx.fillText('IF YOU DARE', (ctx.canvas.width * .5) - minText.width * .5, (ctx.canvas.height * .5) + 70);
            }

            if (this.game.gameOver) {
                ctx.beginPath();
                ctx.font = '100px Reggae One';
                ctx.fillStyle = 'white'

                const maxText = ctx.measureText('Game Over');
                ctx.fillText('Game Over', (ctx.canvas.width * .5) - maxText.width * .5, (ctx.canvas.height * .5));

            } else if (this.game.gameStarted) {
                ctx.beginPath();
                ctx.font = '50px Reggae One';
                ctx.fillStyle = 'white'
                const maxText = ctx.measureText(`Max Score: ${this.game.maxScore}`);
                ctx.fillText(`Max Score: ${this.game.maxScore}`, ctx.canvas.width - maxText.width - 250, 100);



                const text = ctx.measureText(`Score: ${this.game.score}`);
                ctx.fillText(`Score: ${this.game.score}`, ctx.canvas.width - maxText.width - 250, 150);
            }



            ctx.restore();


        }



    }

    const game = new Game(context);
    game.animate(0);
}

document.addEventListener("DOMContentLoaded", start);