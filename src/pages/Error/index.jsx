import { Link } from 'react-router-dom'
import '../../App.css'

function Error() {
  return (
    <div className="Errorpage">
      <h1 className="Error">La page que vous demandez n'existe pas.</h1>
      <Link to="/login">Retour à la page de connexion</Link>
    </div>
  )
}

export default Error
