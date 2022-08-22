import { Link } from 'react-router-dom'
import logo from '../../assets/erreur-404-concept-illustration_114360-1811.webp'
import '../../styles/style.css'

function Error() {
  return (
    <div className="errorPage">
      <img src={logo} alt="erreur 404" />
      <h1 className="error">La page que vous demandez n'existe pas.</h1>
      <Link to="/" className="errorPage__link">
        Retour à la page de connexion
      </Link>
    </div>
  )
}

export default Error
