import { Navigate, Route, Routes } from 'react-router-dom'
import { ChatView } from './components/ChatView/ChatView'
import { Home } from './pages/Home/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path=":id" element={<ChatView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
