import { useState, useEffect, useRef } from 'react'
import * as Tone from 'tone'
import ChannelRack from './components/ChannelRack'
import PianoRoll from './components/PianoRoll'
import Mixer from './components/Mixer'
import InstrumentLoader from './components/InstrumentLoader'

function App() {
  const [bpm, setBpm] = useState(140)
  const [isPlaying, setIsPlaying] = useState(false)
  const [channels, setChannels] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const loopRef = useRef(null)

  // Initialize Tone.Transport
  useEffect(() => {
    Tone.Transport.bpm.value = bpm
  }, [bpm])

  // Handle transport and sequencer
  useEffect(() => {
    if (isPlaying) {
      // Start audio context on user interaction
      Tone.start()
      
      // Setup step sequencer loop
      loopRef.current = new Tone.Sequence(
        (time, step) => {
          setCurrentStep(step)
          
          // Play active steps for each channel
          channels.forEach(channel => {
            if (!channel.muted && channel.pattern[step]) {
              if (channel.synth) {
                channel.synth.triggerAttackRelease(channel.note || 'C4', '8n', time)
              }
            }
          })
        },
        [...Array(channels[0]?.pattern.length || 16).keys()],
        '16n'
      )

      loopRef.current.start(0)
      Tone.Transport.start()
    } else {
      if (loopRef.current) {
        loopRef.current.stop()
        loopRef.current.dispose()
      }
      Tone.Transport.stop()
      setCurrentStep(0)
    }

    return () => {
      if (loopRef.current) {
        loopRef.current.stop()
        loopRef.current.dispose()
      }
    }
  }, [isPlaying, channels])

  const handlePlay = async () => {
    await Tone.start()
    setIsPlaying(!isPlaying)
  }

  const handleStop = () => {
    setIsPlaying(false)
    Tone.Transport.stop()
    setCurrentStep(0)
  }

  const handleBpmChange = (value) => {
    const newBpm = Math.max(60, Math.min(240, value))
    setBpm(newBpm)
    Tone.Transport.bpm.value = newBpm
  }

  const handleLoadSample = (sample) => {
    setChannels([...channels, {
      id: Date.now(),
      name: sample.name,
      muted: false,
      pattern: Array(16).fill(false),
      synth: sample.player,
      note: 'C4'
    }])
  }

  const handleLoadSynth = (synth) => {
    setChannels([...channels, {
      id: Date.now(),
      name: synth.name,
      muted: false,
      pattern: Array(16).fill(false),
      synth: synth.synth,
      note: 'C4'
    }])
  }

  return (
    <div className="min-h-screen bg-fl-darker text-white flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-fl-panel border-b border-gray-800 p-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-fl-accent">FL Studio 25 Web Clone</h1>
          
          {/* Transport Controls */}
          <div className="flex gap-2">
            <button
              onClick={handlePlay}
              className="bg-fl-accent hover:bg-orange-600 px-4 py-2 rounded transition"
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <button
              onClick={handleStop}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
            >
              ⏹️ Stop
            </button>
            <button className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded transition">
              ⏺ Record
            </button>
          </div>

          {/* BPM Control */}
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded">
            <label className="text-sm font-semibold">BPM:</label>
            <input
              type="number"
              value={bpm}
              onChange={(e) => handleBpmChange(Number(e.target.value))}
              className="bg-gray-700 px-2 py-1 rounded w-16 text-center"
              min="60"
              max="240"
            />
          </div>
        </div>

        <div className="text-sm text-gray-400">
          Step: {currentStep + 1} / {channels[0]?.pattern.length || 16}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Channel Rack */}
        <ChannelRack
          bpm={bpm}
          isPlaying={isPlaying}
          channels={channels}
          setChannels={setChannels}
          currentStep={currentStep}
        />

        {/* Center - Piano Roll & Instrument Loader */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PianoRoll selectedChannel={null} />
          
          <div className="p-4 border-t border-gray-800">
            <InstrumentLoader
              onLoadSample={handleLoadSample}
              onLoadSynth={handleLoadSynth}
            />
          </div>
        </div>

        {/* Right Panel - Mixer */}
        <div className="w-full max-w-4xl border-l border-gray-800 overflow-x-auto">
          <Mixer />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-fl-panel border-t border-gray-800 p-2 text-sm text-gray-400 flex justify-between">
        <span>Ready | Phase 2: Full DAW Implementation</span>
        <span>Tone.js Transport: {isPlaying ? 'Running' : 'Stopped'} | BPM: {bpm}</span>
      </div>
    </div>
  )
}

export default App
