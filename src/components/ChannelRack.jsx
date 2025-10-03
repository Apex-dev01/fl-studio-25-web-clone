import { useState, useEffect } from 'react'
import * as Tone from 'tone'

function ChannelRack({ bpm, isPlaying, channels, setChannels, currentStep }) {
  const [stepCount, setStepCount] = useState(16)

  const addChannel = () => {
    setChannels([...channels, {
      id: Date.now(),
      name: `Channel ${channels.length + 1}`,
      muted: false,
      pattern: Array(stepCount).fill(false),
      synth: new Tone.Synth().toDestination(),
      note: 'C4'
    }])
  }

  const deleteChannel = (id) => {
    setChannels(channels.filter(ch => ch.id !== id))
  }

  const toggleMute = (id) => {
    setChannels(channels.map(ch => 
      ch.id === id ? { ...ch, muted: !ch.muted } : ch
    ))
  }

  const toggleStep = (channelId, stepIndex) => {
    setChannels(channels.map(ch => {
      if (ch.id === channelId) {
        const newPattern = [...ch.pattern]
        newPattern[stepIndex] = !newPattern[stepIndex]
        return { ...ch, pattern: newPattern }
      }
      return ch
    }))
  }

  const changeStepCount = (count) => {
    setStepCount(count)
    setChannels(channels.map(ch => ({
      ...ch,
      pattern: Array(count).fill(false).map((_, i) => ch.pattern[i] || false)
    })))
  }

  return (
    <div className="bg-fl-panel border-r border-gray-800 w-96 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-fl-blue">Channel Rack</h2>
        <div className="flex gap-2">
          <select 
            value={stepCount} 
            onChange={(e) => changeStepCount(Number(e.target.value))}
            className="bg-gray-700 px-2 py-1 rounded text-sm"
          >
            <option value={16}>16</option>
            <option value={32}>32</option>
            <option value={64}>64</option>
          </select>
          <button 
            onClick={addChannel}
            className="bg-fl-accent hover:bg-orange-600 px-3 py-1 rounded text-sm transition"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {channels.map((channel) => (
          <div key={channel.id} className="bg-fl-dark rounded p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">{channel.name}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => toggleMute(channel.id)}
                  className={`px-2 py-1 rounded text-xs transition ${
                    channel.muted ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {channel.muted ? 'M' : 'M'}
                </button>
                <button
                  onClick={() => deleteChannel(channel.id)}
                  className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs transition"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="flex gap-1 overflow-x-auto">
              {channel.pattern.map((active, stepIndex) => (
                <button
                  key={stepIndex}
                  onClick={() => toggleStep(channel.id, stepIndex)}
                  className={`w-6 h-6 rounded transition ${
                    active ? 'bg-fl-accent' : 'bg-gray-700'
                  } ${
                    currentStep === stepIndex && isPlaying ? 'ring-2 ring-white' : ''
                  }`}
                  title={`Step ${stepIndex + 1}`}
                >
                  {active && currentStep === stepIndex && isPlaying && (
                    <div className="w-2 h-2 bg-green-400 rounded-full mx-auto animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {channels.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p className="mb-2">No channels yet</p>
          <button
            onClick={addChannel}
            className="bg-fl-accent hover:bg-orange-600 px-4 py-2 rounded transition"
          >
            Add First Channel
          </button>
        </div>
      )}
    </div>
  )
}

export default ChannelRack
