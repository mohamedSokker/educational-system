import { CR3 } from "./CR3";
import { E6B } from "./E6B";
import { FlightComputerLayer } from "./Layer";

var fltCompsWrapper;

export function setWrapperInstance(instance) {
  fltCompsWrapper = instance;
}

function initSliders() {
  const slider = document.getElementById("fltCmpSlider");

  if (slider) {
    // Set min and max
    slider.min = 40;
    slider.max = 200;

    // Handle 'input' (live, as user slides) and 'change' (on release)
    const handleSlide = (event) => {
      zoomSliderChanged(event); // Your existing callback function
    };

    slider.addEventListener("input", handleSlide); // Live update
    slider.addEventListener("change", handleSlide); // Final change (on release)
  }
}

var triggerChanged = true;

function zoomSliderChanged(event, ui) {
  if (triggerChanged) {
    document.getElementById("tbZoom").value = ui.value;

    fltCompsWrapper.changeZoom(ui.value);
  }
}

// global functions to be used from buttons etc...
export function switchComputers(computerIdx) {
  fltCompsWrapper?.switchComputers(computerIdx);

  var cr3container = document.getElementById("fltCompsControlsHeaderLeft");
  var e6bcontainer = document.getElementById("fltCompsControlsHeaderRight");

  var controlTable = document.getElementById("fltCompsControlsTable");

  controlTable.parentNode.removeChild(controlTable);

  cr3container.className = "";
  e6bcontainer.className = "";

  if (computerIdx === 0) {
    cr3container.className = "controlsActive";
    e6bcontainer.className = "controlsInactive";

    cr3container.appendChild(controlTable);
  } else {
    cr3container.className = "controlsInactive";
    e6bcontainer.className = "controlsActive";

    e6bcontainer.appendChild(controlTable);
  }
}

export function changeZoom() {
  if (fltCompsWrapper != undefined) {
    fltCompsWrapper.changeZoom(
      parseInt(document.getElementById("tbZoom").value)
    );
  }
}

export function showComputers() {
  fltCompsWrapper?.show();

  window.addEventListener("DOMMouseScroll", mouseWheel, false);
  window.onmousewheel = document.onmousewheel = mouseWheel;
}

function mouseWheel() {
  if (event.preventDefault) event.preventDefault();
  event.returnValue = false;
}

export function closeComputers() {
  fltCompsWrapper?.close();

  window.removeEventListener("DOMMouseScroll", mouseWheel, false);
  window.onmousewheel = document.onmousewheel = null;
}

export function switchSides() {
  fltCompsWrapper.switchSides();
}

export function drawDot() {
  fltCompsWrapper.drawDot();
}

export function drawLine() {
  fltCompsWrapper.drawLine();
}

export function clearDrawings() {
  fltCompsWrapper.clearDrawings();
}

export function incZoom() {
  var currentValue = parseInt(document.getElementById("tbZoom").value);

  currentValue += 10;

  document.getElementById("tbZoom").value = currentValue;

  fltCompsWrapper?.changeZoom(currentValue);
}

export function decZoom() {
  var currentValue = parseInt(document.getElementById("tbZoom").value);

  currentValue -= 10;

  document.getElementById("tbZoom").value = currentValue;

  fltCompsWrapper.changeZoom(currentValue);
}

