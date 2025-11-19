import { Entity } from './Entity';

export class Enemy extends Entity {
    constructor(x, y) {
        super(x, y, 64, 128, 2);
        this.health = 50;
        this.attackRange = 50;
        this.attackCooldown = 0;
    }

    update(deltaTime, hero) {
        if (this.isDead) return;

        const dx = hero.x - this.x;
        const dy = hero.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        this.vx = 0;
        this.vy = 0;

        if (distance > this.attackRange) {
            // Move towards hero
            this.vx = (dx / distance) * this.speed;
            this.vy = (dy / distance) * this.speed;
            this.state = 'walk';
            this.direction = dx > 0 ? 1 : -1;
        } else {
            // Attack hero
            this.state = 'idle'; // or attack
            if (this.attackCooldown <= 0) {
                this.state = 'attack';
                this.attackCooldown = 1000;
                // Deal damage to hero (handled in GameEngine or here)
            }
        }

        if (this.attackCooldown > 0) this.attackCooldown -= deltaTime;

        super.update(deltaTime);
    }

    draw(ctx) {
        ctx.fillStyle = this.isDead ? 'gray' : 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
