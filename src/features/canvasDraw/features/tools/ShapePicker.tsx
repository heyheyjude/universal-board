import React from 'react'
import { ShapeName } from '../../shapes'
import PalletTool from '../../ui/PalletTool'
import { Text, TouchableOpacity } from 'react-native'
import { PickerProps } from './types'

const SHAPES: Partial<{ [key in ShapeName]: string }> = {
  _circle: 'circle',
  _line: 'line',
  _rectangle: 'rectangle',
  _triangleRight: 'triangle1',
  _triangleSymmetricHorizontal: 'triangle2',
  _triangleSymmetricVertical: 'triangle3',
}
const SHAPES_LIST = Object.entries(SHAPES) as [ShapeName, string][]

type ShapePickerProps = PickerProps<ShapeName>

export default function ShapePicker({
  currentValue,
  onSelect,
}: ShapePickerProps) {
  return (
    <PalletTool
      buttonInner={<Text>{SHAPES[currentValue]}</Text>}
      list={SHAPES_LIST}
    >
      {([shapeName, shapeLabel]) => {
        return (
          <TouchableOpacity key={shapeName} onPress={() => onSelect(shapeName)}>
            <Text>{shapeLabel}</Text>
          </TouchableOpacity>
        )
      }}
    </PalletTool>
  )
}