import React from 'react'
import { Sidebar } from './Sidebar'
import { Board } from './Board'
import { Header } from './Header'

export default function Layout() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Board />
        </main>
      </div>
    </div>
  )
}