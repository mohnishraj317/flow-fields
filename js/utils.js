class Utils {
  // dom
  static createHTML(str) {
    const div = document.createElement("div");
    div.innerHTML = str;
    return div.firstElementChild;
  }

  static setAttributes(el, attrs) {
    Object.entries(attrs).forEach(([att, val]) => el.setAttribute(att, val));
  }

  static emptyNode(node) {
    [...node.children].forEach(c => c.remove());
  }

  static isEmptyTag(nodeName) {
    nodeName = nodeName.toLowerCase();
    let emptyNodes = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'textarea', 'track', 'wbr'];
    return emptyNodes.includes(nodeName);
  }

  // events
  static getClientCoords(e) {
    return e.touches ? [e.touches[0].clientX, e.touches[0].clientY] : [e.clientX, e.clientY];
  }

  static addEventListeners(el, listeners, useCapture = false, options = {}) {
    Object.entries(listeners).forEach(([events, listener]) => {
      events = events.match(/[\w\d]+/g);
      events.forEach(e => el.addEventListener(e, listener, useCapture, options));
    });
  }

  static dispatchCustomEvent(el, evName, detail) {
    el.dispatchEvent(new CustomEvent(evName, { detail }));
  }

  // Math
  static randFloat(l, u) {
    return Math.random() * (u - l) + l;
  }

  static adjustBetween(n, range) {
    return Math.max(Math.min(n, range[1]), range[0]);
  }

  static radians(deg) {
    return deg * Math.PI / 180;
  }

  static degrees(rad) {
    return rad * 180 / Math.PI;
  }
  
  static inRange(n, range) {
    return ((n >= range[0]) && (n <= range[1]));
  }

  // others
  static dir(obj) {
    Object.entries(obj).forEach(([k, v]) => console.log(k, " : ", v));
  }

  static enableCopy(btn, inp) {
    btn.addEventListener("click", () => {
      inp.focus();
      inp.select();
      document.execCommand("copy");
    });
  }
}
