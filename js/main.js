const cnv = document.querySelector(".cnv"),
  ctx = cnv.getContext("2d"),
  h = innerHeight,
  w = innerWidth,
  actualH = h * devicePixelRatio,
  actualW = w * devicePixelRatio;

cnv.style.height = h + "px";
cnv.style.width = w + "px";
cnv.height = actualH;
cnv.width = actualW;
ctx.scale(devicePixelRatio, devicePixelRatio);

function fillCtx(color = "rgba(0, 0, 0, .1)") {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
}
