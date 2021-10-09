import { useCallback, useEffect } from 'react'
import { CanvasLayer } from '../types'
import UniImage from '../canvas/UniImage'
import { drawImage } from '../helpers'
import { useCanvasRef } from './canvas'

type UseGridProps = Omit<CanvasLayer, 'isLoaded'>

type DrawGridProps = {
  gridColor: string
}

export function useGrid({ ctx, canvas }: UseGridProps) {
  const eraseGrid = useCallback(() => {
    if (!ctx || !canvas) return
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
  }, [ctx, canvas])

  const drawGrid = useCallback(
    ({ gridColor }: DrawGridProps) => {
      if (!ctx || !canvas) return
      const { width, height } = canvas

      ctx.clearRect(0, 0, width, height)
      ctx.beginPath()
      ctx.setLineDash([5, 1])
      ctx.setLineDash([])
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 0.5

      const gridSize = 25

      let countX = 0
      while (countX < width) {
        countX += gridSize
        ctx.moveTo(countX, 0)
        ctx.lineTo(countX, height)
      }
      ctx.stroke()

      let countY = 0
      while (countY < height) {
        countY += gridSize
        ctx.moveTo(0, countY)
        ctx.lineTo(width, countY)
      }
      ctx.stroke()
    },
    [ctx, canvas]
  )

  return { drawGrid, eraseGrid }
}

type UseBackgroundLayerProps = {
  hideGrid?: boolean
  gridColor: string
  isLoaded: boolean
  imgSrc?: string
}

export function useBackgroundLayer({
  isLoaded,
  hideGrid,
  gridColor,
  imgSrc,
}: UseBackgroundLayerProps) {
  const { ctx, canvas } = useCanvasRef()

  const drawImageRequest = useCallback(() => {
    if (!imgSrc) return

    const img = new UniImage()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (!canvas.current) return
      const { width, height } = canvas.current
      drawImage({
        ctx: ctx.current,
        img,
        width,
        height,
      })
    }

    img.src = imgSrc
  }, [imgSrc, canvas, ctx])

  const { eraseGrid, drawGrid } = useGrid({
    canvas: canvas.current,
    ctx: ctx.current,
  })

  useEffect(() => {
    if (!isLoaded) return
    if (hideGrid) {
      eraseGrid()
    } else {
      drawGrid({ gridColor })
    }
    drawImageRequest()
  }, [hideGrid, isLoaded, gridColor, drawGrid, eraseGrid, drawImageRequest])

  return { backgroundLayer: canvas, backgroundCtx: ctx }
}
