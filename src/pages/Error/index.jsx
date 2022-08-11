import { Link } from 'react-router-dom'
import '../../styles/style.css'

function Error() {
  return (
    <div className="page">
      <h1 className="error">La page que vous demandez n'existe pas.</h1>
      <Link to="/">Retour à la page de connexion</Link>
    </div>
  )
}

export default Error