// FlightComputersWrapper
export function FlightComputersWrapper() {
  initSliders();

  // store reference
  this.contentElement = document.getElementById("fltCompsContent");

  // init control vars
  this.computerIdx = 0;
  this.fltComps = [];
  this.fltComps[0] = undefined;
  this.fltComps[1] = undefined;

  this.fltCompsLayerNames = [];

  this.fltCompsLayerNames[0] = [];

  this.fltCompsLayerNames[0][0] = "cr3_1";
  this.fltCompsLayerNames[0][1] = "cr3_1_mask";
  this.fltCompsLayerNames[0][2] = "cr3_2";
  this.fltCompsLayerNames[0][3] = "cr3_2_mask";
  this.fltCompsLayerNames[0][4] = "cr3_3";
  this.fltCompsLayerNames[0][5] = "cr3_3_mask";
  this.fltCompsLayerNames[0][6] = "cr3_4";
  this.fltCompsLayerNames[0][7] = "cr3_4_mask";
  this.fltCompsLayerNames[0][8] = "cr3_5";
  this.fltCompsLayerNames[0][9] = "cr3_5_mask";
  this.fltCompsLayerNames[0][10] = "cr3_6";
  this.fltCompsLayerNames[0][11] = "cr3_6_mask";

  this.fltCompsLayerNames[1] = [];

  this.fltCompsLayerNames[1][0] = "e6b_1";
  this.fltCompsLayerNames[1][1] = "e6b_2";
  this.fltCompsLayerNames[1][2] = "e6b_2_mask";
  this.fltCompsLayerNames[1][3] = "e6b_3";
  this.fltCompsLayerNames[1][4] = "e6b_3_mask";
  this.fltCompsLayerNames[1][5] = "e6b_4";
  this.fltCompsLayerNames[1][6] = "e6b_5";
  this.fltCompsLayerNames[1][7] = "e6b_5_mask";
  this.fltCompsLayerNames[1][8] = "e6b_6";
  this.fltCompsLayerNames[1][9] = "e6b_6_mask";

  this.loadedImages = [];
}

FlightComputersWrapper.prototype.switchSides = function () {
  if (this.fltComps[this.computerIdx] != undefined) {
    this.fltComps[this.computerIdx].switchSides();
    this.fltComps[this.computerIdx].stop();
    this.fltComps[this.computerIdx].run();
  }
};

FlightComputersWrapper.prototype.switchComputers = function (computerIdx) {
  if (this.fltComps[this.computerIdx] != undefined) {
    this.fltComps[this.computerIdx].stop();
  }

  this.computerIdx = computerIdx;

  this.showComputer(this.computerIdx);
};

FlightComputersWrapper.prototype.show = function () {
  this.showContent();

  this.resizeSelf();

  this.showComputer(this.computerIdx);
};

FlightComputersWrapper.prototype.close = function () {
  this.hideContent();

  if (!!this.fltComps[this.computerIdx]) {
    this.fltComps[this.computerIdx].stop();
  }
};

FlightComputersWrapper.prototype.resizeSelf = function () {
  let vpw = window.innerWidth;
  let vph = window.innerHeight;

  var canvas = document.getElementById("fltCompsCanvas");

  // save the original canvas dimensions for future use
  var originalHeight = canvas.height;
  var originalWidth = canvas.width;

  // first set the dimensions to 0 so that the table can resize properly
  canvas.height = 0;
  canvas.width = 0;

  this.contentElement.height = vph;
  this.contentElement.width = vpw;

  // now fill the cell with the canvas
  canvas.height = this.contentElement.clientHeight; // clientHeight should include margins, so this way we offset the whole thing
  canvas.width = this.contentElement.clientWidth;

  if (this.fltComps[this.computerIdx]) {
    this.fltComps[this.computerIdx].resize(
      canvas.width - originalWidth,
      canvas.height - originalHeight
    );
  }
};

FlightComputersWrapper.prototype.showContent = function () {
  this.contentElement.style.display = "block";
};

FlightComputersWrapper.prototype.hideContent = function () {
  this.contentElement.style.display = "none";
};

FlightComputersWrapper.prototype.showComputer = function (computerIdx) {
  if (this.fltComps[computerIdx] === undefined) {
    this.loadComputer(computerIdx);
  } else {
    this.fltComps[computerIdx].scaleToFit();
    this.fltComps[computerIdx].run();
    this.updateZoom();
  }
};

FlightComputersWrapper.prototype.loadComputer = function (computerIdx) {
  document.getElementById("fltCompsWaitPanel").style.display = "block";

  this.loadedImages[computerIdx] = [];

  for (
    var imgIdx = 0;
    imgIdx < this.fltCompsLayerNames[computerIdx].length;
    imgIdx++
  ) {
    this.loadedImages[computerIdx].push(false);
  }

  var that = this;

  for (
    var imgIdx = 0;
    imgIdx < this.fltCompsLayerNames[computerIdx].length;
    imgIdx++
  ) {
    var c = computerIdx;
    var i = imgIdx;
    this.loadImage(
      document.getElementById(this.fltCompsLayerNames[computerIdx][imgIdx]),
      function (a, b) {
        that.imageLoaded(a, b);
      },
      c,
      i
    );
  }
};

