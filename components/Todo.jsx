import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { Resizable } from 're-resizable'
import { useBoardContext } from './BoardContext'

export const Todo = ({ id, x, y, width, height, content: initialContent }) => {
  const { updateItem, deleteItem } = useBoardContext()
  const [todos, setTodos] = useState(initialContent ? JSON.parse(initialContent) : [])

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'todo',
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

  const addTodo = () => {
    const newTodos = [...todos, { text: '', completed: false }]
    setTodos(newTodos)
    updateItem({ id, content: JSON.stringify(newTodos) })
  }

  const updateTodo = (index, text, completed) => {
    const newTodos = todos.map((todo, i) => 
      i === index ? { ...todo, text, completed } : todo
    )
    setTodos(newTodos)
    updateItem({ id, content: JSON.stringify(newTodos) })
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
      <div ref={drag} className="w-full h-full p-2 bg-green-100 rounded shadow overflow-y-auto">
        {todos.map((todo, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) => updateTodo(index, todo.text, e.target.checked)}
              className="mr-2"
            />
            <input
              type="text"
              value={todo.text}
              onChange={(e) => updateTodo(index, e.target.value, todo.completed)}
              className="flex-1 p-1 border rounded"
            />
          </div>
        ))}
        <button onClick={addTodo} className="w-full bg-green-500 text-white p-1 rounded mt-2">Add Todo</button>
        <button onClick={() => deleteItem(id)} className="absolute top-1 right-1 text-red-500">×</button>
      </div>
    </Resizable>
  )
}