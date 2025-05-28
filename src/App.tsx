import { useEffect, useState } from "react"
import MainMenu from "./screen/MainMenu"
import MapMenu from "./screen/MapMenu"
import { Application } from "@pixi/react"

function App() {
  const [start] = useState<boolean>(true)

  useEffect(() => {
    const bodyEl = document.querySelector("body")
    const htmlEl = document.querySelector("html")

    addEventListener("resize", () => {
      if (bodyEl) {
        bodyEl.style.height = `${window.innerHeight}px`
        bodyEl.style.width = `${window.innerWidth}px`
      }
      if (htmlEl) {
        htmlEl.style.fontSize = `${Math.max(
          window.innerWidth / 100,
          window.innerHeight / 100,
        )}px`
      }
    })
  }, [])

  return (
    <main>
      {start ? (
        <Application
          backgroundAlpha={0}
          resizeTo={window}
        >
          <MapMenu />
        </Application>
      ) : (
        <MainMenu
        // onStart={() => setStart(true)}
        />
      )}
    </main>
  )
}

export default App
