export class Entity {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.vx = 0;
    this.vy = 0;
    this.direction = 1; // 1 for right, -1 for left
    this.state = 'idle'; // idle, walk, attack, hit, dead
    this.frame = 0;
    this.frameTimer = 0;
    this.health = 100;
    this.isDead = false;
  }

  update(deltaTime) {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    // Placeholder draw
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  takeDamage(amount) {
    if (this.isDead) return;
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      this.state = 'dead';
    } else {
      this.state = 'hit';
    }
  }
}
