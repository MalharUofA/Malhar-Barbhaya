import React from 'react'
import useStore from '../hooks/store'
import '/src/Overlay.css' // Optional: for fade animation

const Overlay = () => {
  const loaded = useStore((state) => state.loaded)
  const clicked = useStore((state) => state.clicked)
  const hasInteractedOnce = useStore((state) => state.hasInteractedOnce)

  const api = useStore((state) => state.api)

  if (!loaded || hasInteractedOnce) return null

  return (
    <div className="overlay" onClick={() => api.start()}>
      <div className="overlay-text">
        <p>👆 Tap the statue to start the animation</p>
        <p className="hint">(Audio on — best with headphones 🎧)</p>
      </div>
    </div>
  )
}

export default Overlay
