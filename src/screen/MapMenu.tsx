import { extend, useApplication } from "@pixi/react"
import {
  Container,
  Graphics,
  Sprite,
} from "pixi.js"
import { useEffect, useReducer, useState } from "react"
import Block from "./Map/Block"
import data from "../data"

extend({
  Container,
  Graphics,
  Sprite,
})

interface Position {
  x: number
  y: number
}
type ZoomLevel = 0 | 1 | 2 | 3 | 4
const offsetMultiple = [
  1,
  512,
  256,
  170.5,
  64,
]

const MapMenu = () => {
  const { app } = useApplication()

  const [zoom, zoomController] = useReducer(
    (state: number, action: { type: "zoomIn" | "zoomOut" }) => {
      const newState = state + (action.type === "zoomIn" ? 1 : -1)
      switch (action.type) {
        case "zoomIn":
          return Math.min(newState, 64)
        case "zoomOut":
          return Math.max(newState, 1)
        default:
          return state
      }
    },
    32,
  )
  const [scaleLevel, setScaleLevel] = useState<ZoomLevel>(0)
  const [dragging, setDragging] = useState<boolean>(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })

  useEffect(() => {
    app.canvas.addEventListener("wheel", (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY < 0) {
        zoomController({ type: "zoomOut" })
      } else {
        zoomController({ type: "zoomIn" })
      }
    })
  }, [app])

  useEffect(() => {
    setScaleLevel(Math.floor((zoom + 8) / 16) as ZoomLevel)
  }, [scaleLevel, zoom])

  return (
    <pixiContainer
      position={position}
      scale={2 - (zoom % 16) / 16}
      x={window.innerWidth / 2}
      y={window.innerHeight / 2}
    >
      {data.region.map(region => {
        const blockDict = region.blockDict[scaleLevel]

        return blockDict && (
          <pixiContainer
            key={region.id}
            // x={region.offset?.x || 0}
            // y={region.offset?.y || 0}
            x={0}
            y={0}
            zIndex={region.zIndex}
          >
            {blockDict.map(block => (
              <Block
                key={block.key}
                textureUrl={`/blocks/${block.key}.png`}
                x={block.pos.x * (scaleLevel * offsetMultiple[scaleLevel])}
                y={block.pos.y * (scaleLevel * offsetMultiple[scaleLevel])}
              />
            ))}
          </pixiContainer>
        )
      })}
    </pixiContainer>
  )
}

export default MapMenu
