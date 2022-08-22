import { Link } from 'react-router-dom'
import logo from '../../assets/401-error-wordpress-featured-image.jpg'
import '../../styles/style.css'

function Unauthorized() {
  return (
    <div className="errorPage">
      <img src={logo} alt="erreur 401" />
      <h1 className="error">
        Vous n'êtes pas autorisé à accéder au contenu demandé.
      </h1>
      <Link to="/" className="errorPage__link">
        Retour à la page de connexion
      </Link>
    </div>
  )
}

export default Unauthorized
