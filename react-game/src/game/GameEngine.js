import { Hero } from './Hero';
import { Enemy } from './Enemy';

export class GameEngine {
    constructor(canvas, onGameOver, onScoreUpdate) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.onGameOver = onGameOver;
        this.onScoreUpdate = onScoreUpdate;

        this.hero = new Hero(100, 400);
        this.enemies = [];
        this.score = 0;
        this.isRunning = false;
        this.lastTime = 0;

        this.input = {
            keys: {}
        };

        this.assets = {
            background: null,
            hero: null,
            enemy: null
        };

        this.bindInput();
        this.loadAssets();
    }

    bindInput() {
        window.addEventListener('keydown', (e) => {
            this.input.keys[e.key] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.input.keys[e.key] = false;
        });
    }

    loadAssets() {
        // Load images
        const bg = new Image();
        bg.src = '/assets/istanbul_street_background.png';
        this.assets.background = bg;

        const heroSprite = new Image();
        heroSprite.src = '/assets/kickboxer_hero_sprite_sheet.png';
        this.assets.hero = heroSprite;

        const enemySprite = new Image();
        enemySprite.src = '/assets/street_gang_enemy_sprite_sheet.png';
        this.assets.enemy = enemySprite;
    }

    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.spawnEnemy();
        requestAnimationFrame(this.loop.bind(this));
    }

    stop() {
        this.isRunning = false;
    }

    spawnEnemy() {
        const y = 300 + Math.random() * 200;
        const enemy = new Enemy(this.width + 50, y);
        this.enemies.push(enemy);
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(this.loop.bind(this));
    }

    update(deltaTime) {
        this.hero.update(deltaTime, this.input);

        // Spawn enemies periodically
        if (Math.random() < 0.01) {
            this.spawnEnemy();
        }

        this.enemies.forEach((enemy, index) => {
            enemy.update(deltaTime, this.hero);

            // Collision with hero attack
            if (this.hero.isAttacking && this.checkCollision(this.hero, enemy)) {
                enemy.takeDamage(10); // Damage per frame is high, need to debounce or use frame check
                if (enemy.isDead && enemy.state === 'dead') {
                    // Give score only once
                    if (!enemy.scored) {
                        this.score += 100;
                        this.onScoreUpdate(this.score);
                        enemy.scored = true;
                    }
                }
            }

            // Collision with hero (enemy attack)
            if (enemy.state === 'attack' && this.checkCollision(enemy, this.hero)) {
                this.hero.takeDamage(0.5); // Damage per frame
            }
        });

        // Remove dead enemies after some time
        this.enemies = this.enemies.filter(e => !(e.isDead && e.y > 1000)); // Simple cleanup

        if (this.hero.health <= 0) {
            this.stop();
            this.onGameOver(this.score);
        }
    }

    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw Background
        if (this.assets.background && this.assets.background.complete) {
            this.ctx.drawImage(this.assets.background, 0, 0, this.width, this.height);
        } else {
            this.ctx.fillStyle = '#333';
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        // Draw Entities sorted by Y for depth
        const entities = [this.hero, ...this.enemies].sort((a, b) => a.y - b.y);
        entities.forEach(e => e.draw(this.ctx, this.assets));
    }
}