FlightComputersWrapper.prototype.imageLoaded = function (computerIdx, imgIdx) {
  this.loadedImages[computerIdx][imgIdx] = true;

  for (var idx = 0; idx < this.fltCompsLayerNames[computerIdx].length; idx++) {
    if (this.loadedImages[computerIdx][idx] === false) {
      return;
    }
  }

  this.computerImagesLoaded(computerIdx);
};

FlightComputersWrapper.prototype.computerImagesLoaded = function (computerIdx) {
  var computer = null;

  document.getElementById("fltCompsWaitPanel").style.display = "none";

  var slider = document.getElementById("fltCmpSlider");

  if (slider) {
    this.maxZoom = parseFloat(slider.max); // or Number(slider.max)
    this.minZoom = parseFloat(slider.min);
  }
  //   var slider = $("#fltCmpSlider");

  //   if (slider) {
  //     this.maxZoom = slider.slider("option")["max"];
  //     this.minZoom = slider.slider("option")["min"];
  //   }

  if (computerIdx == 0) {
    computer = new CR3(
      document.getElementById("fltCompsCanvas"),
      new FlightComputerLayer(
        document.getElementById(this.fltCompsLayerNames[0][4]),
        document.getElementById(this.fltCompsLayerNames[0][5]),
        255,
        607,
        605,
        false
      ),
      new FlightComputerLayer(
        document.getElementById(this.fltCompsLayerNames[0][2]),
        document.getElementById(this.fltCompsLayerNames[0][3]),
        16711680,
        539,
        537,
        false
      ),
      new FlightComputerLayer(
        document.getElementById(this.fltCompsLayerNames[0][0]),
        document.getElementById(this.fltCompsLayerNames[0][1]),
        0,
        465.5,
        465.5,
        false
      ),
      new FlightComputerLayer(
        document.getElementById(this.fltCompsLayerNames[0][6]),
        document.getElementById(this.fltCompsLayerNames[0][7]),
        0,
        597,
        596,
        false
      ),
      new FlightComputerLayer(
        document.getElementById(this.fltCompsLayerNames[0][8]),
        document.getElementById(this.fltCompsLayerNames[0][9]),
        16711680,
        525.5,
        525.5,
        false
      ),
      new FlightComputerLayer(
        document.getElementById(this.fltCompsLayerNames[0][10]),
        document.getElementById(this.fltCompsLayerNames[0][11]),
        255,
        110,
        554,
        true
      ),
      this.minZoom / 100,
      this.maxZoom / 100
    );
  } else if (computerIdx == 1) {
    computer = new E6B(
      document.getElementById("fltCompsCanvas"),
      new FlightComputerLayer(
        document.getElementById(this.fltCompsLayerNames[1][0]),
        undefined,
        101010,
        358,
        902,
        false
      ),
      new FlightComputerLayer(
        document.getElementById(this.fltCompsLayerNames[1][1]),
        document.getElementById(this.fltCompsLayerNames[1][2]),
        255,
        450,
        530,
        false
      ),
      new FlightComputerLayer(
        document.getElementById(this.fltCompsLayerNames[1][3]),
        document.getElementById(this.fltCompsLayerNames[1][4]),
        16711680,
        441,
        439,
        false
      ),
      new FlightComputerLayer(
        document.getElementById(this.fltCompsLayerNames[1][5]),
        undefined,
        101010,
        358,
        902,
        false
      ),
      new FlightComputerLayer(
        document.getElementById(this.fltCompsLayerNames[1][6]),
        document.getElementById(this.fltCompsLayerNames[1][7]),
        255,
        450,
        530,
        false
      ),
      new FlightComputerLayer(
        document.getElementById(this.fltCompsLayerNames[1][8]),
        document.getElementById(this.fltCompsLayerNames[1][9]),
        16711680,
        377,
        377,
        false
      ),
      this.minZoom / 100,
      this.maxZoom / 100
    );
  }

  var that = this;
  computer.drawingEndCallback = function () {
    that.updateDrawingControls();
  };

  this.fltComps[computerIdx] = computer;

  if (this.computerIdx === computerIdx) {
    this.showComputer(computerIdx);
  }
};

