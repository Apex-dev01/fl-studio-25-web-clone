import { useState, useEffect } from 'react'
import * as Tone from 'tone'

function Mixer() {
  const [tracks, setTracks] = useState([])
  const [masterVolume, setMasterVolume] = useState(0.7)
  const [masterMeter, setMasterMeter] = useState(0)

  useEffect(() => {
    // Initialize 10 mixer tracks
    const initTracks = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Track ${i + 1}`,
      volume: 0.7,
      pan: 0,
      muted: false,
      solo: false,
      meter: 0,
      reverb: null,
      delay: null,
      fxSettings: {
        reverbWet: 0,
        delayWet: 0,
        delayTime: 0.25
      }
    }))
    setTracks(initTracks)
  }, [])

  const updateTrack = (id, updates) => {
    setTracks(tracks.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const toggleMute = (id) => {
    setTracks(tracks.map(t => {
      if (t.id === id) {
        return { ...t, muted: !t.muted }
      }
      return t
    }))
  }

  const toggleSolo = (id) => {
    setTracks(tracks.map(t => {
      if (t.id === id) {
        return { ...t, solo: !t.solo }
      }
      return t
    }))
  }

  const addReverb = (id) => {
    const track = tracks.find(t => t.id === id)
    if (!track.reverb) {
      const reverb = new Tone.Reverb({ decay: 3, wet: 0 }).toDestination()
      updateTrack(id, { reverb })
    }
  }

  const addDelay = (id) => {
    const track = tracks.find(t => t.id === id)
    if (!track.delay) {
      const delay = new Tone.FeedbackDelay({ delayTime: 0.25, wet: 0 }).toDestination()
      updateTrack(id, { delay })
    }
  }

  const updateFX = (id, fxType, value) => {
    const track = tracks.find(t => t.id === id)
    if (fxType === 'reverb' && track.reverb) {
      track.reverb.wet.value = value
      updateTrack(id, { fxSettings: { ...track.fxSettings, reverbWet: value } })
    } else if (fxType === 'delay' && track.delay) {
      track.delay.wet.value = value
      updateTrack(id, { fxSettings: { ...track.fxSettings, delayWet: value } })
    }
  }

  return (
    <div className="bg-fl-panel border-l border-gray-800 w-full p-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-fl-accent">Mixer</h2>
      </div>

      <div className="flex gap-2">
        {tracks.map((track) => (
          <div key={track.id} className="flex-shrink-0 bg-fl-dark p-3 rounded w-20">
            {/* Track Name */}
            <div className="text-xs font-semibold mb-2 text-center truncate">
              {track.name}
            </div>

            {/* Volume Fader */}
            <div className="flex justify-center mb-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={track.volume}
                onChange={(e) => updateTrack(track.id, { volume: parseFloat(e.target.value) })}
                className="h-32 vertical-slider"
                style={{
                  writingMode: 'bt-lr',
                  WebkitAppearance: 'slider-vertical',
                  width: '8px'
                }}
              />
            </div>

            {/* Volume Display */}
            <div className="text-xs text-center mb-2">
              {Math.round(track.volume * 100)}%
            </div>

            {/* Pan Knob */}
            <div className="mb-2">
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={track.pan}
                onChange={(e) => updateTrack(track.id, { pan: parseFloat(e.target.value) })}
                className="w-full"
                title="Pan"
              />
              <div className="text-xs text-center">
                {track.pan === 0 ? 'C' : track.pan > 0 ? `R${Math.round(track.pan * 100)}` : `L${Math.round(Math.abs(track.pan) * 100)}`}
              </div>
            </div>

            {/* Mute/Solo Buttons */}
            <div className="flex gap-1 mb-2">
              <button
                onClick={() => toggleMute(track.id)}
                className={`flex-1 px-2 py-1 rounded text-xs transition ${
                  track.muted ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              >
                M
              </button>
              <button
                onClick={() => toggleSolo(track.id)}
                className={`flex-1 px-2 py-1 rounded text-xs transition ${
                  track.solo ? 'bg-yellow-600' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              >
                S
              </button>
            </div>

            {/* FX Slots */}
            <div className="space-y-1">
              <button
                onClick={() => addReverb(track.id)}
                className="w-full bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs transition"
              >
                {track.reverb ? '✓ Reverb' : '+ Reverb'}
              </button>
              {track.reverb && (
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={track.fxSettings.reverbWet}
                  onChange={(e) => updateFX(track.id, 'reverb', parseFloat(e.target.value))}
                  className="w-full"
                />
              )}
              <button
                onClick={() => addDelay(track.id)}
                className="w-full bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs transition"
              >
                {track.delay ? '✓ Delay' : '+ Delay'}
              </button>
              {track.delay && (
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={track.fxSettings.delayWet}
                  onChange={(e) => updateFX(track.id, 'delay', parseFloat(e.target.value))}
                  className="w-full"
                />
              )}
            </div>

            {/* Output Meter */}
            <div className="mt-2 h-2 bg-gray-800 rounded overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${track.meter * 100}%` }}
              />
            </div>
          </div>
        ))}

        {/* Master Track */}
        <div className="flex-shrink-0 bg-fl-accent bg-opacity-20 p-3 rounded w-20 border border-fl-accent">
          <div className="text-xs font-bold mb-2 text-center">
            MASTER
          </div>

          <div className="flex justify-center mb-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="h-32 vertical-slider"
              style={{
                writingMode: 'bt-lr',
                WebkitAppearance: 'slider-vertical',
                width: '8px'
              }}
            />
          </div>

          <div className="text-xs text-center mb-2">
            {Math.round(masterVolume * 100)}%
          </div>

          <div className="mt-2 h-4 bg-gray-800 rounded overflow-hidden">
            <div
              className="h-full bg-fl-accent transition-all"
              style={{ width: `${masterMeter * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mixer
