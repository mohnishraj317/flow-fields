"use strict";
const colors = {
  NAMED_COLORS: [
      "aliceblue",
      "antiquewhite",
      "aqua",
      "aquamarine",
      "azure",
      "beige",
      "bisque",
      "blanchedalmond",
      "blue",
      "blueviolet",
      "brown",
      "burlywood",
      "cadetblue",
      "chartreuse",
      "chocolate",
      "coral",
      "cornflowerblue",
      "cornsilk",
      "crimson",
      "cyan",
      "darkblue",
      "darkcyan",
      "darkgoldenrod",
      "darkgray",
      "darkgreen",
      "darkkhaki",
      "darkmagenta",
      "darkolivegreen",
      "darkorange",
      "darkorchid",
      "darkred",
      "darksalmon",
      "darkseagreen",
      "darkslateblue",
      "darkslategray",
      "darkturquoise",
      "darkviolet",
      "deeppink",
      "deepskyblue",
      "dimgray",
      "dodgerblue",
      "firebrick",
      "floralwhite",
      "forestgreen",
      "fuchsia",
      "gainsboro",
      "ghostwhite",
      "gold",
      "goldenrod",
      "gray",
      "green",
      "greenyellow",
      "honeydew",
      "hotpink",
      "indianred",
      "indigo",
      "ivory",
      "khaki",
      "lavender",
      "lavenderblush",
      "lawngreen",
      "lemonchiffon",
      "lightblue",
      "lightcoral",
      "lightcyan",
      "lightgoldenrodyellow",
      "lightgrey",
      "lightgreen",
      "lightpink",
      "lightsalmon",
      "lightseagreen",
      "lightskyblue",
      "lightslategray",
      "lightsteelblue",
      "lightyellow",
      "lime",
      "limegreen",
      "linen",
      "magenta",
      "maroon",
      "mediumaquamarine",
      "mediumblue",
      "mediumorchid",
      "mediumpurple",
      "mediumseagreen",
      "mediumslateblue",
      "mediumspringgreen",
      "mediumturquoise",
      "mediumvioletred",
      "midnightblue",
      "mintcream",
      "mistyrose",
      "moccasin",
      "navajowhite",
      "navy",
      "oldlace",
      "olive",
      "olivedrab",
      "orange",
      "orangered",
      "orchid",
      "palegoldenrod",
      "palegreen",
      "paleturquoise",
      "palevioletred",
      "papayawhip",
      "peachpuff",
      "peru",
      "pink",
      "plum",
      "powderblue",
      "purple",
      "rebeccapurple",
      "red",
      "rosybrown",
      "royalblue",
      "saddlebrown",
      "salmon",
      "sandybrown",
      "seagreen",
      "seashell",
      "sienna",
      "silver",
      "skyblue",
      "slateblue",
      "slategray",
      "snow",
      "springgreen",
      "steelblue",
      "tan",
      "teal",
      "thistle",
      "tomato",
      "turquoise",
      "violet",
      "wheat",
      "white",
      "whitesmoke",
      "yellow",
      "yellowgreen",
  ],

  // convert colors
  toRGBA(color, returnArr = false) {
    let div = document.createElement('div');
    div.style.background = color;
    document.documentElement.append(div);
    color = getComputedStyle(div)
      .backgroundColor
      .replace(/\s/, '')
      .replace(/rgba?\((.+?)\)/, '$1')
      .split(',')
      .map(c => parseFloat(c));

    if (color.length < 4) color.push(1);

    div.remove();

    let [r, g, b, a] = color;
    return returnArr ? color : `rgba(${r}, ${g}, ${b}, ${a})`;
  },

  toHexA(color, returnArr) {
    color = this.toRGBA(color, true)
      .map((c, ind, self) => {
        if (ind === self.length - 1)
          c *= 255;

        c = parseInt(c).toString(16);

        if (c.length === 1)
          c = '0' + c;

        return c;
      });

    return returnArr ? color : '#' + color.join('');
  },

  toHSLA(color, returnArr) {
    let [r, g, b, a] = colors.toRGBA(color, true)
                             .map((c, i) => i < 3 ? c /= 255 : c),
      max = Math.max(r, g, b),
      min = Math.min(r, g, b),
      h, s, l = (max + min) / 2;
    
    if (max == min) {
      h = s = 0;
    } else {
      let c = max - min;
      s = c / (1 - Math.abs(2 * l - 1));
      
      switch (max) {
        case r: h = (g - b) / c + (g < b ? 6 : 0); break;
        case g: h = (b - r) / c + 2; break;
        case b: h = (r - g) / c + 4; break;
      }
    }
    
    h = Math.round(h * 60);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    h = Math.min(Math.max(h, 0), 360);
    return returnArr ? [h, s, l, a] : `hsla(${h}, ${s}%, ${l}%, ${a})`;
  },

  truncAlpha(color) {
    color = color.replace(/\s/g, '');
    
    switch (this.format(color)) {
      case 'hex' :
      case 'hexa' :
        color = '#' + this.toHexA(color, true)
          .map((c, i) => i < 3 ? c : null)
          .join('');
        break;
      
      case 'hsl':
      case 'hsla':
        color = this.toHSLA(color, true);
        let [h, s, l] = color;
        color = `hsl(${h}, ${s}%, ${l}%)`;
        break;
      
      default :
        color = this.toRGBA(color, true);
        let [r, g, b] = color;
        color = `rgb(${r}, ${g}, ${b})`;
    }

    return color;
  },

  // manipulate colors
  modify(color, components = {}, adjust = false) {
    let that = this,
      format = this.format(color),
      
      colorPrx = new Proxy({
        r: that.red(color),
        g: that.green(color),
        b: that.blue(color),
        a: that.alpha(color),
        h: that.hue(color),
        s: that.sat(color),
        l: that.light(color)
      }, {
        set (target, comp, val) {
          target[comp] = val;
          color = /[rgb]/.test(comp) ?
            that.fromArray([target.r, target.g, target.b, target.a]) :
            that.fromArray([target.h, target.s, target.l, target.a], 'hsla');
          return true;
        }
      });
      
    Object.entries(components).forEach(arr => {
      let [comp, val] = arr;
      colorPrx[comp] = adjust ? colorPrx[comp] + val : val;
    });
    
    switch (format) {
      case 'rgb':
      case 'rgba':
        color = this.toRGBA(color);
        break;
      
      case 'hex':
      case 'hexa':
        color = this.toHexA(color);
        break;
    }
    
    return color
  },
  
  fromArray(arr, format = 'rgba') {
    let color;
  
    switch (format) {
      case 'rgb' :
        color = `rgb(${arr.join(',')})`;
        break;
      
      case 'rgba' :
        color = `rgba(${arr.join(',')})`;
        break;
      
      case 'hsl' :
        color = `hsl(${arr[0]},${arr[1]}%,${arr[2]}%)`;
        break;
      
      case 'hsla' :
        color = `hsla(${arr[0]},${arr[1]}%,${arr[2]}%,${arr[3]})`;
        break;
      
      case 'hex' :
      case 'hexa' :
        color = '#' + arr.join('');
    }
    
    return color;
  },

  invert(color) {
    let [r, g, b, a] = this
      .toRGBA(color, true)
      .map((c, i) => i < 3 ? 255 - c : c);
    
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  },

  mix(color1, color2, percent = .5) {
    color1 = this.toRGBA(color1, true);
    color2 = this.toRGBA(color2, true);
    
    let percentInverse = 1 - percent,
    
      [r, g, b, a] = [
        color1[0] * percent + color2[0] * percentInverse,
        color1[1] * percent + color2[1] * percentInverse,
        color1[2] * percent + color2[2] * percentInverse,
        color1[3] * percent + color2[3] * percentInverse
      ]
      .map(Math.round)
      .map((c, i) => i < 3 ? Math.min(c, 255) : Math.min(c, 1));
    
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  },
/*
  unmix(color, percent = 50) {
    let [r, g, b, a] = this.toRGBA(color, true);
    percent /= 100;
    
    let percentInverse = 1 - percent,
    
      color1 = [
        r * percent,
        g * percent,
        b * percent,
        a * percent
      ].map(Math.round),
      
      color2 = [
        r * percentInverse,
        g * percentInverse,
        b * percentInverse,
        a * percentInverse
      ].map(Math.round)
    
    return [color1, color2]
  },
*/
  random(mode = 'rgba') {
    let color = `rgba(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.random().toFixed(2)})`;
    
    switch (mode) {
      case 'hexa' :
      case 'hex' :
        color = this.toHexA(color);
        break;

      case 'hsla':
      case 'hsl' :
        color = this.toHSLA(color);
        break;

      case 'name':
        color = this.NAMED_COLORS[Math.floor(Math.random() * this.NAMED_COLORS.length)];
        break;
      
      default :
        color = this.toRGBA(color);
    }
    
    return this.truncAlpha(color);
  },

  // get color components
  red: color => colors.toRGBA(color, true)[0],
  green: color => colors.toRGBA(color, true)[1],
  blue: color => colors.toRGBA(color, true)[2],

  hue: color => colors.toHSLA(color, true)[0],
  sat: color => colors.toHSLA(color, true)[1],
  light: color => colors.toHSLA(color, true)[2],

  alpha: color => colors.toHSLA(color, true)[3],
  
  format(color) {
    let mode;
    
    if ( /^#([a-f0-9]{3}){1,2}$/i.test(color) )
      mode = 'hex';
    else if ( /^#([a-f0-9]{4}){1,3}/i.test(color) )
      mode = 'hexa';
    else if ( /hsla?\(.+?\)/i.test(color) )
      mode = color.indexOf('a') > -1 ? 'hsla' : 'hsl';
    else if ( /rgba?\(.+?\)/i.test(color) )
      mode = color.indexOf('a') > -1 ? 'rgba' : 'rgb';
    else
      mode = color;
    
    return mode;
  },
};
