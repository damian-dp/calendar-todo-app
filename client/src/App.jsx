import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/LayoutComponent'
import Home from './pages/HomePage'
import Calendar from './pages/CalendarPage'
import TodoList from './pages/TodoListPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/todo" element={<TodoList />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
