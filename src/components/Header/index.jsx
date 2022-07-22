import logo from '../../assets/icon-left-font.png'
import '../../styles/style.css'

function Header() {
  return (
    <div>
      <header className="header">
        <img className="header__logo" src={logo} alt="logo groupomania" />
      </header>
    </div>
  )
}

export default Header
