import React, { createContext, useContext, useState, useEffect } from 'react'

const BoardContext = createContext(null)

export const useBoardContext = () => useContext(BoardContext)

export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState([])
  const [currentBoard, setCurrentBoard] = useState(null)
  const [items, setItems] = useState([])
  const [tags, setTags] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    const response = await fetch('/api/boards')
    const data = await response.json()
    setBoards(data)
    if (data.length > 0) {
      setCurrentBoard(data[0])
      setItems(data[0].items || [])
    }
  }

  const addBoard = async (name) => {
    const response = await fetch('/api/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, items: [] })
    })
    const newBoard = await response.json()
    setBoards([...boards, newBoard])
  }

  const updateBoard = async () => {
    if (currentBoard) {
      await fetch(`/api/boards/${currentBoard.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentBoard, items })
      })
    }
  }

  const addItem = (item) => {
    setItems([...items, item])
  }

  const updateItem = (updatedItem) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item))
  }

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const addTag = (tag) => {
    setTags([...tags, tag])
  }

  return (
    <BoardContext.Provider value={{
      boards,
      currentBoard,
      setCurrentBoard,
      items,
      addItem,
      updateItem,
      deleteItem,
      tags,
      addTag,
      searchTerm,
      setSearchTerm,
      zoom,
      setZoom,
      pan,
      setPan,
      addBoard,
      updateBoard
    }}>
      {children}
    </BoardContext.Provider>
  )
}