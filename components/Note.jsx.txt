import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { Resizable } from 're-resizable'
import { useBoardContext } from './BoardContext'

export const Note = ({ id, x, y, width, height, content: initialContent }) => {
  const { updateItem, deleteItem } = useBoardContext()
  const [content, setContent] = useState(initialContent || '')

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'note',
    item: { id, x, y },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const handleResizeStop = (e, direction, ref, d) => {
    updateItem({ id, width: width + d.width, height: height + d.height })
  }

  const handleDragStop = (e, data) => {
    updateItem({ id, x: data.x, y: data.y })
  }

  return (
    <Resizable
      size={{ width, height }}
      onResizeStop={handleResizeStop}
      draggable
      onDragStop={handleDragStop}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div ref={drag} className="w-full h-full p-2 bg-yellow-200 rounded shadow">
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            updateItem({ id, content: e.target.value })
          }}
          className="w-full h-full bg-transparent resize-none outline-none"
          placeholder="Enter your note here..."
        />
        <button onClick={() => deleteItem(id)} className="absolute top-1 right-1 text-red-500">×</button>
      </div>
    </Resizable>
  )
}