import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/style.css'

function Header() {
  const [, setUpdate] = useState()
  const update = useCallback(() => {
    sessionStorage.clear()
    setUpdate({})
  }, [])

  function scrollToHead() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  return (
    <header
      className="navMenu"
      style={
        window.location.pathname === '/'
          ? { display: 'none' }
          : { display: 'block' }
      }
    >
      <div className="navMenu__icons">
        <Link
          to="/modifyProfile"
          className="navMenu__icons__link"
          title="Profil"
        >
          <i className="fa-solid fa-address-card"></i>
        </Link>
        <Link
          to="/home"
          className="navMenu__icons__link"
          title="Accueil"
          onClick={scrollToHead}
        >
          <i className="fa-solid fa-house"></i>
        </Link>
        <Link
          to="/"
          className="navMenu__icons__link"
          title="Déconnexion"
          onClick={update}
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </Link>
      </div>
    </header>
  )
}

export default Header
