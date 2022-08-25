import { useState, useEffect } from 'react'
import '../../styles/style.css'

function ModifyProfile() {
  //Retrieving userId and then user infos
  const [sessionUserId, setSessionUserId] = useState(
    sessionStorage.getItem('userId')
  )
  const [userProfile, setUserProfile] = useState([])
  useEffect(() => {
    setSessionUserId(sessionStorage.getItem('userId'))
    const fetchProfile = async () => {
      const fetchData = await fetch(
        `http://localhost:3000/api/auth/getProfile:${sessionUserId}`
      )
      const jsonData = await fetchData.json()
      setUserProfile(jsonData.response[0])
    }
    fetchProfile()
  }, [sessionUserId])

  const userId = userProfile.userId

  const [confirmMessage, setConfirmMessage] = useState('')

  // Retrieving the selected picture
  const [selectedFile, setSelectedFile] = useState()
  const picturePreview = document.getElementById('profileImgPreview')

  const picChange = (e) => {
    if (e.target.files.length > 0) {
      let src = URL.createObjectURL(e.target.files[0])
      picturePreview.src = src
      setSelectedFile(e.target.files[0])
    }
  }

  //Function to delete the profile and the associate posts from the DB
  async function deleteProfile(e) {
    e.preventDefault()
    if (window.confirm('Etes-vous sûr de vouloir supprimer votre compte?')) {
      const profilePic = { profilePic: userProfile.profilePic }
      await fetch(
        `http://localhost:3000/api/auth/deleteProfile:${userProfile.userId}`,
        {
          method: 'DELETE',
          body: JSON.stringify(profilePic),
          headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        }
      )
        .then((res) => res.json())
        .catch((err) => console.log(err))
      sessionStorage.clear()
      document.location.assign('/')
    }
  }

  // function to update user infos (name,mail,profilepic,...)
  async function updateProfile(e) {
    e.preventDefault()
    const oldPwd = document.getElementById('oldPwd').value
    const newPwd = document.getElementById('newPwd').value
    const userName = document.getElementById('name').value
    const userFirstName = document.getElementById('firstName').value
    const userSector = document.getElementById('sector').value
    const pwdError = document.getElementById('pwdError')

    const pwdMask =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/

    if (newPwd) {
      if (pwdMask.test(newPwd)) {
        pwdError.textContent = ''
        // Declaring formdata to send via fetch
        const formData = new FormData()
        formData.append('image', selectedFile)
        formData.append('userId', userId)
        formData.append('newPwd', newPwd)
        formData.append('oldPwd', oldPwd)
        formData.append('userName', userName)
        formData.append('userFirstName', userFirstName)
        formData.append('userSector', userSector)

        let postOrder = {}
        const inputs = {
          userId: userId,
          newPwd: newPwd,
          oldPwd: oldPwd,
          userName: userName,
          userFirstName: userFirstName,
          userSector: userSector,
        }
        if (selectedFile) {
          postOrder = {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
            body: formData,
          }
        } else {
          postOrder = {
            method: 'PUT',
            headers: {
              'content-type': 'application/json',
              Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
            body: JSON.stringify(inputs),
          }
        }

        const postRes = await fetch(
          'http://localhost:3000/api/auth/updateProfile',
          postOrder
        )
          .then((res) => res.json())
          .catch((err) => console.log(err))

        // Checking the return message to validate/unvalidate password change, and then profile update
        if (postRes.message === 'Invalid password') {
          pwdError.textContent = 'Ancien mot de passe invalide'
        } else {
          if (postRes.message === 'User modified') {
            setConfirmMessage('Mise à jour effectuée avec succès!')
            window.setTimeout(() => {
              window.location.reload()
            }, '1000')
          } else {
            alert('Erreur serveur interne: veuillez réessayer ou patienter.')
            window.location.reload()
          }
        }
      } else {
        pwdError.textContent =
          'Erreur: 8-15 caractères (Majuscule, minuscule, chiffre, caractère spécial)'
      }
    } else {
      // Declaring formdata to send via fetch without passwords
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('userId', userId)
      formData.append('userName', userName)
      formData.append('userFirstName', userFirstName)
      formData.append('userSector', userSector)

      let postOrder = {}
      const inputs = {
        userId: userId,
        userName: userName,
        userFirstName: userFirstName,
        userSector: userSector,
      }
      if (selectedFile) {
        postOrder = {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
          body: formData,
        }
      } else {
        postOrder = {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
          body: JSON.stringify(inputs),
        }
      }

      await fetch('http://localhost:3000/api/auth/updateProfile', postOrder)
        .then((res) => res.json())
        .catch((err) => console.log(err))

      setConfirmMessage('Mise à jour effectuée avec succès!')
      window.setTimeout(() => {
        window.location.reload()
      }, '1000')
    }
  }

  return (
    <div className="profilePage">
      <div className="confirmMessage" id="confirmMessage">
        {confirmMessage}
      </div>
      <form className="profilePage__form">
        <div className="profilePage__form__picBlock">
          <div className="profilePage__form__picBlock__sector">
            Secteur:
            <br />
            {userProfile.sector}
          </div>
          <div className="profilePage__form__picBlock__names">
            {userProfile.firstName}
            <br />
            {userProfile.name}
          </div>
          <div className="profilePage__form__picBlock__icons">
            <label
              htmlFor="image"
              className="profilePage__form__picBlock__icons__imageLabel"
            >
              <img
                src={userProfile.profilePic}
                alt="profile avatar"
                className="profilePage__form__picBlock__icons__imageLabel__image"
                id="profileImgPreview"
                title="Modifier la photo de profil"
              />
            </label>
            <input
              type="file"
              name="image"
              id="image"
              className="image"
              accept=".jpg, .jpeg, .png, .gif, .webp"
              onChange={picChange}
            />
          </div>
        </div>

        <div className="profilePage__form__form-inputs">
          <div className="left-inputs">
            <div className="textarea">
              <label htmlFor="mail">Adresse mail</label>
              <input
                type="email"
                name="user_mail"
                defaultValue={userProfile.mail}
                disabled="disabled"
              />
              <span id="mailError"></span>
            </div>
            <div className="textarea">
              <label htmlFor="oldpwd">Ancien mot de passe</label>
              <input
                type="password"
                id="oldPwd"
                name="user_oldpwd"
                minLength={8}
                maxLength={15}
                defaultValue=""
              />
            </div>
            <div className="textarea">
              <label htmlFor="newpwd">Nouveau mot de passe</label>
              <input
                type="password"
                id="newPwd"
                name="user_newpwd"
                minLength={8}
                maxLength={15}
                defaultValue=""
              />
              <span id="pwdError"></span>
            </div>
          </div>
          <div className="right-inputs">
            <div className="textarea">
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                id="name"
                name="user_name"
                defaultValue={userProfile.name}
              />
            </div>
            <div className="textarea">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                name="user_firstName"
                defaultValue={userProfile.firstName}
              />
            </div>
            <label htmlFor="sector">Secteur</label>
            <div className="sectorSelect">
              <select
                name="user_sector"
                id="sector"
                className="sectorSelect__list"
              >
                <option defaultValue={userProfile.sector}>
                  {userProfile.sector}
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
            <span className="randomBlock"></span>
          </div>
        </div>
      </form>
      <div className="buttons">
        <input
          type="submit"
          className="button"
          value="METTRE A JOUR"
          id="update"
          title="Mettre à jour le profil"
          onClick={updateProfile}
        />
        <input
          type="submit"
          className="button"
          value="SUPPRIMER LE COMPTE"
          id="delete"
          title="Supprimer le compte"
          onClick={deleteProfile}
        />
      </div>
    </div>
  )
}

export default ModifyProfile
