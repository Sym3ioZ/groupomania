import { useState } from 'react'
import '../../styles/style.css'

function Login() {
  const [toggleState, setToggleState] = useState(1)
  const toggleTab = (index) => {
    setToggleState(index)
  }

  async function Signup(e) {
    e.preventDefault()
    const mail = document.getElementById('mail-signup').value
    const pass = document.getElementById('pwd-signup').value
    const name = document.getElementById('name').value
    const firstName = document.getElementById('firstName').value
    const sector = document.getElementById('sector').value

    const inputs = {
      mail: mail,
      password: pass,
      name: name,
      firstName: firstName,
      sector: sector,
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
    const post = await fetch('http://localhost:3000/api/auth/signup', postOrder)
      .then((res) => res.json())
      .catch((error) => console.log(error))

    const errors = document.getElementById('errors')
    if (post.code === '401') {
      errors.textContent = 'Erreur: adresse mail déjà enregistrée'
    } else {
      const orderBody = {
        mail: mail,
        password: pass,
      }
      console.log(orderBody)
      const loginOrder = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(orderBody),
      }
      const login = await fetch(
        'http://localhost:3000/api/auth/login',
        loginOrder
      )
        .then((res) => res.json())
        .catch((error) => console.log(error))
      console.log(login)
      document.location.assign('/home')
    }
  }

  async function Logging(e) {
    e.preventDefault()
    const mail = document.getElementById('mail-login').value
    const pass = document.getElementById('pwd-login').value
    const inputs = {
      mail: mail,
      password: pass,
    }
    const postOrder = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(inputs),
    }
    const post = await fetch('http://localhost:3000/api/auth/login', postOrder)
      .then((res) => res.json())
      .catch((error) => console.log(error))

    console.log(post)
    const errorMsg = document.getElementById('errorMessage')
    if (post.code === '401') {
      errorMsg.textContent = 'Mot de passe invalide'
      errorMsg.style.color = 'red'
    } else {
      errorMsg.textContent = 'Mot de passe vérifié'
      errorMsg.style.color = 'green'
      document.location.assign('/home')
    }
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
              <div className="textarea" id="pwdInput">
                <label htmlFor="pwd">Mot de passe</label>
                <input
                  type="password"
                  id="pwd-login"
                  name="user_pwd"
                  minLength={8}
                  required
                />
                <span id="errorMessage">
                  <br />{' '}
                </span>
              </div>
            </div>
            <div className="buttons">
              <input
                type="submit"
                className="button"
                value="SE CONNECTER"
                id="signin"
                onClick={Logging}
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
              <span id="errors">
                <br />{' '}
              </span>
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
