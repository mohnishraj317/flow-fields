const PARTICLE_COLOR = colors.modify("#c8eadf", {l: 60, s: 60, a: .2});
const BG_COLOR = colors.modify("cobaltblue", {l: 10, a: 1});
const MAX_DENSITY = Math.max(VectorFL.density.x, VectorFL.density.y);
const VEC_LEN = VectorFL.countX * VectorFL.countY;
const mouse = {
  x: w / 2,
  y: h / 2
};

// const incNoise = generatePerlinNoise(VectorFL.countX, VectorFL.countY);

function createField() {
  const noise = generatePerlinNoise(VectorFL.countX, VectorFL.countY);

  noise.forEach((val, i) => {
    const len = VEC_LEN;
    const mag = (val * 20) // + Utils.randFloat(5, 15);
    const dir = 5 * Math.asin(val) - 2;
  
    const posi = [
      VectorFL.density.x * (i % VectorFL.countX) + VectorFL.density.x / 2,
      VectorFL.density.y * Math.floor(i / VectorFL.countX) + VectorFL.density.y / 2
    ];
  
    const vectorFL = new VectorFL(
      mag, dir, posi,
      colors.modify("red", {h: 180 + Utils.randFloat(60, 180), s: 100, l: 80}),
      noise[i] / 10
    );
  });
}

createField();

function createParticle() {
  new Particle({
    posi: [Utils.randFloat(0, w),
          Utils.randFloat(0, h)],
    size: Utils.randFloat(.2, .3),
    velocity: new Vector(Utils.randFloat(.2, .4), // i / len * (2 * Math.PI)),
      Utils.randFloat(0, Math.PI * 2)),
    color: colors.modify("red", { a: .2, h: 200 * 360, s: Utils.randFloat(60, 100), l: Utils.randFloat(50, 90) })
  });
}

function generate(e, len=1000) {
  const [x, y] = Utils.getClientCoords(e);
  
  Array(len).fill(null).forEach((_, i) => {
    const particle = createParticle();
  
    // particle.color = `hsla(${180 + particle.posi[1] / h * 360}, ${Utils.randFloat(60, 100)}%, ${Utils.randFloat(60, 90)}%, .1)`;
    // particle.color = `hsla(${Utils.randFloat(0, 0)}, ${Utils.randFloat(10, 20)}%, ${Utils.randFloat(40, 80)}%, 1)`
    // particle.color = "#fff1"
    // particle.color = "#C4E3F820";
    // particle.color = "#8fdbbb50";
    // particle.color = "#FF408150"
    // particle.color = "#0001"
    // particle.color = "#8B80C020"
    // particle.color = PARTICLE_COLOR;
    // particle.color = `hsla(${particle.posi[1] / h * 120 + 240}, 100%, 80%, .5)`;
  });
}

let t = 0;
// fillCtx("#126944ff");
// fillCtx("#211E30");
fillCtx(BG_COLOR);

(function animate() {
  requestAnimationFrame(animate);
  // fillCtx("#0001");
  
  VectorFL.vectors.forEach(vec => {
    // vec.draw();
  })

  // VectorFL.vectors.forEach(vec => {
  //   vec.direction += 0.01 * Math.cos(t) + Math.sin(vec.direction / 5 + t) * .01;
  //   vec.direction = Math.atan2(mouse.x - posi[0], mouse.y - posi[1]) - Math.PI / 2
  //   const theta = t / 5e4
  //   vec.direction += Math.sinh(theta);
  //   vec.draw();
  //   vec.direction += 0.001;//Math.sin(vec.direction) * .01 + Math.cos(vec.direction + t) * .01
  // });

  Particle.particles.forEach(particle => {
    if (!(Utils.inRange(particle.posi[0], [0, w]) && Utils.inRange(particle.posi[1], [0, h]))) {
      particle.remove();
      createParticle();
    }
    
    const res = particle.vectorsInRange(
      MAX_DENSITY // + Utils.randFloat(-MAX_DENSITY / 5, MAX_DENSITY / 5)
    ).reduce((a, b) => {
      const dist = Math.hypot(particle.posi[0] - b.initial[0], b.initial[1] - particle.posi[1])
      return a.add(b);
    }, new Vector(0, 0));
    res.direction *= -1
    // res.direction *= Utils.randFloat(2, 4)

    particle.velocity = particle.velocity.add(res);
    particle.velocity.magnitude /= 5;
    particle.update();
  });

  // t += 1;
}());

const createVec = {
  initial : [null, null],
  touchdown : false,
  mag: 0,
  dir: 0,
  len: 10,
};

const cnv2 = Utils.createHTML("<canvas class='cnv'>");
const ctx2 = cnv2.getContext("2d");
cnv2.style.height = h + "px";
cnv2.style.width = w + "px";
cnv2.height = actualH;
cnv2.width = actualW;
ctx2.scale(devicePixelRatio, devicePixelRatio);
document.body.append(cnv2);
cnv2.style.pointerEvents = "none";

Utils.addEventListeners(cnv, {
  "dblclick" : e => {
    generate(e);
    ctx2.clearRect(0, 0, w, h);
    // setTimeout(() => Particle.particles.forEach(p => p.remove()), 5000);
  },
  
  "touchstart mousedown" : e => {
    createVec.initial = Utils.getClientCoords(e);
    createVec.touchdown = true;
  },
  
  "touchmove mousemove" : e => {
    if (e.cancelable) e.preventDefault();
    if (e.touches?.length > 1) return;
    if (!createVec.touchdown) return;
  
    const [x, y] = Utils.getClientCoords(e);
    mouse.x = x;
    mouse.y = y;

    // createVec.dir += 0.01;

    const dir = Math.atan2(
      (x - createVec.initial[0]),
      (y - createVec.initial[1])
      ) - 3*Math.PI/2;
    
    const len = Math.hypot(
      (x - createVec.initial[0]),
      (createVec.initial[1] - y)
    );
    
    if (len > createVec.len) {
      const [dy, dx] = [Math.random(), Math.random()];
      const vec = new VectorFL(createVec.len, dir + Math.PI / 6, createVec.initial, "skyblue");
      const comps = vec.resolved();
      // const vec2 = new VectorFL(createVec.len, dir + Math.PI,
      // [createVec.initial[0] + comps[0] + dx, createVec.initial[1] - comps[1] + dy],
      // createVec.initial,
      // "yellow");

      createVec.initial = [x, y];
      vec.draw(ctx2)
      // vec2.draw(ctx2)
    }
  },
  
  "touchend mouseup" : () => {
    createVec.touchdown = false;
    createVec.mag = 0;
    createVec.dir = 0;
  },
});
