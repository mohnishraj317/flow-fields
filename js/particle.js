class Particle {
  constructor({
    posi, size, velocity, color = "red"
  }) {
    this.posi = posi;
    this.size = size;
    this.velocity = velocity;
    this.color = color;

    Particle.particles.push(this);
    // ctx.lineCap = "round";
  }

  draw(prevX, prevY) {
    ctx.save();
    ctx.beginPath();
    // ctx.arc(...this.posi, this.size, 0, Math.PI * 2);
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(...this.posi);
    ctx.lineWidth = this.size;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    /*
    ctx.fillStyle = this.color;
    ctx.fill()*/
    ctx.restore();
  }

  update() {
    const vel = this.velocity.resolved();
    const posi = [...this.posi];
    
    this.posi[0] += vel[0];
    this.posi[1] += vel[1];
    
    this.draw(...posi);
  }

  remove() {
    const idx = Particle.particles.findIndex(p => p === this);
    Particle.particles.splice(idx, 1);
  }

  vectorsInRange(range) {
    return VectorFL.vectors.filter(vec => {
      const [vexX, vecY] = vec.initial;
      const dist = Math.hypot(vexX - this.posi[0], this.posi[1] - vecY);
      return dist <= range;
    });
  }
  
  static clearParticles() {
    Particle.particles.length = 0;
  }

  static particles = [];
}
