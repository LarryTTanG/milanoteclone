import React, { useEffect, useRef } from 'react'
import { useDrop } from 'react-dnd'
import { Note } from './Note'
import { Image } from './Image'
import { Link } from './Link'
import { Todo } from './Todo'
import { File } from './File'
import { useBoardContext } from './BoardContext'
import { ZoomIn, ZoomOut } from 'lucide-react'

const ItemTypes = {
  NOTE: 'note',
  IMAGE: 'image',
  LINK: 'link',
  TODO: 'todo',
  FILE: 'file'
}

export const Board = () => {
  const { items, addItem, zoom, setZoom, pan, setPan, searchTerm, updateBoard } = useBoardContext()
  const boardRef = useRef(null)

  const [, drop] = useDrop(() => ({
    accept: [ItemTypes.NOTE, ItemTypes.IMAGE, ItemTypes.LINK, ItemTypes.TODO, ItemTypes.FILE],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      const boardRect = boardRef.current.getBoundingClientRect()
      const x = (offset.x - boardRect.left - pan.x) / zoom
      const y = (offset.y - boardRect.top - pan.y) / zoom
      const newItem = {
        id: Date.now(),
        type: item.type,
        x,
        y,
        width: 200,
        height: 100
      }
      addItem(newItem)
    },
  }))

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault()
        setZoom(prevZoom => Math.max(0.1, Math.min(2, prevZoom - e.deltaY * 0.01)))
      } else {
        setPan(prevPan => ({
          x: prevPan.x - e.deltaX,
          y: prevPan.y - e.deltaY
        }))
      }
    }
    boardRef.current.addEventListener('wheel', handleWheel, { passive: false })
    return () => boardRef.current.remove

EventListener('wheel', handleWheel)
  }, [setZoom, setPan])

  useEffect(() => {
    updateBoard()
  }, [items])

  const filteredItems = items.filter(item => 
    item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative w-full h-full overflow-hidden" ref={boardRef}>
      <div ref={drop} className="absolute w-full h-full" style={{
        transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
        transformOrigin: '0 0'
      }}>
        {filteredItems.map((item) => {
          switch (item.type) {
            case ItemTypes.NOTE:
              return <Note key={item.id} {...item} />
            case ItemTypes.IMAGE:
              return <Image key={item.id} {...item} />
            case ItemTypes.LINK:
              return <Link key={item.id} {...item} />
            case ItemTypes.TODO:
              return <Todo key={item.id} {...item} />
            case ItemTypes.FILE:
              return <File key={item.id} {...item} />
            default:
              return null
          }
        })}
      </div>
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="bg-white p-2 rounded shadow">
          <ZoomIn size={20} />
        </button>
        <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className="bg-white p-2 rounded shadow">
          <ZoomOut size={20} />
        </button>
      </div>
    </div>
  )
}