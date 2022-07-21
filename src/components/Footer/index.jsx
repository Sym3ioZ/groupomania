import logo from '../../assets/icon-black.png'
import '../../styles/style.css'

function Footer() {
  return (
    <div>
      <footer className="Footer">
        <img
          className="Footer-logo"
          src={logo}
          alt="logo groupomania monochrome noir"
        />
        <a href="mailto:admin@groupomania.fr" className="Mailto">
          Contacter l'administrateur
        </a>
      </footer>
    </div>
  )
}

export default Footer
