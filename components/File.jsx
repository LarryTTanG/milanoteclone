import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { Resizable } from 're-resizable'
import { useBoardContext } from './BoardContext'

export const File = ({ id, x, y, width, height, content: initialContent }) => {
  const { updateItem, deleteItem } = useBoardContext()
  const [file, setFile] = useState(initialContent ? JSON.parse(initialContent) : null)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'file',
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const fileData = {
          name: selectedFile.name,
          type: selectedFile.type,
          data: event.target.result
        }
        setFile(fileData)
        updateItem({ id, content: JSON.stringify(fileData) })
      }
      reader.readAsDataURL(selectedFile)
    }
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
      <div ref={drag} className="w-full h-full p-2 bg-purple-100 rounded shadow">
        {file ? (
          <div>
            <p>{file.name}</p>
            {file.type.startsWith('image/') && (
              <img src={file.data} alt={file.name} className="max-w-full max-h-full object-contain" />
            )}
          </div>
        ) : (
          <input type="file" onChange={handleFileChange} />
        )}
        <button onClick={() => deleteItem(id)} className="absolute top-1 right-1 text-red-500">×</button>
      </div>
    </Resizable>
  )
}