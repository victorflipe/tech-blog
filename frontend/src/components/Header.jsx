import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../UserContext'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, userLogout } = React.useContext(UserContext)
  const isAuthPage = location.pathname.startsWith('/login')

  function onHandleLogout() {
    userLogout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 h-[72px] bg-white border-b border-[#E6E6E6] font-inter">
      <nav className="max-w-[1192px] mx-auto h-full px-5 lg:px-8 flex justify-between items-center">
        <Link to="/articles" className="font-newsreader italic text-[28px] text-[#242424] tracking-tight">
          TechBlog
        </Link>

        {isAuthPage ? (
          <Link to="/" className="text-sm text-[#6B6B6B] hover:text-[#242424]">
            Voltar para o início
          </Link>
        ) : !login ? (
          <div className="flex items-center gap-5">
            <Link to="/login" className="text-sm font-medium text-[#242424]">
              Entrar
            </Link>
            <Link to="/login" className="button-accent">
              Começar a escrever
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/articles/new" className="text-sm font-medium text-[#1A8917]">
              Escrever
            </Link>
            <button
              type="button"
              onClick={onHandleLogout}
              className="text-sm text-[#6B6B6B] hover:text-[#242424] cursor-pointer"
            >
              Sair
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
