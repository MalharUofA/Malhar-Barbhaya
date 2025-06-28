import {create} from 'zustand'
import { addEffect } from '@react-three/fiber'

async function createAudio(url, { threshold, expire } = {}) {
  const res = await fetch(url)
  const bufferData = await res.arrayBuffer()
  const context = new (window.AudioContext || window.webkitAudioContext)()
  const analyser = context.createAnalyser()
  analyser.fftSize = 2048
  const data = new Uint8Array(analyser.frequencyBinCount)
  const decodedBuffer = await new Promise((res) => context.decodeAudioData(bufferData, res))

  const gainNode = context.createGain()
  gainNode.gain.value = 1
  gainNode.connect(context.destination)
  analyser.connect(gainNode)

  const state = {
    context,
    analyser,
    buffer: decodedBuffer,
    gainNode,
    data,
    gain: 1,
    source: null,
    signal: false,
    avg: 0,

    createSource() {
      const source = context.createBufferSource()
      source.buffer = decodedBuffer
      source.loop = true
      source.connect(analyser)
      this.source = source
    },

    start() {
      this.createSource()
      this.source.start(0)
    },

    stop() {
      try {
        if (this.source) {
          this.source.stop(0)
          this.source.disconnect()
          this.source = null
        }
      } catch (e) {
        console.warn('Audio already stopped or not started:', e.message)
      }
    },

    update() {
      let value = 0
      analyser.getByteFrequencyData(data)
      for (let i = 0; i < data.length; i++) value += data[i]
      const avg = (this.avg = value / data.length)

      const now = Date.now()
      if (threshold && avg > threshold && now - this._lastSignal > expire) {
        this._lastSignal = now
        this.signal = true
      } else {
        this.signal = false
      }
    },

    setGain(level) {
      gainNode.gain.setValueAtTime((this.gain = level), context.currentTime)
    },

    _lastSignal: Date.now()
  }

  return state
}


const mockData = () => ({ signal: false, avg: 0, gain: 1, data: [] })

const useStore = create((set, get) => {
  const drums = createAudio('/assets/drums.mp3', { threshold: 10, expire: 500 })
  const snare = createAudio('/assets/snare.mp3', { threshold: 40, expire: 500 })
  const synth = createAudio('/assets/synth.mp3')

  return {
    loaded: false,
    clicked: false,
    hasInteractedOnce: false,
    audio: { drums: mockData(), snare: mockData(), synth: mockData() },
    track: { synthonly: false, kicks: 0, loops: 0 },
    api: {
    async loaded() {
        set({
        loaded: true,
        audio: {
            drums: await drums,
            snare: await snare,
            synth: await synth,
        },
        })
    },

    stop() {
        const audio = get().audio
        Object.values(audio).forEach(file => {
        if (file.stop) file.stop()
        })
        set({ clicked: false })
        
    },

    start() {
        const audio = get().audio
        const track = get().track

        Object.values(audio).forEach(file => {
        if (file.start) file.start()
        })

        set({ clicked: true, hasInteractedOnce: true })

        addEffect(() => {
        Object.values(audio).forEach(file => {
            if (file.update) file.update()
        })

        if (audio.drums.signal) track.kicks++

        if (audio.snare.signal) {
            if (track.loops++ > 6) {
            track.synthonly = !track.synthonly
            audio.drums.setGain(track.synthonly ? 0 : 1)
            audio.snare.setGain(track.synthonly ? 0 : 1)
            track.loops = 0
            }
            track.kicks = 0
        }
        })
    },
      // ✅ Add this new method to directly set `clicked` value
      click(state) {
        set({ clicked: state });
      }
    }
  }
})


export default useStore
