import '../styles/globals.css'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { BoardProvider } from '../components/BoardContext'

function MyApp({ Component, pageProps }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <BoardProvider>
        <Component {...pageProps} />
      </BoardProvider>
    </DndProvider>
  )
}

export default MyApp