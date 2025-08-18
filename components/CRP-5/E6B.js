export // constructor; has to be called with references to respective layers
class E6B {
  constructor(
    dstCanvas,
    sideAbottomLayer,
    sideAmiddleLayer,
    sideAtopLayer,
    sideBbottomLayer,
    sideBmiddleLayer,
    sideBtopLayer,
    minZoom,
    maxZoom
  ) {
    this.paddingTop = 20;

    if (!document.createElement("canvas").getContext) {
      alert("Your browser does not support html5 canvas - sorry");
      return;
    }

    this.minZoom = minZoom;
    this.maxZoom = maxZoom;

    // init array of layers
    this.layers = [];
    this.layers[0] = [];
    this.layers[1] = [];

    // store reference to the main drawing canvas
    this.drawCanvas = dstCanvas;

    // assign layers to inner storage
    this.layers[0][0] = sideAbottomLayer;
    this.layers[0][1] = sideAmiddleLayer;
    this.layers[0][2] = sideAtopLayer;

    this.layers[1][0] = sideBbottomLayer;
    this.layers[1][1] = sideBmiddleLayer;
    this.layers[1][2] = sideBtopLayer;

    this.canvasBuffers = [];
    this.maskBuffers = [];
    this.userDrawings = [];

    // create helper arrays and initialize them
    this.layerRotations = [];
    this.layerYOffsets = [];

    for (var side = 0; side < 2; side++) {
      // create a canvas that serves as a buffer for each side
      var cwidth = this.layers[side][0].image.width * 1.5;
      var cheight = this.layers[side][0].image.height * 1.5;

      this.userDrawings[side] = [];

      this.canvasBuffers[side] = this.createInnerCanvas(cwidth, cheight);

      // create a canvas for all the masks
      this.maskBuffers[side] = this.createInnerCanvas(cwidth, cheight);

      this.layerRotations[side] = [];
      this.layerYOffsets[side] = [];
      for (var layer = 0; layer < this.layers[side].length; layer++) {
        this.layerRotations[side][layer] = 0;
        this.layerYOffsets[side][layer] = 0;
      }
    }

    // init control parameters
    this.activeSide = 0;
    this.currentScale = 1;
    this.currentPanX = 0;
    this.currentPanY = 0;
    this.drawNext = "";
    this.spaceBarDown = false;
    this.dragging = false;

    // setup callbacks
    this.setupCallbacks();

    // initial zoom
    this.scaleToFit();

    this.setIntervalId = 0;

    this.drawingEndCallback = undefined;
  }
  // setup drawing loop
  run() {
    var that = this; // I love this:)

    this.stop();

    this.dirtyData = true;

    this.setIntervalId = window.setInterval(function () {
      that.redraw();
    }, 30);
  }
  stop() {
    if (this.setIntervalId === 0) {
      return;
    }

    window.clearInterval(this.setIntervalId);
    this.setIntervalId = 0;
  }
  // helper function - creates a canvas with the given size and with (0,0) coordinate in the center
  createInnerCanvas(width, height) {
    var ncanvas = document.createElement("canvas");

    ncanvas.setAttribute("width", width);
    ncanvas.setAttribute("height", height);

    return ncanvas;
  }
  // function to be called from drawing loop - it copies the inner buffer to the displayed canvas with the given scale and translation
  redraw() {
    // do the actual drawing only if the 'dirtyData' flag is set... 'drawComputer' sets it as well as zooming and panning functions
    if (this.dirtyData) {
      this.dirtyData = false;

      this.drawComputer();

      var ctx = this.drawCanvas.getContext("2d");

      ctx.save();

      ctx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height);

      ctx.scale(this.currentScale, this.currentScale);

      ctx.drawImage(
        this.canvasBuffers[this.activeSide],
        this.currentPanX,
        this.currentPanY
      );

      ctx.restore();
    }
  }
  // will fit the active side of the computer to the viewport (canvas size)
  scaleToFit() {
    var minScale = 1.0;
    var canvasW = this.drawCanvas.width * 1.0;
    var canvasH = this.drawCanvas.height * 1.0;
    var canvasBufferHeight = this.layers[this.activeSide][0].image.height;

    if (canvasW / this.canvasBuffers[this.activeSide].width < minScale)
      minScale = canvasW / this.canvasBuffers[this.activeSide].width;

    if (
      (canvasH - this.paddingTop) / this.canvasBuffers[this.activeSide].height <
      minScale
    )
      minScale = (canvasH - this.paddingTop) / canvasBufferHeight;

    minScale = Math.min(Math.max(this.minZoom, minScale), this.maxZoom);

    this.currentPanX =
      (this.drawCanvas.width / minScale -
        this.canvasBuffers[this.activeSide].width) /
      2;
    this.currentPanY =
      (this.drawCanvas.height / minScale -
        this.canvasBuffers[this.activeSide].height) /
      2;

    this.currentScale = minScale;

    this.dirtyData = true;
  }
  // flips the computer around
  // fits it to the canvas size
  // draws the computer
  switchSides() {
    this.activeSide = 1 - this.activeSide;
    this.scaleToFit();
  }
  // draws the computer with current scale and rotations
  drawComputer() {
    // calls in this function are doubled since we need to draw the raw image data into one canvas, and mask image data
    // into another... TODO: maybe refactor?
    var drawCtx = this.canvasBuffers[this.activeSide].getContext("2d");
    var maskCtx = this.maskBuffers[this.activeSide].getContext("2d");

    drawCtx.clearRect(0, 0, drawCtx.canvas.width, drawCtx.canvas.height);
    drawCtx.translate(drawCtx.canvas.width / 2, drawCtx.canvas.height / 2);

    maskCtx.clearRect(0, 0, maskCtx.canvas.width, maskCtx.canvas.height);
    maskCtx.translate(maskCtx.canvas.width / 2, maskCtx.canvas.height / 2);

    // draw active layers
    for (var layer = 0; layer < this.layers[this.activeSide].length; layer++) {
      drawCtx.save();
      maskCtx.save();

      drawCtx.translate(0, this.layerYOffsets[this.activeSide][layer]);
      maskCtx.translate(0, this.layerYOffsets[this.activeSide][layer]);

      drawCtx.rotate(this.layerRotations[this.activeSide][layer]);

      if (this.layers[this.activeSide][layer].maskNeedsRotation) {
        maskCtx.rotate(this.layerRotations[this.activeSide][layer]);
      }

      drawCtx.drawImage(
        this.layers[this.activeSide][layer].image,
        -this.layers[this.activeSide][layer].centerX,
        -this.layers[this.activeSide][layer].centerY // + this.layerYOffsets[this.activeSide][layer]
      );

      if (this.layers[this.activeSide][layer].hitMask !== undefined) {
        maskCtx.drawImage(
          this.layers[this.activeSide][layer].hitMask,
          -this.layers[this.activeSide][layer].centerX,
          -this.layers[this.activeSide][layer].centerY // + this.layerYOffsets[this.activeSide][layer]
        );
      }

      drawCtx.restore();
      maskCtx.restore();
    }

    drawCtx.save();

    drawCtx.translate(0, this.layerYOffsets[this.activeSide][2]);

    drawCtx.rotate(this.layerRotations[this.activeSide][2]);

    for (
      var drawingIdx = 0;
      drawingIdx < this.userDrawings[this.activeSide].length;
      drawingIdx++
    ) {
      this.userDrawings[this.activeSide][drawingIdx].drawSelf(drawCtx);
    }

    drawCtx.restore();

    drawCtx.translate(-drawCtx.canvas.width / 2, -drawCtx.canvas.height / 2);
    maskCtx.translate(-maskCtx.canvas.width / 2, -maskCtx.canvas.height / 2);
  }
  // helper function - returns mouse coordinates in relation to the drawing canvas
  getMouse(e) {
    var rect = this.drawCanvas.getBoundingClientRect();

    var mx, my;

    if (Object.prototype.toString.call(e) == "[object TouchEvent]") {
      mx = e.targetTouches[0].clientX;
      my = e.targetTouches[0].clientY;
    } else {
      mx = e.clientX;
      my = e.clientY;
    }

    // We return a simple javascript object (a hash) with x and y defined
    return {
      x: (mx - rect.left) / this.currentScale - this.currentPanX,
      y: (my - rect.top) / this.currentScale - this.currentPanY,
    };
  }
  // helper function - returns the active layer index that is under the given coordinates
  getLayerUnderMouse(mx, my) {
    var pixel = this.maskBuffers[this.activeSide]
      .getContext("2d")
      .getImageData(mx, my, 1, 1).data;

    var pixelColor = (pixel[0] << 16) | (pixel[1] << 8) | pixel[2];

    for (var layer = 0; layer < this.layers[this.activeSide].length; layer++) {
      var maskColor = this.layers[this.activeSide][layer].maskColor;

      var maskRed = (maskColor >> 16) & 255;
      var maskGreen = (maskColor >> 8) & 255;
      var maskBlue = maskColor & 255;

      // compare separate channels with some tolerance since not all browsers draw the image masks precisely with the right color
      if (
        Math.abs(maskRed - pixel[0]) < 45 &&
        Math.abs(maskGreen - pixel[1]) < 45 &&
        Math.abs(maskBlue - pixel[2]) < 45
      ) {
        return layer;
      }
    }

    return -1;
  }
  // mouse down callback - designates start of rotation
  canvasMouseDown(e) {
    var mouse = this.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;

    if (this.spaceBarDown) {
      this.dragging = true;
      this.draggingStart = mouse;

      return;
    }

    if (this.drawNext != "") {
      var coords = this.getLastLayerCoords(mx, my);

      if (this.drawNext == "dot") {
        this.drawNext = "";

        this.userDrawings[this.activeSide].push(
          new ShapeDot(coords.x, coords.y, "black", "red")
        );

        this.dirtyData = true;
      }

      if (this.drawNext == "line_start") {
        this.userDrawings[this.activeSide].push(
          new ShapeLine(coords.x, coords.y, coords.x, coords.y, 4, "red")
        );

        this.dirtyData = true;

        this.drawNext = "line_end";

        return;
      }

      if (this.drawNext == "line_end") {
        this.userDrawings[this.activeSide][
          this.userDrawings[this.activeSide].length - 1
        ].endx = coords.x;
        this.userDrawings[this.activeSide][
          this.userDrawings[this.activeSide].length - 1
        ].endy = coords.y;

        this.drawNext = "";

        this.dirtyData = true;
      }

      if (this.drawingEndCallback) {
        this.drawingEndCallback();
      }
    }

    var layerIdx = this.getLayerUnderMouse(mx, my);

    this.rotating = false;
    this.moving = false;

    // E6B specific - only the top layers on both sides can be rotated
    if (layerIdx == 2) {
      this.rotating = true;
      this.rotationReference = mouse;
      this.rotatingLayer = layerIdx;
      this.startRotation =
        this.layerRotations[this.activeSide][this.rotatingLayer];
    }

    // E6B specific - the middle layer can be moved vertically
    if (layerIdx == 1) {
      this.moving = true;
      this.movingReference = mouse;
      this.movingLayer = layerIdx;
    }

    if (layerIdx == -1) {
      this.dragging = true;
      this.draggingStart = mouse;
    }
  }
  // will return coordinates respective to the last layer of the computer
  getLastLayerCoords(mx, my) {
    var dx = mx - this.canvasBuffers[this.activeSide].width / 2;
    var dy =
      my -
      this.canvasBuffers[this.activeSide].height / 2 -
      this.layerYOffsets[this.activeSide][2];

    var rotationRad = -this.layerRotations[this.activeSide][2];
    var correctedx = dx * Math.cos(rotationRad) - dy * Math.sin(rotationRad);
    var correctedy = dx * Math.sin(rotationRad) + dy * Math.cos(rotationRad);

    return { x: correctedx, y: correctedy };
  }
  // mouse up callback - ends rotation
  canvasMouseUp(e) {
    this.rotating = false;
    this.moving = false;
    this.dragging = false;
  }
  // mouse move callback - performs rotation if necessary
  canvasMouseMove(e) {
    var mouse = this.getMouse(e);

    if (this.dragging) {
      var px = mouse.x - this.draggingStart.x;
      var py = mouse.y - this.draggingStart.y;

      this.currentPanX += px;
      this.currentPanY += py;

      this.dirtyData = true;

      return;
    }

    if (this.drawNext == "line_end") {
      var coords = this.getLastLayerCoords(mouse.x, mouse.y);

      this.userDrawings[this.activeSide][
        this.userDrawings[this.activeSide].length - 1
      ].endx = coords.x;
      this.userDrawings[this.activeSide][
        this.userDrawings[this.activeSide].length - 1
      ].endy = coords.y;

      this.dirtyData = true;
    }

    if (this.rotating) {
      var centerX = this.canvasBuffers[this.activeSide].width / 2;
      var centerY =
        this.canvasBuffers[this.activeSide].height / 2 +
        this.layerYOffsets[this.activeSide][this.rotatingLayer];

      var newVector = { x: mouse.x - centerX, y: centerY - mouse.y };

      var refVector = {
        x: this.rotationReference.x - centerX,
        y: centerY - this.rotationReference.y,
      };

      var angleDiff =
        ((this.getAngleDeg(newVector) - this.getAngleDeg(refVector)) *
          Math.PI) /
        180;

      this.layerRotations[this.activeSide][this.rotatingLayer] =
        this.startRotation + angleDiff;

      this.dirtyData = true;
    }

    if (this.moving) {
      this.layerYOffsets[this.activeSide][this.movingLayer] =
        this.layerYOffsets[this.activeSide][this.movingLayer] +
        (mouse.y - this.movingReference.y);
      this.layerYOffsets[this.activeSide][this.movingLayer + 1] =
        this.layerYOffsets[this.activeSide][this.movingLayer + 1] +
        (mouse.y - this.movingReference.y);

      this.movingReference = mouse;

      this.dirtyData = true;
    }
  }
  canvasKeyDown(e) {
    var keynum;

    if (e.which === 32) {
      // spacebar
      this.spaceBarDown = true;
    }
  }
  canvasKeyUp(e) {
    var keynum;

    if (e.which === 32) {
      // spacebar
      this.spaceBarDown = false;
    }
  }
  // helper function - returns angle of a vector
  getAngleDeg(vectorFromCenter) {
    return (
      360 - (180 / Math.PI) * Math.atan2(vectorFromCenter.y, vectorFromCenter.x)
    );
  }
  // assigns mouse callbacks
  setupCallbacks() {
    var that = this;

    this.drawCanvas.addEventListener(
      "mousedown",
      function (e) {
        that.canvasMouseDown(e);
      },
      false
    );
    this.drawCanvas.addEventListener(
      "touchstart",
      function (e) {
        that.canvasMouseDown(e);
      },
      false
    );
    this.drawCanvas.addEventListener(
      "mouseup",
      function (e) {
        that.canvasMouseUp(e);
      },
      false
    );
    this.drawCanvas.addEventListener(
      "touchend",
      function (e) {
        that.canvasMouseUp(e);
      },
      false
    );
    this.drawCanvas.addEventListener(
      "touchcancel",
      function (e) {
        that.canvasMouseUp(e);
      },
      false
    );
    this.drawCanvas.addEventListener(
      "mousemove",
      function (e) {
        that.canvasMouseMove(e);
        e.preventDefault();
      },
      true
    );
    this.drawCanvas.addEventListener(
      "touchmove",
      function (e) {
        that.canvasMouseMove(e);
        e.preventDefault();
      },
      true
    );
  }
  // will return current zoom value (value is the zoom with respect to the original size of layer images)
  getZoom() {
    return this.currentScale;
  }
  // will set zoom to the given value (value is the zoom with respect to the original size of layer images)
  setZoom(zoomValue) {
    var offsetX =
      this.currentPanX -
      (this.drawCanvas.width / this.currentScale -
        this.canvasBuffers[this.activeSide].width) /
        2;
    var offsetY =
      this.currentPanY -
      (this.drawCanvas.height / this.currentScale -
        this.canvasBuffers[this.activeSide].height) /
        2;

    this.currentScale = zoomValue;

    this.currentPanX =
      (this.drawCanvas.width / zoomValue -
        this.canvasBuffers[this.activeSide].width) /
        2 +
      offsetX;
    this.currentPanY =
      (this.drawCanvas.height / zoomValue -
        this.canvasBuffers[this.activeSide].height) /
        2 +
      offsetY;

    this.dirtyData = true;
  }
  // will change the zoom by the provided delta
  incZoom(delta) {
    this.setZoom(this.getZoom() + delta);
  }
  // will move the computer in the specified direction
  changePan(panx, pany) {
    this.currentPanX += panx * this.currentScale;
    this.currentPanY += pany * this.currentScale;

    this.dirtyData = true;
  }
  // to be called when the viewport changes size
  resize(widthDelta, heightDelta) {
    this.currentPanX += widthDelta / 2 / this.currentScale;
    this.currentPanY += heightDelta / 2 / this.currentScale;

    this.dirtyData = true;
  }
  drawDot() {
    this.drawNext = "dot";
  }
  drawLine() {
    this.drawNext = "line_start";
  }
  clearDrawings() {
    this.userDrawings[this.activeSide] = [];
    this.dirtyData = true;
  }
}
