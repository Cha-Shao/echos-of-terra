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
type DictLevel = 0 | 1 | 2 | 3 | 4

const MapMenu = () => {
  const { app } = useApplication()

  const [zoom, zoomController] = useReducer(
    (state: number, action: { type: "zoomIn" | "zoomOut" }) => {
      const newState = state + (action.type === "zoomIn" ? 1 : -1)
      switch (action.type) {
        case "zoomIn":
          return Math.min(newState, 63)
        case "zoomOut":
          return Math.max(newState, 0)
        default:
          return state
      }
    },
    0,
  )
  const [dictLevel, setDictLevel] = useState<DictLevel>(0)
  const [scale, setScale] = useState<number>(0)
  const [position, setPosition] = useState<Position>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  })

  useEffect(() => {
    const handleZoom = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        zoomController({ type: "zoomIn" })
      } else {
        zoomController({ type: "zoomOut" })
      }
    }


    document.addEventListener("wheel", handleZoom)

    return () => {
      removeEventListener("wheel", handleZoom)
    }
  }, [app])

  useEffect(() => {
    let dragging = false

    const handleMouseDown = () => {
      dragging = true
    }
    const handleMouseUp = () => {
      console.log("mouseup")
      dragging = false
    }
    const handleMove = (e: MouseEvent) => {
      if (dragging) {
        setPosition(prev => ({
          x: prev.x + (e.movementX),
          y: prev.y + (e.movementY),
        }))
      }
    }

    document.addEventListener("pointerdown", handleMouseDown)
    document.addEventListener("pointerup", handleMouseUp)
    document.addEventListener("pointerleave", handleMouseUp)
    document.addEventListener("pointermove", handleMove)

    return () => {
      document.removeEventListener("pointerdown", handleMouseDown)
      document.removeEventListener("pointerup", handleMouseUp)
      document.removeEventListener("pointerleave", handleMouseUp)
      document.removeEventListener("pointermove", handleMove)
    }
  }, [app])

  useEffect(() => {
    const dictLevel = Math.min(4, 4 - Math.floor((zoom + 6) / 14))
    setDictLevel(dictLevel as DictLevel)
    const scale = 0.5 + (zoom + 6) % 14 / 14
    setScale(scale)

    console.log(zoom, dictLevel, scale)
  }, [zoom])

  useEffect(() => {
    let lastDistance = 0
    let isPinching = false

    const getDistance = (touches: TouchList) => {
      const [a, b] = [touches[0], touches[1]]
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        isPinching = true
        lastDistance = getDistance(e.touches)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isPinching && e.touches.length === 2) {
        const newDistance = getDistance(e.touches)
        if (Math.abs(newDistance - lastDistance) > 5) { // 阈值防抖
          if (newDistance > lastDistance) {
            zoomController({ type: "zoomIn" })
          } else {
            zoomController({ type: "zoomOut" })
          }
          lastDistance = newDistance
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        isPinching = false
      }
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: false })
    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd, { passive: false })

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [app])

  return (
    <pixiContainer
      position={position}
      scale={scale}
      x={window.innerWidth / 2}
      y={window.innerHeight / 2}
      anchor={0.5}
    >
      {data.region.map(region => {
        const blockDict = region.blockDict[dictLevel]

        return blockDict && (
          <pixiContainer
            key={region.id}
            zIndex={region.zIndex}
            anchor={0.5}
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