FlightComputersWrapper.prototype.loadImage = function (
  element,
  onLoadCallback,
  param1,
  param2
) {
  var img = new Image();
  //   console.log(element, param1, param2);
  img.id = element?.id;
  img.width = element?.width;
  img.height = element?.height;
  img.className = element?.className;

  var src = element.getAttribute("lazy-src") || element.getAttribute("src");
  console.log(src);

  img.onload = function () {
    if (!!element.parentElement) {
      element.parentElement.replaceChild(img, element);
    } else {
      element.src = src;
    }

    onLoadCallback(param1, param2);
  };

  console.log(img);
  img.src = src;
};

FlightComputersWrapper.prototype.updateZoom = function () {
  if (this.fltComps[this.computerIdx] === undefined) {
    return;
  }

  var zoom = this.fltComps[this.computerIdx].getZoom() * 100;

  var zoomValueHolder = document.getElementById("tbZoom");

  var slider = document.getElementById("fltCmpSlider");

  if (slider) {
    var zoomValue = Math.floor(zoom);

    var zoomValueInBounds = Math.min(
      this.maxZoom,
      Math.max(this.minZoom, zoomValue)
    );

    // Update the slider's value (without triggering events if needed)
    triggerChanged = false;

    slider.value = zoomValueInBounds; // Set the value

    triggerChanged = true;
  }

  //   var slider = $("#fltCmpSlider");

  //   if (slider) {
  //     var zoomValue = Math.floor(zoom);

  //     var zoomValueInBounds = Math.min(
  //       this.maxZoom,
  //       Math.max(this.minZoom, zoomValue)
  //     );

  //     // values are reversed so that the maximum is on top
  //     zoomValueHolder.value = zoomValueInBounds;

  //     triggerChanged = false;

  //     slider.slider("option", "value", zoomValueInBounds);

  //     triggerChanged = true;
  //   }
};

FlightComputersWrapper.prototype.changeZoom = function (zoom) {
  if (this.fltComps[this.computerIdx] === undefined) {
    return;
  }

  zoom = Math.min(Math.max(this.minZoom, zoom), this.maxZoom);

  this.fltComps[this.computerIdx].setZoom(zoom / 100);

  this.updateZoom();
};

FlightComputersWrapper.prototype.updateDrawingControls = function () {
  if (this.fltComps[this.computerIdx] === undefined) {
    return;
  }

  var drawDotBtn = document.getElementById("fltCompsDrawDotBtn");
  var drawLineBtn = document.getElementById("fltCompsDrawLineBtn");

  var drawDotIco = document.getElementById("fltCompsDrawDotSupp");
  var drawLineIco = document.getElementById("fltCompsDrawLineSupp");

  drawDotBtn.classList.remove("fltCompBoldColor");
  drawLineBtn.classList.remove("fltCompBoldColor");

  drawDotBtn.classList.add("fltCompNormalColor");
  drawLineBtn.classList.add("fltCompNormalColor");

  drawDotIco.className = "fltCompsDrawDotSuppNormal";
  drawLineIco.className = "fltCompsDrawDotSuppNormal";

  if (this.fltComps[this.computerIdx].drawNext === "dot") {
    drawDotBtn.classList.remove("fltCompNormalColor");
    drawDotBtn.classList.add("fltCompBoldColor");
    drawDotIco.className = "fltCompsDrawDotSuppBold";
  }

  if (
    this.fltComps[this.computerIdx].drawNext === "line_start" ||
    this.fltComps[this.computerIdx].drawNext === "line_end"
  ) {
    drawLineBtn.classList.remove("fltCompNormalColor");
    drawLineBtn.classList.add("fltCompBoldColor");
    drawLineIco.className = "fltCompsDrawDotSuppBold";
  }
};

FlightComputersWrapper.prototype.drawLine = function () {
  if (this.fltComps[this.computerIdx] === undefined) {
    return;
  }

  this.fltComps[this.computerIdx].drawLine();

  this.updateDrawingControls();
};

FlightComputersWrapper.prototype.drawDot = function () {
  if (this.fltComps[this.computerIdx] === undefined) {
    return;
  }

  this.fltComps[this.computerIdx].drawDot();

  this.updateDrawingControls();
};

FlightComputersWrapper.prototype.clearDrawings = function () {
  if (this.fltComps[this.computerIdx] === undefined) {
    return;
  }

  this.fltComps[this.computerIdx].clearDrawings();
};
