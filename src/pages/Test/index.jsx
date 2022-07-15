import '../../App.css'
import { Link, useParams } from 'react-router-dom'

function Test() {
  const { message } = useParams()
  return (
    <div className="Test">
      <h1 className="Maintitle">Page de test POST</h1>
      <p>{message}</p>
      <Link className="Link" to="/login">
        Page de connexion
      </Link>
    </div>
  )
}

export default Test
