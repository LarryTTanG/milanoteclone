import React from 'react'
import { useDrag } from 'react-dnd'
import { FileTextIcon, ImageIcon, LinkIcon, CheckSquareIcon, FileIcon } from 'lucide-react'
import { useBoardContext } from './BoardContext'

const ItemTypes = {
  NOTE: 'note',
  IMAGE: 'image',
  LINK: 'link',
  TODO: 'todo',
  FILE: 'file'
}

const DraggableItem = ({ type, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div ref={drag} className={`p-2 mb-2 bg-white rounded shadow cursor-move ${isDragging ? 'opacity-50' : ''}`}>
      {children}
    </div>
  )
}

export const Sidebar = () => {
  const { tags, addTag } = useBoardContext()
  const [newTag, setNewTag] = React.useState('')

  const handleAddTag = () => {
    if (newTag) {
      addTag(newTag)
      setNewTag('')
    }
  }

  return (
    <div className="w-64 bg-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Add New</h2>
      <DraggableItem type={ItemTypes.NOTE}>
        <FileTextIcon className="inline mr-2" />
        Note
      </DraggableItem>
      <DraggableItem type={ItemTypes.IMAGE}>
        <ImageIcon className="inline mr-2" />
        Image
      </DraggableItem>
      <DraggableItem type={ItemTypes.LINK}>
        <LinkIcon className="inline mr-2" />
        Link
      </DraggableItem>
      <DraggableItem type={ItemTypes.TODO}>
        <CheckSquareIcon className="inline mr-2" />
        Todo
      </DraggableItem>
      <DraggableItem type={ItemTypes.FILE}>
        <FileIcon className="inline mr-2" />
        File
      </DraggableItem>
      <h2 className="text-lg font-semibold mt-6 mb-4">Tags</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map(tag => (
          <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{tag}</span>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New tag"
          className="flex-1 border rounded-l p-2"
        />
        <button onClick={handleAddTag} className="bg-blue-500 text-white p-2 rounded-r">Add</button>
      </div>
    </div>
  )
}