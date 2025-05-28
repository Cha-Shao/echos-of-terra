import { useEffect, useRef, useState } from "react"
import { Assets, Texture } from "pixi.js"

const Block = ({
  textureUrl,
  x,
  y,
}: {
  textureUrl: string
  x: number
  y: number
}) => {
  const spriteRef = useRef(null)

  const [texture, setTexture] = useState<Texture>(Texture.EMPTY)

  useEffect(() => {
    Assets
      .load(textureUrl)
      .then(t => setTexture(t))
  }, [textureUrl])

  return (
    <pixiSprite
      ref={spriteRef}
      anchor={0.5}
      texture={texture}
      x={x}
      y={y}
    />
  )
}

export default Block
