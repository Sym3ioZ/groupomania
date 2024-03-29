import logo from '../../assets/icon-left-font.webp'
import profileDefaultPic from '../../assets/default.webp'
import { useState } from 'react'
import '../../styles/style.css'

function Login() {
  const [toggleState, setToggleState] = useState(1)
  const toggleTab = (index) => {
    setToggleState(index)
  }

  // Retrieving the selected picture
  const [selectedFile, setSelectedFile] = useState()
  const profilePreview = document.getElementById('profilePreview')

  // Function to handle the profile picture change
  const picChange = (e) => {
    if (e.target.files.length > 0) {
      let src = URL.createObjectURL(e.target.files[0])
      profilePreview.src = src
      setSelectedFile(e.target.files[0])
    }
  }

  // Function to signup to the app
  async function Signup(e) {
    e.preventDefault()

    //Retrieving every form inputs values and potential error messages to display
    const mail = document.getElementById('mail-signup').value
    const pass = document.getElementById('pwd-signup').value
    const name = document.getElementById('name').value
    const firstName = document.getElementById('firstName').value
    const sector = document.getElementById('sector').value
    const mailError = document.getElementById('mailError')
    const pwdError = document.getElementById('pwdError')
    const nameError = document.getElementById('nameError')
    const firstNameError = document.getElementById('firstNameError')
    const picError = document.getElementById('picError')

    //Setting up regex masks to check mail and pwd
    const mailMask = /^[a-zA-Z0-9+_.-]+@groupomania.fr$/
    const pwdMask =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/
    const nameMask = /[0-9a-zA-Z]{3,}/

    //Checking the presence of a profile picture uploaded by user
    if (selectedFile) {
      picError.textContent = ' '
      const formData = new FormData()
      formData.append('image', selectedFile)

      // Checking the mail and password
      if (mailMask.test(mail)) {
        mailError.textContent = ''
        if (pwdMask.test(pass)) {
          pwdError.textContent = ''
          if (nameMask.test(name) && nameMask.test(firstName)) {
            nameError.textContent = ''
            firstNameError.textContent = ''
            const inputs = {
              mail: mail,
              password: pass,
              name: name.toUpperCase(),
              firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
              sector: sector,
            }

            formData.append('mail', inputs.mail)
            formData.append('password', inputs.password)
            formData.append('name', inputs.name)
            formData.append('firstName', inputs.firstName)
            formData.append('sector', inputs.sector)

            const postOrder = {
              method: 'POST',
              body: formData,
            }
            const post = await fetch(
              `http://localhost:${process.env.REACT_APP_PORT_API}/api/auth/signup`,
              postOrder
            )
              .then((res) => res.json())
              .catch((error) => console.log(error))

            // Displaying error message for already used mail
            const errors = document.getElementById('errors')
            if (post.code === '401') {
              errors.textContent = 'Erreur: adresse mail déjà enregistrée'
              errors.style.color = 'red'
            }
            //Logging in newly created user
            else {
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
                `http://localhost:${process.env.REACT_APP_PORT_API}/api/auth/login`,
                loginOrder
              )
                .then((res) => res.json())
                .catch((error) => console.log(error))
              sessionStorage.setItem('token', login.token)
              sessionStorage.setItem('userId', login.userId)
              document.location.assign('/home')
            }
          } else {
            // Displaying error message if name or first name is not at least 3 characters
            nameError.textContent = '3 caractères minimum'
            firstNameError.textContent = '3 caractères minimum'
            nameError.style.color = 'red'
            firstNameError.style.color = 'red'
          }
        } else {
          // Displaying error message for wrong password format
          pwdError.textContent =
            'invalide: 8 à 15 caractères (majuscule, minuscule, chiffre, caractère spécial)'
          pwdError.style.color = 'red'
        }
      } else {
        // Displaying error message for wrong mail format
        mailError.textContent = ' invalide: @groupomania.fr uniquement'
        mailError.style.color = 'red'
      }
    } else {
      // Displaying error message for missing picture
      picError.textContent = 'Photo obligatoire'
      picError.style.color = 'red'
    }
  }

  // Function to log the user to the app
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
    const post = await fetch(
      `http://localhost:${process.env.REACT_APP_PORT_API}/api/auth/login`,
      postOrder
    )
      .then((res) => res.json())
      .catch((error) => console.log(error))

    const pwdErrorMsg = document.getElementById('pwdErrorMessage')
    const mailErrorMsg = document.getElementById('mailErrorMessage')
    if (post.code === '403') {
      // Error message if invalid mail
      mailErrorMsg.textContent = ' invalide'
      mailErrorMsg.style.color = 'red'
    } else {
      mailErrorMsg.textContent = ''
      if (post.code === '401') {
        // Error message if invalid password
        pwdErrorMsg.textContent = ' invalide'
        pwdErrorMsg.style.color = 'red'
      } else {
        // If all is OK, setting the token and userId in the session storage, then go to home
        pwdErrorMsg.textContent = ''
        sessionStorage.setItem('token', post.token)
        sessionStorage.setItem('userId', post.userId)
        document.location.assign('/home')
      }
    }
  }

  return (
    <div className="body">
      <h1 className="maintitle">
        Bienvenue sur le réseau social interne de l'entreprise <br />
        <img src={logo} alt="groupomania logo" className="loginLogo" />
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
                <label htmlFor="mail">
                  Adresse mail <span id="mailErrorMessage"></span>
                </label>
                <input type="email" id="mail-login" name="user_mail" />
              </div>
              <div className="textarea" id="pwdInput">
                <label htmlFor="pwd">
                  Mot de passe<span id="pwdErrorMessage"></span>
                </label>
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
            <div className="signup-inputs">
              <div className="firstProfilePic">
                <p>Ajouter une photo de profil</p>
                <div className="firstProfilePic__button">
                  <label
                    htmlFor="image"
                    className="firstProfilePic__button__label"
                  >
                    <img
                      src={profileDefaultPic}
                      id="profilePreview"
                      alt="profile preview"
                    />
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    className="image"
                    accept=".jpg, .jpeg, .png, .gif, .webp"
                    required
                    onChange={picChange}
                  />
                </div>
                <div>
                  <span id="picError">
                    <br />{' '}
                  </span>
                </div>
              </div>
              <div className="form-inputs">
                <span id="errors">
                  <br />{' '}
                </span>
                <div className="textarea">
                  <label htmlFor="mail-signup">
                    Adresse mail <span id="mailError"></span>
                  </label>
                  <input
                    type="email"
                    id="mail-signup"
                    name="user_mail"
                    required
                  />
                </div>
                <div className="textarea">
                  <label htmlFor="pwd-signup">
                    Mot de passe <span id="pwdError"></span>
                  </label>
                  <input
                    type="password"
                    id="pwd-signup"
                    name="user_pwd"
                    minLength={8}
                    maxLength={15}
                    required
                  />
                </div>
                <div className="textarea">
                  <label htmlFor="name">
                    Nom <span id="nameError"></span>
                  </label>
                  <input type="text" id="name" name="user_name" required />
                </div>
                <div className="textarea">
                  <label htmlFor="firstName">
                    Prénom <span id="firstNameError"></span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="user_firstName"
                    required
                  />
                </div>
                <label htmlFor="sector">Secteur</label>
                <div className="sectorSelect">
                  <select
                    name="user_sector"
                    id="sector"
                    className="sectorSelect__list"
                    required
                  >
                    <option defaultValue="Direction">Direction</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Comptabilité">Comptabilité</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Logistique">Logistique</option>
                    <option value="Ressources Humaines">
                      Ressources humaines
                    </option>
                  </select>
                </div>
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
