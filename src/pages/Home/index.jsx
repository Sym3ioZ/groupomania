import '../../App.css'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="Home">
      <h1 className="Maintitle">Bienvenue</h1>
      <Link className="Link" to="/login">
        Page de connexion
      </Link>
    </div>
  )
}

export default Home
