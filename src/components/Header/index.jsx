import logo from '../../assets/icon-left-font.png'
import { Link } from 'react-router-dom'
import '../../App.css'

function Header() {
  return (
    <div>
      <header className="Header">
        <Link to="/">
          <img className="Header-logo" src={logo} alt="logo groupomania" />
        </Link>
      </header>
    </div>
  )
}

export default Header
