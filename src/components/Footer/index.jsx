import logo from '../../assets/icon-black.png'
import '../../styles/style.css'

function Footer() {
  return (
    <div>
      <footer className="footer">
        <img
          className="footer__logo"
          src={logo}
          alt="logo groupomania monochrome noir"
        />
        <a href="mailto:admin@groupomania.fr" className="mailto">
          <i className="fa-solid fa-envelope"></i>Contacter l'administrateur
        </a>
      </footer>
    </div>
  )
}

export default Footer
