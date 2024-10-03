import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { Resizable } from 're-resizable'
import { useBoardContext } from './BoardContext'

export const Link = ({ id, x, y, width, height, content: initialContent }) => {
  const { updateItem, deleteItem } = useBoardContext()
  const [url, setUrl] = useState(initialContent || '')

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'link',
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
      <div ref={drag} className="w-full h-full p-2 bg-blue-100 rounded shadow">
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            updateItem({ id, content: e.target.value })
          }}
          className="w-full p-1 border rounded"
          placeholder="Enter URL here..."
        />
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {url}
          </a>
        )}
        <button onClick={() => deleteItem(id)} className="absolute top-1 right-1 text-red-500">×</button>
      </div>
    </Resizable>
  )
}