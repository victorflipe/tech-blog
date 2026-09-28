import Header from './components/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login/Login'
import Article from './components/Article/Article'
import './App.css'
import { UserStorage } from './UserContext'
import NotFound from './components/NotFound'

function App() {

  return (
    <div className='App h-full'>
      <BrowserRouter>
        <UserStorage>
          <Header />
          <main className='min-h-[calc(100dvh-72px)] font-inter text-[#242424]'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login/*" element={<Login />} />
              <Route path="/articles/*" element={<Article />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </UserStorage>
      </BrowserRouter>
    </div>
  )
}

export default App
