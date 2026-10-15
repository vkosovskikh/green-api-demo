import { Navigate, Route, Routes } from 'react-router-dom'
import { Protected } from './auth/Protected'
import { ChatView } from './components/ChatView/ChatView'
import { Home } from './pages/Home/Home'
import { Login } from './pages/Login/Login'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Protected>
            <Home />
          </Protected>
        }
      >
        <Route path=":id" element={<ChatView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
