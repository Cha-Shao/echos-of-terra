import { extend } from "@pixi/react"
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
type DictLevel = 0 | 1 | 2 | 3 | 4

const MapMenu = () => {
  const [zoom, zoomController] = useReducer(
    (state: number, action: { type: "zoomIn" | "zoomOut" }) => {
      const newState = state + (action.type === "zoomIn" ? 1 : -1)
      switch (action.type) {
        case "zoomIn":
          return Math.min(newState, 63)
        case "zoomOut":
          return Math.max(newState, -7)
        default:
          return state
      }
    },
    0,
  )
  const [dictLevel, setDictLevel] = useState<DictLevel>(0)
  const [scale, setScale] = useState<number>(0)
  const [dragging, setDragging] = useState<boolean>(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })

  useEffect(() => {
    const handleZoom = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        zoomController({ type: "zoomIn" })
      } else {
        zoomController({ type: "zoomOut" })
      }
    }

    addEventListener("wheel", handleZoom)

    return () => {
      removeEventListener("wheel", handleZoom)
    }
  }, [])

  useEffect(() => {
    const dictLevel = 4 - Math.floor((zoom + 8) / 16)
    setDictLevel(dictLevel as DictLevel)
    const scale = 1 + ((zoom + 8) % 16 + 1) / 16
    setScale(scale)

    console.log(zoom, dictLevel, scale)
  }, [zoom])

  return (
    <pixiContainer
      position={position}
      scale={scale}
      x={window.innerWidth / 2}
      y={window.innerHeight / 2}
    >
      {data.region.map(region => {
        const blockDict = region.blockDict[dictLevel]

        return blockDict && (
          <pixiContainer
            key={region.id}
            x={0}
            y={0}
            zIndex={region.zIndex}
          >
            {blockDict.map(block => (
              <Block
                key={block.key}
                textureUrl={`/blocks/${block.key}.png`}
                x={block.pos.x * 512}
                y={block.pos.y * 512}
              />
            ))}
          </pixiContainer>
        )
      })}
    </pixiContainer>
  )
}

export default MapMenu
