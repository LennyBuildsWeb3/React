import { Entity } from './Entity';

export class Hero extends Entity {
    constructor(x, y) {
        super(x, y, 64, 128, 5); // Width/Height might need adjustment based on sprite
        this.health = 100;
        this.attackCooldown = 0;
        this.isAttacking = false;
    }

    update(deltaTime, input) {
        if (this.isDead) return;

        this.vx = 0;
        this.vy = 0;

        // Movement
        if (!this.isAttacking) {
            if (input.keys['ArrowRight']) {
                this.vx = this.speed;
                this.direction = 1;
                this.state = 'walk';
            } else if (input.keys['ArrowLeft']) {
                this.vx = -this.speed;
                this.direction = -1;
                this.state = 'walk';
            } else if (input.keys['ArrowUp']) {
                this.vy = -this.speed * 0.7; // Perspective movement
                this.state = 'walk';
            } else if (input.keys['ArrowDown']) {
                this.vy = this.speed * 0.7;
                this.state = 'walk';
            } else {
                this.state = 'idle';
            }
        }

        // Attack
        if (this.attackCooldown > 0) this.attackCooldown -= deltaTime;

        if (input.keys[' '] && this.attackCooldown <= 0 && !this.isAttacking) {
            this.isAttacking = true;
            this.state = 'attack';
            this.attackCooldown = 500; // ms
            // Reset attack state after animation (simulated here)
            setTimeout(() => {
                this.isAttacking = false;
                this.state = 'idle';
            }, 300);
        }

        super.update(deltaTime);

        // Boundaries
        // Assuming canvas width 800, height 600, ground starts at 400
        if (this.y < 300) this.y = 300;
        if (this.y > 500) this.y = 500;
    }

    draw(ctx, sprites) {
        // If we have sprites, use them. Otherwise rect.
        if (sprites && sprites.hero) {
            // Simple sprite drawing logic (to be expanded)
            // ctx.drawImage(sprites.hero, ...);

            // For now, debug rect
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.x, this.y, this.width, this.height);

            // Direction indicator
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x + (this.direction === 1 ? this.width - 10 : 0), this.y + 10, 10, 10);
        } else {
            super.draw(ctx);
        }
    }
}
