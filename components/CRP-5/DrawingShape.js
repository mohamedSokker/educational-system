export function ShapeDot(x, y, strokeColor, bgColor) {
  this.x = x;
  this.y = y;
  this.strokeColor = strokeColor;
  this.bgColor = bgColor;
}

ShapeDot.prototype.drawSelf = function (canvasCtx) {
  canvasCtx.lineWidth = 1;
  canvasCtx.beginPath();
  canvasCtx.arc(this.x, this.y, 5, 0, Math.PI * 2, true);
  canvasCtx.closePath();

  canvasCtx.fillStyle = this.bgColor;
  canvasCtx.fill();

  canvasCtx.strokeStyle = this.strokeColor;
  canvasCtx.stroke();
};

export function ShapeLine(startx, starty, endx, endy, thickness, color) {
  this.startx = startx;
  this.starty = starty;
  this.endx = endx;
  this.endy = endy;
  this.thickness = thickness;
  this.color = color;
}

ShapeLine.prototype.drawSelf = function (canvasCtx) {
  canvasCtx.beginPath();
  canvasCtx.lineWidth = this.thickness;
  canvasCtx.moveTo(this.startx, this.starty);
  canvasCtx.lineTo(this.endx, this.endy);
  canvasCtx.strokeStyle = this.color;
  canvasCtx.stroke();
};
