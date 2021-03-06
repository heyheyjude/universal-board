import { Point, ToolInterface } from '../types'
import { clearCanvasByContext, midPointBtw } from '../helpers'
import { setBrushSettings } from './_helpers'
import { IS_WEB } from '../helpers/platform'

function mobilePenRedraw(ctx: CanvasRenderingContext2D, points: Point[]) {
  points.forEach((p2, index) => {
    if (index === 0) return
    const p1 = points[index - 1]
    const midPoint = midPointBtw(p1, p2)
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.quadraticCurveTo(p2.x, p2.y, midPoint.x, midPoint.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
  })
}

export function penDraw(ctx: CanvasRenderingContext2D, points: Point[]) {
  const { length } = points
  if (length < 2) return
  const p1 = points[length - 2]
  const p2 = points[length - 1]
  const midPoint = midPointBtw(p1, p2)
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.quadraticCurveTo(midPoint.x, midPoint.y, p2.x, p2.y)
  ctx.stroke()
}

function penRedraw(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length < 2) return
  let p1 = points[0]
  let p2 = points[1]
  ctx.moveTo(points[1].x, points[1].y)
  ctx.beginPath()

  for (let i = 1; i < points.length; i++) {
    let midPoint = midPointBtw(p1, p2)
    ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y)
    p1 = points[i]
    p2 = points[i + 1]
  }
  ctx.lineTo(p1.x, p1.y)
  ctx.stroke()
}

const draw = IS_WEB ? penRedraw : penDraw
const redraw = IS_WEB ? penRedraw : mobilePenRedraw
const clear = IS_WEB ? clearCanvasByContext : () => {}

export const Free: ToolInterface = {
  name: '_free',
  isLazyAvailable: true,
  onDrawMove(ctx, points, { width, height, ...brushSettings }) {
    if (!ctx) return
    setBrushSettings(ctx, brushSettings)
    clear(ctx, width, height)
    draw(ctx, points)
  },
  onRepeat(ctx, { points, ...brushSettings }) {
    if (!ctx) return
    setBrushSettings(ctx, brushSettings)
    redraw(ctx, points)
  },
  onSave(ctx, { points, ...brushSettings }) {
    if (!ctx || points.length < 2) return false
    setBrushSettings(ctx, brushSettings)
    redraw(ctx, points)
  },
}
