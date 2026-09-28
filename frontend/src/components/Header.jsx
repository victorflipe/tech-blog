import React from 'react'
import Logo from '/logo.svg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../UserContext'
import IconLogout from '../assets/logout.svg'

const Header = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const { login, userLogout } = React.useContext(UserContext)
  

  function onHandleLogout(){
    userLogout()
    navigate('/')
  }

  return (
    <header className='border-b-1 py-4 lg:p-5 border-[#E5E8EB] font-newsreader'>
      <nav className='flex justify-between lg:px-10 px-5 items-center'>
        {
        <Link to="/articles"><img className='w-[6rem]' src={Logo} alt="TechBlog" /></Link>
        }
        

        { 
        location.pathname == "/login" ? <></> :
        !login ?
          <Link to="/login" className='text-[#67A22D] font-semibold'>
            Entrar
          </Link> : 
            <img className='cursor-pointer' src={IconLogout} alt="" onClick={onHandleLogout}/>
          // <Link to="/" className='text-[#67A22D] font-semibold'>
          // </Link>
        }
      </nav>

    </header>
  )
}

export default Header