import logo from '../../assets/icon-left-font.png'
import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/style.css'

function Header() {
  const [, setUpdate] = useState()
  const update = useCallback(() => setUpdate({}), [])

  return (
    <div>
      <header className="header">
        <img className="header__logo" src={logo} alt="logo groupomania" />
        <div
          className={
            window.location.pathname === '/'
              ? 'header__navBlock--off'
              : 'header__navBlock'
          }
        >
          <div className="header__links">
            <Link to="/home" className="header__links__icon" onClick={update}>
              <i className="fa-solid fa-house"></i>
              <p>Accueil</p>
            </Link>
            <Link to="/" className="header__links__icon" onClick={update}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <p>Déconnexion</p>
            </Link>
          </div>
        </div>
        <h1>Réseau social interne</h1>
      </header>
    </div>
  )
}

export default Header
