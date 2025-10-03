import { useState } from 'react'
import * as Tone from 'tone'

function InstrumentLoader({ onLoadSample, onLoadSynth }) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = [...e.dataTransfer.files]
    for (const file of files) {
      if (file.type.includes('audio')) {
        const url = URL.createObjectURL(file)
        const player = new Tone.Player(url).toDestination()
        await player.load()
        onLoadSample({ name: file.name, player, url })
      }
    }
  }

  const handleFileInput = async (e) => {
    const files = [...e.target.files]
    for (const file of files) {
      if (file.type.includes('audio')) {
        const url = URL.createObjectURL(file)
        const player = new Tone.Player(url).toDestination()
        await player.load()
        onLoadSample({ name: file.name, player, url })
      }
    }
  }

  const create3OscSynth = () => {
    // Virtual analog synth with 3 oscillators (simplified)
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toDestination()

    onLoadSynth({ name: '3xOsc Synth', synth, type: 'synth' })
  }

  return (
    <div className="p-4 bg-fl-panel border border-gray-800 rounded">
      <h3 className="text-md font-bold mb-3 text-fl-blue">Instrument/Sample Loader</h3>

      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded p-6 text-center transition ${
          dragActive ? 'border-fl-accent bg-fl-accent bg-opacity-10' : 'border-gray-600'
        }`}
      >
        <p className="text-sm mb-2">🎵 Drag & Drop WAV/MP3 files here</p>
        <p className="text-xs text-gray-400">or</p>
        <label className="inline-block mt-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded cursor-pointer transition">
          Browse Files
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>

      {/* Virtual Instruments */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Virtual Instruments</h4>
        <button
          onClick={create3OscSynth}
          className="w-full bg-fl-dark hover:bg-gray-700 p-3 rounded text-left transition"
        >
          <div className="font-semibold">3xOsc - Virtual Analog Synth</div>
          <div className="text-xs text-gray-400">3 oscillator subtractive synthesizer</div>
        </button>
      </div>
    </div>
  )
}

export default InstrumentLoader
