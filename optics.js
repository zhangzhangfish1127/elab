// 光学公共工具库（普通 script，全局挂载）
(function () {
  class OpticsCanvas {
    constructor(canvas, opts) {
      opts = opts || {};
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.scale = opts.scale || 4;
      this._initHiDPI();
    }
    _initHiDPI() {
      var dpr = window.devicePixelRatio || 1;
      var rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.W = rect.width;
      this.H = rect.height;
      this.originX = this.W / 2;
      this.originY = this.H / 2;
    }
    toScreen(x, y) {
      return [this.originX + x * this.scale, this.originY - y * this.scale];
    }
    toWorld(sx, sy) {
      return [(sx - this.originX) / this.scale, (this.originY - sy) / this.scale];
    }
    clear() { this.ctx.clearRect(0, 0, this.W, this.H); }
    drawAxis() {
      var ctx = this.ctx, W = this.W, originY = this.originY;
      ctx.save();
      ctx.strokeStyle = '#ccc';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(W, originY);
      ctx.stroke();
      ctx.restore();
    }
    drawLens(x, height, type) {
      type = type || 'convex';
      var ctx = this.ctx;
      var sxL = this.toScreen(x - 1.5, 0)[0];
      var sxR = this.toScreen(x + 1.5, 0)[0];
      var sxMid = this.toScreen(x, 0)[0];
      var syT = this.toScreen(0, height / 2)[1];
      var syB = this.toScreen(0, -height / 2)[1];
      var syM = this.toScreen(0, 0)[1];
      var d = this.scale * 0.9;
      ctx.save();
      ctx.strokeStyle = '#3498db';
      ctx.fillStyle = 'rgba(52,152,219,0.10)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (type === 'convex') {
        ctx.moveTo(sxL, syT);
        ctx.quadraticCurveTo(sxR, syM, sxL, syB);
        ctx.quadraticCurveTo(sxMid - (sxMid - sxL) * 2, syM, sxL, syT);
      } else {
        ctx.moveTo(sxL, syT);
        ctx.lineTo(sxR, syT);
        ctx.quadraticCurveTo(sxR - d, syM, sxR, syB);
        ctx.lineTo(sxL, syB);
        ctx.quadraticCurveTo(sxL + d, syM, sxL, syT);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    drawCandle(x, height, color, stroke, flame) {
      color = color || '#f5d76e';
      stroke = stroke || '#c9a227';
      flame = flame || '#f39c12';
      var ctx = this.ctx;
      var sx = this.toScreen(x, 0)[0];
      var syBase = this.toScreen(x, 0)[1];
      var syTop = this.toScreen(x, height)[1];
      var candleW = 10, flameH = 12;
      ctx.save();
      ctx.fillStyle = color;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(sx - candleW / 2, syTop + flameH, candleW, syBase - syTop - flameH);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = flame;
      ctx.beginPath();
      ctx.moveTo(sx, syTop);
      ctx.quadraticCurveTo(sx + 8, syTop + flameH, sx, syTop + flameH);
      ctx.quadraticCurveTo(sx - 8, syTop + flameH, sx, syTop);
      ctx.fill();
      ctx.fillStyle = '#f1c40f';
      ctx.beginPath();
      ctx.moveTo(sx, syTop + 3);
      ctx.quadraticCurveTo(sx + 4, syTop + flameH, sx, syTop + flameH - 2);
      ctx.quadraticCurveTo(sx - 4, syTop + flameH, sx, syTop + 3);
      ctx.fill();
      ctx.restore();
    }
    drawImageCandle(x, height, dashed) {
      var ctx = this.ctx;
      var sx = this.toScreen(x, 0)[0];
      var syBase = this.toScreen(x, 0)[1];
      var syTop = this.toScreen(x, height)[1];
      var candleW = 10, flameH = 12;
      var dir = height >= 0 ? 1 : -1;
      ctx.save();
      ctx.globalAlpha = dashed ? 0.6 : 1;
      if (dashed) {
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
      } else {
        ctx.fillStyle = 'rgba(93,173,226,0.55)';
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 1;
      }
      var bodyTopY = syTop + dir * flameH;
      var bodyBottomY = syBase;
      var bodyTop = Math.min(bodyTopY, bodyBottomY);
      var bodyH = Math.abs(bodyBottomY - bodyTopY);
      if (dashed) {
        ctx.strokeRect(sx - candleW / 2, bodyTop, candleW, bodyH);
        ctx.beginPath();
        ctx.moveTo(sx, syTop);
        ctx.quadraticCurveTo(sx + 8, syTop + dir * flameH, sx, syTop + dir * flameH);
        ctx.quadraticCurveTo(sx - 8, syTop + dir * flameH, sx, syTop);
        ctx.stroke();
      } else {
        ctx.fillRect(sx - candleW / 2, bodyTop, candleW, bodyH);
        ctx.strokeRect(sx - candleW / 2, bodyTop, candleW, bodyH);
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.moveTo(sx, syTop);
        ctx.quadraticCurveTo(sx + 8, syTop + dir * flameH, sx, syTop + dir * flameH);
        ctx.quadraticCurveTo(sx - 8, syTop + dir * flameH, sx, syTop);
        ctx.fill();
      }
      ctx.restore();
    }
    drawScreen(x, height, highlight) {
      var ctx = this.ctx;
      var sx = this.toScreen(x, 0)[0];
      var syTop = this.toScreen(x, height / 2)[1];
      var syBot = this.toScreen(x, -height / 2)[1];
      var w = 6;
      ctx.save();
      ctx.fillStyle = highlight ? '#d5f5e3' : '#dfe6e9';
      ctx.strokeStyle = highlight ? '#27ae60' : '#95a5a6';
      ctx.lineWidth = highlight ? 2 : 1;
      ctx.beginPath();
      ctx.rect(sx - w / 2, syTop, w, syBot - syTop);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(sx, syBot);
      ctx.lineTo(sx, syBot + 6);
      ctx.stroke();
      ctx.restore();
    }
    drawRay(x1, y1, x2, y2, color, width) {
      color = color || '#f39c12';
      width = width || 1.8;
      var ctx = this.ctx;
      var p1 = this.toScreen(x1, y1), p2 = this.toScreen(x2, y2);
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.stroke();
      ctx.restore();
    }
    drawDashedRay(x1, y1, x2, y2, color, width) {
      color = color || '#f39c12';
      width = width || 1.5;
      var ctx = this.ctx;
      var p1 = this.toScreen(x1, y1), p2 = this.toScreen(x2, y2);
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.stroke();
      ctx.restore();
    }
    drawPoint(x, y, color, label) {
      color = color || '#e67e22';
      var ctx = this.ctx;
      var p = this.toScreen(x, y);
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 3, 0, Math.PI * 2);
      ctx.fill();
      if (label) {
        ctx.fillStyle = '#2c3e50';
        ctx.font = '13px sans-serif';
        ctx.fillText(label, p[0] + 6, p[1] - 6);
      }
      ctx.restore();
    }
    drawLabel(x, y, text, color, fontSize) {
      color = color || '#2c3e50';
      fontSize = fontSize || 13;
      var ctx = this.ctx;
      var p = this.toScreen(x, y);
      ctx.save();
      ctx.fillStyle = color;
      ctx.font = fontSize + 'px sans-serif';
      ctx.fillText(text, p[0] + 6, p[1] - 6);
      ctx.restore();
    }
    drawHorizontalMirror(x1, x2, y) {
      var ctx = this.ctx;
      var pA = this.toScreen(x1, y), pB = this.toScreen(x2, y);
      ctx.save();
      ctx.strokeStyle = '#34495e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pA[0], pA[1]);
      ctx.lineTo(pB[0], pB[1]);
      ctx.stroke();
      ctx.strokeStyle = '#95a5a6';
      ctx.lineWidth = 1;
      var count = Math.floor(Math.abs(pB[0] - pA[0]) / 12);
      for (var i = 0; i <= count; i++) {
        var t = i / count;
        var px = pA[0] + (pB[0] - pA[0]) * t;
        ctx.beginPath();
        ctx.moveTo(px, pA[1]);
        ctx.lineTo(px - 7, pA[1] + 8);
        ctx.stroke();
      }
      ctx.restore();
    }
    drawVerticalMirror(x, y1, y2) {
      var ctx = this.ctx;
      var pA = this.toScreen(x, y1), pB = this.toScreen(x, y2);
      ctx.save();
      ctx.strokeStyle = '#34495e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pA[0], pA[1]);
      ctx.lineTo(pB[0], pB[1]);
      ctx.stroke();
      ctx.strokeStyle = '#95a5a6';
      ctx.lineWidth = 1;
      var count = Math.floor(Math.abs(pB[1] - pA[1]) / 12);
      for (var i = 0; i <= count; i++) {
        var t = i / count;
        var py = pA[1] + (pB[1] - pA[1]) * t;
        ctx.beginPath();
        ctx.moveTo(pA[0], py);
        ctx.lineTo(pA[0] + 8, py - 6);
        ctx.stroke();
      }
      ctx.restore();
    }
    drawVerticalNormal(x, yTop, yBot, color) {
      color = color || '#7f8c8d';
      var ctx = this.ctx;
      var p1 = this.toScreen(x, yTop), p2 = this.toScreen(x, yBot);
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.3;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.stroke();
      ctx.restore();
    }
    drawArrowRay(x1, y1, x2, y2, color, arrowAt) {
      color = color || '#e74c3c';
      arrowAt = arrowAt || 0.5;
      this.drawRay(x1, y1, x2, y2, color);
      var ctx = this.ctx;
      var p1 = this.toScreen(x1, y1), p2 = this.toScreen(x2, y2);
      var mx = p1[0] + (p2[0] - p1[0]) * arrowAt;
      var my = p1[1] + (p2[1] - p1[1]) * arrowAt;
      var angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
      var size = 10;
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx - Math.cos(angle - 0.4) * size, my - Math.sin(angle - 0.4) * size);
      ctx.lineTo(mx - Math.cos(angle + 0.4) * size, my - Math.sin(angle + 0.4) * size);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    drawAngleArc(cx, cy, radius, mathFrom, mathTo, color, label) {
      color = color || '#e67e22';
      var ctx = this.ctx;
      var p = this.toScreen(cx, cy);
      var r = radius * this.scale;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p[0], p[1], r, -mathFrom, -mathTo, true);
      ctx.stroke();
      if (label) {
        var mid = (mathFrom + mathTo) / 2;
        var lx = p[0] + Math.cos(mid) * (r + 16);
        var ly = p[1] - Math.sin(mid) * (r + 16);
        ctx.fillStyle = color;
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, lx, ly);
      }
      ctx.restore();
    }
    drawMedium(x1, y1, x2, y2, fillColor, label, labelColor) {
      labelColor = labelColor || '#fff';
      var ctx = this.ctx;
      var pA = this.toScreen(x1, y1), pB = this.toScreen(x2, y2);
      var left = Math.min(pA[0], pB[0]);
      var top = Math.min(pA[1], pB[1]);
      var w = Math.abs(pB[0] - pA[0]);
      var h = Math.abs(pB[1] - pA[1]);
      ctx.save();
      ctx.fillStyle = fillColor;
      ctx.fillRect(left, top, w, h);
      if (label) {
        ctx.fillStyle = labelColor;
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(label, left + 14, top + 24);
      }
      ctx.restore();
    }
  }

  function convexLensImage(u, f) {
    if (Math.abs(u - f) < 0.01) return { v: Infinity, m: Infinity, imageType: 'noImage' };
    var v = 1 / (1 / f - 1 / u);
    var m = -v / u;
    return { v: v, m: m, imageType: v > 0 ? 'real' : 'virtual' };
  }
  function concaveLensImage(u, F) {
    var v = -u * F / (u + F);
    var m = F / (u + F);
    return { v: v, m: m, imageType: 'virtual' };
  }

  window.OpticsCanvas = OpticsCanvas;
  window.convexLensImage = convexLensImage;
  window.concaveLensImage = concaveLensImage;
})();