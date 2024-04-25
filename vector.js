class Vector {
  constructor(x=0, y=0, z=0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  getMagnitude() {
    return ((this.x ** 2 + this.y ** 2 + this.z ** 2) ** .5).toFixed(2);
  }
  
  setMagnitude(mag) {
    const drs = this.dcs().map(dc => +(dc * mag).toFixed(2));
    [this.x, this.y, this.z] = drs;
  }
  
  setDcs(a, b, c) {
    const mag = this.getMagnitude();
    this.x = +(a * mag).toFixed(2);
    this.y = +(b * mag).toFixed(2);
    this.z = +(c * mag).toFixed(2);
  }
  
  setDirections(a, b, c) {
    this.setDcs(...[a, b, c].map(dir => Math.cos(dir)));
  }
  
  drs() {
    return [this.x, this.y, this.z];
  }
  
  dcs() {
    return this.drs().map(dr => +(dr / this.getMagnitude()).toFixed(2));
  }
  
  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }
  
  scalarProd(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }
  
  vectorProd(vector) {
    const {x, y, z} = this;
    const {x: vx, y: vy, z: vz} = vector;
    return new Vector((y * z - vy * z), (x * vz - z * vx), (x * vy - y * vx));
  }

  getAngleBetween(vector) {
    return Math.acos(this.scalarProd(vector) / (this.getMagnitude() * vector.getMagnitude()));
  }
}
