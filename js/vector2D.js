class Vector {
  constructor(r, theta) {
    this._mag = r;
    this._dir = Vector._getAngleUnderRange(theta);
  }
  
  static _getAngleUnderRange(angle) {
    if (!angle) return 0;
    while (!Utils.inRange(angle, [0, Math.PI * 2]))
      angle -= Math.PI * 2 * Math.sign(angle)
    return angle;
  }
  
  get magnitude() {
    return this._mag;
  }
  
  set magnitude(val) {
    this._mag = val;
  }
  
  get direction() {
    return this._dir;
  }
  
  set direction(val) {
    this._dir = Vector._getAngleUnderRange(val);
  }
  
  resolved() {
    return [Math.cos(this.direction) * this.magnitude, Math.sin(this.direction) * this.magnitude];
  }
  
  add(vec) {
    if (vec.magnitude === 0) return new Vector(this.magnitude, this.direction);
    else if (this.magnitude === 0) return new Vector(vec.magnitude, vec.direction);
    
    const comp1 = this.resolved();
    const comp2 = vec.resolved();
    const r1 = this.magnitude;
    const r2 = vec.magnitude;
    const theta = this.angleBetween(vec);
    const r = (r1 ** 2 + r2 ** 2 + 2 * r1 * r2 * Math.cos(theta)) ** .5;
    const phi = Math.atan2((comp1[1] + comp2[1]), (comp1[0] + comp2[0]));
    
    return new Vector(r, phi);
  }
  
  angleBetween(vec) {
    return Math.abs(vec.direction - this.direction);
  }
  
  scalarProduct(vec) {
    return this.magnitude * vec.magnitude * Math.cos(this.angleBetween(vec));
  }
  
  vectorProduct(vec) {
    return vec.magnitude * this.magnitude * Math.sin(this.angleBetween(vec));
  }
}

class VectorFL extends Vector {
  constructor(r, theta, initial=VectorFL.origin, color="red", inc) {
    super(r, theta);
    this.initial = initial;
    this.color = color;
    this.inc = inc;
    VectorFL.vectors.push(this);
  }
  
  draw(c=ctx) {
    c.save()
    c.beginPath()
    c.translate(...this.initial);
    c.rotate(-this.direction)
    c.moveTo(0, 0)
    c.lineTo(this.magnitude, 0);
    c.strokeStyle = this.color;
    c.lineWidth = .5;
    c.stroke()
    c.restore()

    function drawArrowHead() {
      const dl = 5;
      
      const theta = this.direction;
      const phi = Math.PI / 6;
      
      const [compX, compY] = this.resolved();
      const [initialX, initialY] = this.initial;
      const initialPosi = [initialX + compX, initialY - compY];

      c.save();
      c.beginPath();
      c.translate(...initialPosi);
      c.rotate(-theta);
      c.moveTo(0, 0);
      c.lineTo(-Math.cos(phi) * dl, -Math.sin(phi) * dl);
      c.moveTo(0, 0);
      c.lineTo(-Math.cos(phi) * dl, Math.sin(phi) * dl);
      c.strokeStyle = this.color;
      c.lineWidth = .5;
      c.stroke();
      c.closePath();
      c.restore()
    }

    drawArrowHead.call(this);
  }
  
  static vectors = [];
  static origin = [w / 2, h / 2];
  static countX = 10;
  static countY = 40;
  static density = {
    x : w / VectorFL.countX,
    y : h / VectorFL.countY
  };
}
