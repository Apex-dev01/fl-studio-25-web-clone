import { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone'

const NOTES = ['C5', 'B4', 'A#4', 'A4', 'G#4', 'G4', 'F#4', 'F4', 'E4', 'D#4', 'D4', 'C#4', 'C4', 'B3', 'A#3', 'A3']
const GRID_COLS = 64

function PianoRoll({ selectedChannel }) {
  const [tool, setTool] = useState('pencil') // pencil, select, quantize
  const [notes, setNotes] = useState([])
  const [quantize, setQuantize] = useState(4)
  const [zoom, setZoom] = useState(1)
  const gridRef = useRef(null)

  const addNote = (note, start, duration = 1, velocity = 0.8) => {
    setNotes([...notes, {
      id: Date.now(),
      note,
      start,
      duration,
      velocity
    }])
  }

  const removeNote = (id) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  const updateNote = (id, updates) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n))
  }

  const handleGridClick = (noteIndex, colIndex) => {
    if (tool === 'pencil') {
      const note = NOTES[noteIndex]
      const existing = notes.find(n => n.note === note && n.start === colIndex)
      if (existing) {
        removeNote(existing.id)
      } else {
        addNote(note, colIndex)
      }
    }
  }

  const applyQuantize = () => {
    setNotes(notes.map(n => ({
      ...n,
      start: Math.round(n.start / quantize) * quantize,
      duration: Math.round(n.duration / quantize) * quantize || 1
    })))
  }

  return (
    <div className="flex-1 bg-fl-dark p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-fl-green">Piano Roll</h2>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-gray-800 rounded p-1">
            <button
              onClick={() => setTool('pencil')}
              className={`px-3 py-1 rounded text-sm transition ${
                tool === 'pencil' ? 'bg-fl-accent text-white' : 'hover:bg-gray-700'
              }`}
            >
              ✏️ Pencil
            </button>
            <button
              onClick={() => setTool('select')}
              className={`px-3 py-1 rounded text-sm transition ${
                tool === 'select' ? 'bg-fl-accent text-white' : 'hover:bg-gray-700'
              }`}
            >
              ✧ Select
            </button>
          </div>
          <select
            value={quantize}
            onChange={(e) => setQuantize(Number(e.target.value))}
            className="bg-gray-700 px-2 py-1 rounded text-sm"
          >
            <option value={1}>1/1</option>
            <option value={2}>1/2</option>
            <option value={4}>1/4</option>
            <option value={8}>1/8</option>
            <option value={16}>1/16</option>
          </select>
          <button
            onClick={applyQuantize}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition"
          >
            Quantize
          </button>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-24"
            title="Zoom"
          />
        </div>
      </div>

      <div className="flex-1 bg-gray-900 rounded border border-gray-700 overflow-auto" ref={gridRef}>
        <div className="flex">
          {/* Piano Keys */}
          <div className="flex flex-col bg-gray-800">
            {NOTES.map((note, i) => (
              <div
                key={note}
                className={`w-16 h-8 border-b border-gray-700 flex items-center justify-center text-xs ${
                  note.includes('#') ? 'bg-gray-700' : 'bg-gray-800'
                }`}
              >
                {note}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 relative" style={{ width: `${GRID_COLS * 32 * zoom}px` }}>
            {NOTES.map((note, noteIndex) => (
              <div key={note} className="flex border-b border-gray-800">
                {Array.from({ length: GRID_COLS }).map((_, colIndex) => (
                  <div
                    key={colIndex}
                    onClick={() => handleGridClick(noteIndex, colIndex)}
                    className={`h-8 border-r border-gray-800 cursor-crosshair hover:bg-gray-700 ${
                      colIndex % 4 === 0 ? 'border-gray-600' : ''
                    }`}
                    style={{ width: `${32 * zoom}px` }}
                  />
                ))}
              </div>
            ))}

            {/* Notes */}
            {notes.map((note) => {
              const noteIndex = NOTES.indexOf(note.note)
              if (noteIndex === -1) return null
              return (
                <div
                  key={note.id}
                  className="absolute bg-fl-accent rounded cursor-move hover:bg-orange-600 border border-orange-700"
                  style={{
                    left: `${note.start * 32 * zoom}px`,
                    top: `${noteIndex * 32}px`,
                    width: `${note.duration * 32 * zoom}px`,
                    height: '30px',
                    opacity: note.velocity
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (tool === 'select') {
                      // Handle selection
                    }
                  }}
                >
                  <div className="text-xs px-1 py-1 truncate">{note.note}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-400">
        Tool: {tool.charAt(0).toUpperCase() + tool.slice(1)} | Notes: {notes.length} | Quantize: 1/{quantize}
      </div>
    </div>
  )
}

export default PianoRoll
