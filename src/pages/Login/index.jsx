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

    const mailMask = /^[a-zA-Z0-9+_.-]+@groupomania.fr$/
    const pwdMask =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/

    if (mailMask.test(mail)) {
      document.getElementById('mailError').textContent = ''
      if (pwdMask.test(pass)) {
        document.getElementById('pwdError').textContent = ''
        const inputs = {
          mail: mail,
          password: pass,
          name: name.toUpperCase(),
          firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
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
        const post = await fetch(
          'http://localhost:3000/api/auth/signup',
          postOrder
        )
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
      } else {
        document.getElementById('pwdError').textContent =
          'Invalide: (8 à 15 caractères (1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial'
      }
    } else {
      document.getElementById('mailError').textContent =
        'Invalide: adresse interne @groupomania.fr uniquement acceptée'
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

    const pwdErrorMsg = document.getElementById('pwdErrorMessage')
    const mailErrorMsg = document.getElementById('mailErrorMessage')
    if (post.code === '403') {
      mailErrorMsg.textContent = 'Adresse mail invalide'
      mailErrorMsg.style.color = 'red'
    } else {
      mailErrorMsg.textContent = ' '
      if (post.code === '401') {
        pwdErrorMsg.textContent = 'Mot de passe invalide'
        pwdErrorMsg.style.color = 'red'
      } else {
        pwdErrorMsg.textContent = ' '
        sessionStorage.setItem('token', post.token)
        sessionStorage.setItem('userId', post.userId)
        document.location.assign('/home')
      }
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
                <span id="mailErrorMessage">
                  <br />{' '}
                </span>
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
                <span id="pwdErrorMessage">
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
                <label htmlFor="mail-signup">Adresse mail</label>
                <input
                  type="email"
                  id="mail-signup"
                  name="user_mail"
                  required
                />
                <span id="mailError"></span>
              </div>
              <div className="textarea">
                <label htmlFor="pwd-signup">Mot de passe</label>
                <input
                  type="password"
                  id="pwd-signup"
                  name="user_pwd"
                  minLength={8}
                  maxLength={15}
                  required
                />
                <span id="pwdError"></span>
              </div>
              <div className="textarea">
                <label htmlFor="name">Nom</label>
                <input type="text" id="name" name="user_name" required />
              </div>
              <div className="textarea">
                <label htmlFor="firstName">Prénom</label>
                <input
                  type="text"
                  id="firstName"
                  name="user_firstName"
                  required
                />
              </div>
              <div className="sectorSelect">
                <select
                  name="user_sector"
                  id="sector"
                  className="sectorSelect__list"
                  required
                >
                  <option value="">
                    --Choisissez votre secteur de travail--
                  </option>
                  <option value="direction">Direction</option>
                  <option value="informatique">Informatique</option>
                  <option value="comptabilité">Comptabilité</option>
                  <option value="commercial">Commercial</option>
                  <option value="marketing">Marketing</option>
                  <option value="logistique">Logistique</option>
                  <option value="rh">Ressources humaines</option>
                </select>
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
