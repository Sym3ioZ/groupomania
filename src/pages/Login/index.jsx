import { useState } from 'react'
import '../../styles/style.css'

function Login() {
  const [toggleState, setToggleState] = useState(1)
  const toggleTab = (index) => {
    setToggleState(index)
  }

  async function Signup(e) {
    e.preventDefault()
    const email = await document.getElementById('mail').value
    const pass = await document.getElementById('pwd').value
    console.log(email)
    console.log(pass)
    const inputs = {
      mail: email,
      password: pass,
    }
    console.log(inputs)
    const postOrder = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(inputs),
    }
    console.log(postOrder)
    const post = await fetch('http://localhost:3000/api/signup', postOrder)
      .then((res) => res.json())
      .catch((error) => console.log(error))

    console.log(post)
    document.location.assign('/home')
  }

  async function Signin(e) {
    e.preventDefault()
    const email = await document.getElementById('mail').value
    const pass = await document.getElementById('pwd').value
    console.log(email)
    console.log(pass)
    const inputs = {
      mail: email,
      password: pass,
    }
    console.log(inputs)
    const postOrder = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(inputs),
    }
    console.log(postOrder)
    const post = await fetch('http://localhost:3000/api/signup', postOrder)
      .then((res) => res.json())
      .catch((error) => console.log(error))

    console.log(post)
    document.location.assign('/home')
  }

  return (
    <div className="body">
      <h1 className="maintitle">
        Bienvenue sur le réseau social interne de l'entreprise GROUPOMANIA
      </h1>
      <div className="login">
        <div className="tabs-block">
          <div
            className={toggleState === 1 ? 'tabs active-tabs' : 'tabs'}
            onClick={() => toggleTab(1)}
          >
            CONNEXION
          </div>
          <div
            className={toggleState === 2 ? 'tabs active-tabs' : 'tabs'}
            onClick={() => toggleTab(2)}
          >
            INSCRIPTION
          </div>
        </div>

        <div className="forms-block">
          <form
            className={
              toggleState === 1
                ? 'connection-form active-form'
                : 'connection-form'
            }
          >
            <div className="form-inputs">
              <div className="textarea">
                <label htmlFor="mail">Adresse mail</label>
                <input type="email" id="mail-login" name="user_mail" />
              </div>
              <div className="textarea">
                <label htmlFor="pwd">Mot de passe</label>
                <input
                  type="password"
                  id="pwd-login"
                  name="user_pwd"
                  minLength={8}
                  required
                />
              </div>
            </div>
            <div className="buttons">
              <input
                type="submit"
                className="button"
                value="SE CONNECTER"
                id="signin"
                onClick={Signin}
              />
            </div>
          </form>

          <form
            className={
              toggleState === 2
                ? 'connection-form active-form'
                : 'connection-form'
            }
          >
            <div className="form-inputs">
              <div className="textarea">
                <label htmlFor="mail">Adresse mail</label>
                <input type="email" id="mail-signup" name="user_mail" />
              </div>
              <div className="textarea">
                <label htmlFor="pwd">Mot de passe</label>
                <input
                  type="password"
                  id="pwd-signup"
                  name="user_pwd"
                  minLength={8}
                  required
                />
              </div>
              <div className="textarea">
                <label htmlFor="name">Nom</label>
                <input type="text" id="name" name="user_name" />
              </div>
              <div className="textarea">
                <label htmlFor="firstName">Prénom</label>
                <input type="text" id="firstName" name="user_firstName" />
              </div>
              <div className="textarea">
                <label htmlFor="sector">Secteur</label>
                <input type="text" id="sector" name="user_sector" />
              </div>
            </div>
            <div className="buttons">
              <input
                type="submit"
                className="button"
                value="S'INSCRIRE"
                id="signup"
                onClick={Signup}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
