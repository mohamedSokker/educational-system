// helper class - stores references to a layer image, its mask, mask color and layer center coordinates
export function FlightComputerLayer(
  image,
  hitMask,
  hitMaskColor,
  centerX,
  centerY,
  maskNeedsRotation
) {
  this.image = image;
  this.hitMask = hitMask;
  this.centerX = centerX;
  this.centerY = centerY;
  this.maskColor = hitMaskColor;
  this.maskNeedsRotation = maskNeedsRotation;
}
