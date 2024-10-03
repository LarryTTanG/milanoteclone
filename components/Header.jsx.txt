import React, { useState } from 'react'
import { useBoardContext } from './BoardContext'
import { Search, Plus } from 'lucide-react'

export const Header = () => {
  const { boards, currentBoard, setCurrentBoard, addBoard, searchTerm, setSearchTerm } = useBoardContext()
  const [newBoardName, setNewBoardName] = useState('')

  const handleAddBoard = () => {
    if (newBoardName) {
      addBoard(newBoardName)
      setNewBoardName('')
    }
  }

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <select
          value={currentBoard?._id}
          onChange={(e) => setCurrentBoard(boards.find(board => board._id === e.target.value))}
          className="border rounded p-2"
        >
          {boards.map(board => (
            <option key={board._id} value={board._id}>{board.name}</option>
          ))}
        </select>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="New board name"
            className="border rounded p-2"
          />
          <button onClick={handleAddBoard} className="bg-blue-500 text-white p-2 rounded">
            <Plus size={20} />
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="border rounded p-2"
        />
        <Search size={20} />
      </div>
    </header>
  )
}