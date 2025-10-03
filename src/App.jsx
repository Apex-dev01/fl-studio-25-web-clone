import { useState } from 'react'

function App() {
  const [bpm, setBpm] = useState(140)
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="min-h-screen bg-fl-darker text-white flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-fl-panel border-b border-gray-800 p-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-fl-accent">FL Studio 25 Web Clone</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-fl-accent hover:bg-orange-600 px-4 py-2 rounded transition"
            >
              {isPlaying ? 'Stop' : 'Play'}
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition">
              Record
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label>BPM:</label>
            <input 
              type="number" 
              value={bpm} 
              onChange={(e) => setBpm(e.target.value)}
              className="bg-gray-700 px-2 py-1 rounded w-20"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Panel - Channel Rack */}
        <div className="bg-fl-panel border-r border-gray-800 w-64 p-4">
          <h2 className="text-lg font-bold mb-4 text-fl-blue">Channel Rack</h2>
          <div className="space-y-2">
            <div className="bg-fl-dark p-2 rounded">Channel 1</div>
            <div className="bg-fl-dark p-2 rounded">Channel 2</div>
            <div className="bg-fl-dark p-2 rounded">Channel 3</div>
          </div>
        </div>

        {/* Center - Piano Roll */}
        <div className="flex-1 bg-fl-dark p-4">
          <h2 className="text-lg font-bold mb-4 text-fl-green">Piano Roll</h2>
          <div className="bg-gray-900 h-96 rounded border border-gray-700">
            {/* Piano Roll Grid */}
          </div>
        </div>

        {/* Right Panel - Mixer */}
        <div className="bg-fl-panel border-l border-gray-800 w-80 p-4">
          <h2 className="text-lg font-bold mb-4 text-fl-accent">Mixer</h2>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 bg-fl-dark p-2 rounded">
                <div className="text-xs mb-2">Track {i}</div>
                <input 
                  type="range" 
                  orient="vertical" 
                  className="h-32"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-fl-panel border-t border-gray-800 p-2 text-sm text-gray-400">
        Ready | Phase 1: Core UI Implementation
      </div>
    </div>
  )
}

export default App
