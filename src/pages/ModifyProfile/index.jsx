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

  const [userMail, setUserMail] = useState(userProfile.mail)
  const [userPwd, setUserPwd] = useState(userProfile.password)
  const [userName, setUserName] = useState(userProfile.name)
  const [userFirstName, setUserFirstName] = useState(userProfile.firstName)
  const [userSector, setUserSector] = useState(userProfile.sector)

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
      await fetch(
        `http://localhost:3000/api/auth/deleteProfile:${userProfile.id}`,
        { method: 'DELETE' }
      )
        .then((res) => res.json())
        .catch((err) => console.log(err))
      document.location.assign('/')
    }
  }
  // function to update user infos (name,mail,profilepic,...)
  async function updateProfile(e) {
    e.preventDefault()
    // Declaring formdata to send via fetch
    const formData = new FormData()
    const userId = userProfile.id
    if (selectedFile) {
      formData.append('image', selectedFile)
    }

    formData.append('userId', userId)
    formData.append('userMail', userMail)
    formData.append('userPwd', userPwd)
    formData.append('userName', userName)
    formData.append('userFirstName', userFirstName)
    formData.append('userSector', userSector)

    const postOrder = {
      method: 'PUT',
      body: formData,
    }
    await fetch('http://localhost:3000/api/auth/update', postOrder)
      .then((res) => res.json())
      .catch((err) => console.log(err))
    // document.location.assign('/home')
  }
  return (
    <div className="profilePage">
      <form className="profilePage__form">
        <div className="profilePage__form__picBlock">
          <div className="profilePage__form__picBlock__picture">
            <img
              src={userProfile.profilePic}
              alt="profile avatar"
              id="profileImgPreview"
            />
          </div>
          <div className="profilePage__form__picBlock__icons">
            <label
              htmlFor="image"
              className="profilePage__form__picBlock__icons__imageLabel"
            >
              <i
                className="fa-solid fa-image"
                title="Modifier photo de profil"
              ></i>
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
        <span id="errors">
          <br />{' '}
        </span>
        <div className="profilePage__form__form-inputs">
          <div className="left-inputs">
            <div className="textarea">
              <label htmlFor="mail">Adresse mail</label>
              <input
                type="email"
                name="user_mail"
                defaultValue={userProfile.mail}
                onChange={setUserMail}
              />
              <span id="mailError"></span>
            </div>
            <div className="textarea">
              <label htmlFor="oldpwd">Ancien mot de passe</label>
              <input
                type="password"
                name="user_oldpwd"
                minLength={8}
                maxLength={15}
                defaultValue=""
              />
              <span id="pwdError"></span>
            </div>
            <div className="textarea">
              <label htmlFor="newpwd">Nouveau mot de passe</label>
              <input
                type="password"
                name="user_newpwd"
                minLength={8}
                maxLength={15}
                defaultValue=""
                onChange={setUserPwd}
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
                onChange={setUserName}
              />
            </div>
            <div className="textarea">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                name="user_firstName"
                defaultValue={userProfile.firstName}
                onChange={setUserFirstName}
              />
            </div>
            <label htmlFor="sector">Secteur</label>
            <div className="sectorSelect">
              <select
                name="user_sector"
                id="sector"
                className="sectorSelect__list"
                onChange={setUserSector}
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
          value="SUPPRIMER"
          id="delete"
          title="Supprimer le compte"
          onClick={deleteProfile}
        />
      </div>
    </div>
  )
}

export default ModifyProfile