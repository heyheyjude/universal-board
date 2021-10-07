import { Coordinates, LazyPoint } from 'lazy-brush'

type DrawImageProps = {
  ctx: CanvasRenderingContext2D | null
  img: HTMLImageElement
  x?: number
  y?: number
  w?: number
  h?: number
  offsetX?: number
  offsetY?: number
}

export function drawImage({
  ctx,
  img,
  x,
  y,
  w,
  h,
  offsetX,
  offsetY,
}: DrawImageProps) {
  if (!ctx) return
  if (typeof x !== 'number') x = 0
  if (typeof y !== 'number') y = 0
  if (typeof w !== 'number') w = ctx.canvas.width
  if (typeof h !== 'number') h = ctx.canvas.height
  if (typeof offsetX !== 'number') offsetX = 0.5
  if (typeof offsetY !== 'number') offsetY = 0.5

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0
  if (offsetY < 0) offsetY = 0
  if (offsetX > 1) offsetX = 1
  if (offsetY > 1) offsetY = 1

  var iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r, // new prop. width
    nh = ih * r, // new prop. height
    cx,
    cy,
    cw,
    ch,
    ar = 1

  // decide which gap to fill
  if (nw < w) ar = w / nw
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh // updated
  nw *= ar
  nh *= ar

  // calc source rectangle
  cw = iw / (nw / w)
  ch = ih / (nh / h)

  cx = (iw - cw) * offsetX
  cy = (ih - ch) * offsetY

  // make sure source rectangle is valid
  if (cx < 0) cx = 0
  if (cy < 0) cy = 0
  if (cw > iw) cw = iw
  if (ch > ih) ch = ih

  // fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h)
}

export function midPointBtw(p1: Coordinates, p2: Coordinates) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  }
}