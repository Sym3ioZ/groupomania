import logo from '../../assets/icon-left-font.png'
import '../../App.css'

function Header() {
  return (
    <div>
      <header className="Header">
        <img className="Header-logo" src={logo} alt="logo groupomania" />
      </header>
    </div>
  )
}

export default Header
