import React, { useRef, useState } from 'react'
import DrawArea from './DrawArea'
import ToolBar from './features/ToolBar/ToolBar'
import { GREY } from './constants/colors'
import { ActionsController, Colors, dummyHistoryController } from './types'
import { ToolName } from './tools'

const dummyBoardController: ActionsController = {
  clear() {},
}

export default function DrawBoard() {
  const [brushColor, setBrushColor] = useState<Colors>(GREY)
  const historyController = useRef(dummyHistoryController)
  const boardController = useRef(dummyBoardController)
  const [currentShape, setCurrentShape] = useState<ToolName>('_rectangle')
  const [brushRadius, setBrushRadius] = useState(2.5)
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <>
      <DrawArea
        brushColor={brushColor}
        brushRadius={brushRadius}
        historyController={historyController}
        controller={boardController}
        //shape={Shapes[currentShape]}
        shapeName={currentShape}
      />
      <ToolBar
        currentColor={brushColor}
        onColorSelect={setBrushColor}
        currentShape={currentShape}
        onShapeSelect={setCurrentShape}
        currentThickness={brushRadius}
        onThicknessSelect={setBrushRadius}
        onStepBack={() => {
          historyController.current.stepBack()
          setIsPlaying(false)
        }}
        onStepForward={() => {
          historyController.current.stepForward()
          setIsPlaying(false)
        }}
        isHistoryPlaying={isPlaying}
        onHistoryReplay={() => {
          const currentState = historyController.current.togglePlaying({
            onStop() {
              setIsPlaying(false)
            },
          })
          if (currentState !== undefined) setIsPlaying(currentState)
        }}
        onClear={() => boardController.current.clear()}
      />
    </>
  )
}
