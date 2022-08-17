import logo from '../../assets/lone-logo-white.png'
import '../../styles/style.css'

function Footer() {
  return (
    <footer>
      <div className="footer-logo">
        <img
          className="footer-logo__img"
          src={logo}
          alt="logo groupomania monochrome blanc"
        />
      </div>
      <p>© BT Développement WEB. 2022</p>
      <div className="mailto">
        <a href="mailto:admin@groupomania.fr">
          <i className="fa-solid fa-envelope"></i>Contacter l'administrateur
        </a>
      </div>
    </footer>
  )
}

export default Footer
